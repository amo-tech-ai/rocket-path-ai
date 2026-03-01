/**
 * Validator Chat
 * Main chat-to-validation experience component
 * Uses AI-powered follow-up questions via Gemini Flash
 * v2: Depth-based coverage, extracted fields, updated readiness rules
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ValidatorChatInput from './ValidatorChatInput';
import ValidatorChatMessage, { ChatMessage } from './ValidatorChatMessage';
import ValidatorProcessingAnimation from './ValidatorProcessingAnimation';
import { useValidatorPipeline } from '@/hooks/useValidatorPipeline';
import {
  useValidatorFollowup,
  useFollowupStreaming,
  checkReadiness,
  hasMinimumData,
  isCovered,
  type FollowupCoverage,
  type ExtractedFields,
  type ConfidenceMap,
  type DiscoveredEntities,
} from '@/hooks/useValidatorFollowup';

interface ValidatorChatProps {
  startupId?: string;
  onValidationComplete?: (reportId: string) => void;
  initialIdea?: string;
  onCoverageUpdate?: (coverage: FollowupCoverage, canGenerate: boolean, extracted?: ExtractedFields, confidence?: ConfidenceMap) => void;
  prefillText?: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome! I'm your validation coach.

Tell me about your startup idea — **what problem are you solving and for whom?**

I'll help turn it into a clear, validated plan.`,
  timestamp: new Date(),
};

// Fallback questions used when the edge function fails — ordered by topic priority.
// Each has a topic key for depth-aware skipping and keywords for text-based detection.
const FALLBACK_QUESTIONS: { topic: keyof FollowupCoverage; question: string; keywords: string[] }[] = [
  { topic: 'company_name', question: "What's the name of your company or product?", keywords: ['called', 'named', 'name is', 'company', 'product name', 'brand'] },
  { topic: 'problem', question: "What specific problem are you solving? What's the cost, how often does it happen, and who feels it most?", keywords: ['problem', 'pain', 'struggle', 'challenge', 'issue', 'frustration'] },
  { topic: 'solution', question: "What's your solution? What's the core feature and how is it 10x better than what exists?", keywords: ['solution', 'product', 'feature', 'build', 'platform', 'tool', 'app', 'service'] },
  { topic: 'customer', question: "Who's your target market? Who pays, who uses it, and where do they operate?", keywords: ['customer', 'consumer', 'user', 'traveler', 'traveller', 'nomad', 'founder', 'agent', 'buyer', 'audience', 'demographic', 'segment', 'persona', 'target'] },
  { topic: 'competitors', question: "What alternatives or workarounds do these people use today?", keywords: ['competitor', 'alternative', 'workaround', 'currently', 'existing', 'today', 'instead', 'compare'] },
  { topic: 'websites', question: "Do you have any URLs to share — your website, LinkedIn, competitor sites, or relevant articles?", keywords: ['http', 'www', '.com', '.io', 'url', 'link', 'site', 'website', 'linkedin'] },
  { topic: 'industry', question: "What industry are you in? (e.g., SaaS, AI, FinTech, Healthcare, E-commerce, Education)", keywords: ['saas', 'fintech', 'healthcare', 'e-commerce', 'ecommerce', 'education', 'ai ', 'industry', 'sector', 'vertical'] },
  { topic: 'business_model', question: "What's your business model? (B2B, B2C, Marketplace, Platform, Services)", keywords: ['b2b', 'b2c', 'marketplace', 'platform', 'subscription', 'freemium', 'revenue', 'pricing', 'monetize', 'business model'] },
  { topic: 'stage', question: "What stage is your company at? (Idea, Pre-seed, Seed, Series A, Series B+)", keywords: ['idea stage', 'pre-seed', 'seed', 'series a', 'series b', 'raised', 'funding', 'revenue', 'stage'] },
  { topic: 'innovation', question: "What's novel about your approach — why now and why you?", keywords: ['novel', 'unique', 'different', 'approach', 'innovation', 'why now', 'advantage', 'special', 'better than', 'unlike'] },
  { topic: 'uniqueness', question: "What's your unfair advantage or moat that competitors can't easily copy?", keywords: ['moat', 'advantage', 'defensible', 'patent', 'network effect', 'data', 'proprietary'] },
  { topic: 'demand', question: "Do you have any evidence people want this — conversations, waitlists, or surveys?", keywords: ['evidence', 'waitlist', 'survey', 'interview', 'feedback', 'pilot', 'beta', 'users signed', 'traction', 'demand'] },
  { topic: 'research', question: "Have you done any market research? What did you learn about the opportunity size?", keywords: ['market size', 'tam', 'sam', 'research', 'opportunity', 'billion', 'million', 'growth', 'report'] },
];

/**
 * Find the next fallback question that hasn't already been covered.
 * Uses depth-based coverage first, falls back to keyword detection.
 */
function pickFallbackQuestion(
  messages: ChatMessage[],
  coverage: FollowupCoverage | null,
  startIndex: number
): { question: string; nextIndex: number } {
  const userText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  for (let i = 0; i < FALLBACK_QUESTIONS.length; i++) {
    const idx = (startIndex + i) % FALLBACK_QUESTIONS.length;
    const fb = FALLBACK_QUESTIONS[idx];

    // Check depth-based coverage first (if available)
    if (coverage && isCovered(coverage[fb.topic])) continue;

    // Fall back to keyword detection
    const alreadyCovered = fb.keywords.some(kw => userText.includes(kw.toLowerCase()));
    if (!alreadyCovered) {
      return { question: fb.question, nextIndex: idx + 1 };
    }
  }

  return {
    question: "Tell me anything else about your idea, or click **Generate** to start the analysis.",
    nextIndex: startIndex + FALLBACK_QUESTIONS.length,
  };
}

const MIN_EXCHANGES = 2;
const MAX_EXCHANGES = 10; // v3: raised to match adaptive 10-message forced readiness

export default function ValidatorChat({
  startupId,
  onValidationComplete,
  initialIdea,
  onCoverageUpdate,
  prefillText,
}: ValidatorChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialIdeaProcessed = useRef(false);
  const followupInFlight = useRef(false);
  const { startValidation, isStarting } = useValidatorPipeline();
  const { getNextQuestion, isLoading: isFollowupLoading } = useValidatorFollowup();
  const { streamingState, subscribe: subscribeToStream, reset: resetStream } = useFollowupStreaming();
  const streamingMessageId = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [latestCoverage, setLatestCoverage] = useState<FollowupCoverage | null>(null);
  const [latestExtracted, setLatestExtracted] = useState<ExtractedFields | null>(null);
  const [latestConfidence, setLatestConfidence] = useState<ConfidenceMap | null>(null);
  const [latestDiscoveries, setLatestDiscoveries] = useState<DiscoveredEntities | null>(null);
  const [latestContradictions, setLatestContradictions] = useState<string[]>([]);
  const [isStreamingMessage, setIsStreamingMessage] = useState(false);
  const lastAssistantRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus management: move focus to new AI messages (AC 38)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant' && lastMsg.id !== 'welcome') {
        setLiveAnnouncement(lastMsg.content);
        requestAnimationFrame(() => {
          lastAssistantRef.current?.focus({ preventScroll: false });
        });
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  // Build conversation messages for the edge function
  const buildConversationMessages = useCallback((msgs: ChatMessage[]) => {
    return msgs
      .filter(m => m.id !== 'welcome' && m.id !== 'typing')
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
  }, []);

  // L3: Update streaming message in-place as tokens arrive
  useEffect(() => {
    if (!isStreamingMessage || !streamingState.isStreaming) return;
    const streamId = streamingMessageId.current;
    if (!streamId) return;

    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === streamId);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], content: streamingState.streamedText };
      return updated;
    });
  }, [streamingState.streamedText, streamingState.isStreaming, isStreamingMessage]);

  // L3: Finalize streaming message when complete
  useEffect(() => {
    if (!isStreamingMessage || streamingState.isStreaming) return;
    const streamId = streamingMessageId.current;
    if (!streamId || !streamingState.metadata) return;

    // Streaming done — apply final text and process metadata
    const meta = streamingState.metadata;
    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === streamId);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], content: meta.question || streamingState.streamedText };
      return updated;
    });

    setLatestCoverage(meta.coverage);
    if (meta.extracted) setLatestExtracted(meta.extracted);
    if (meta.confidence) setLatestConfidence(meta.confidence);
    if (meta.discoveredEntities) setLatestDiscoveries(meta.discoveredEntities);
    if (meta.contradictions?.length) setLatestContradictions(meta.contradictions);

    setIsStreamingMessage(false);
    streamingMessageId.current = null;
    resetStream();
  }, [streamingState.isStreaming, streamingState.metadata, isStreamingMessage, resetStream]);

  // Ask AI for the next question
  const askFollowup = useCallback(async (currentMessages: ChatMessage[]) => {
    if (followupInFlight.current) return;
    followupInFlight.current = true;

    // Safety: auto-reset followupInFlight after 50s even if the call hangs
    const flightTimeout = setTimeout(() => {
      if (followupInFlight.current) {
        console.warn('[ValidatorChat] followupInFlight stuck — auto-resetting after 50s');
        followupInFlight.current = false;
      }
    }, 50_000);

    const conversationMessages = buildConversationMessages(currentMessages);
    const currentUserCount = currentMessages.filter(m => m.role === 'user').length;

    // Hard cap: always enable Generate after MAX_EXCHANGES
    if (currentUserCount >= MAX_EXCHANGES) {
      setCanGenerate(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        followupInFlight.current = false;
        clearTimeout(flightTimeout);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Great, I have a solid picture of your idea!\n\n**Ready to run the validation analysis?** This will take about 30 seconds.\n\nClick **Generate** when you're ready, or tell me more details.`,
          timestamp: new Date(),
        }]);
      }, 800);
      return;
    }

    // L3: Subscribe to broadcast channel for streaming tokens
    const sessionId = `followup-${crypto.randomUUID()}`;
    subscribeToStream(sessionId);

    // Add placeholder streaming message — tokens will fill it in-place
    const streamMsgId = crypto.randomUUID();
    streamingMessageId.current = streamMsgId;
    setIsStreamingMessage(true);
    setIsTyping(true);

    // Add an empty assistant message that will be progressively filled by streaming
    setMessages(prev => [...prev, {
      id: streamMsgId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
    }]);

    try {
      // Pass sessionId so edge function broadcasts tokens
      // Wrap in Promise.race with 45s timeout to prevent hanging forever
      const result = await Promise.race([
        getNextQuestion([...conversationMessages], sessionId),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Followup request timed out after 45s')), 45_000)
        ),
      ]);

      clearTimeout(flightTimeout);

      // Streaming metadata may have already arrived via broadcast.
      // The HTTP response is the source of truth for coverage/extracted.
      setIsTyping(false);

      if (result) {
        // Track latest coverage + extracted + confidence + discoveries
        setLatestCoverage(result.coverage);
        if (result.extracted) setLatestExtracted(result.extracted);
        if (result.confidence) setLatestConfidence(result.confidence);
        if (result.discoveredEntities) setLatestDiscoveries(result.discoveredEntities);
        if (result.contradictions?.length) setLatestContradictions(result.contradictions);

        // Check readiness with v2 rules
        const isReady = result.action === 'ready' || checkReadiness(result.coverage, currentUserCount);

        // Allow ready with single substantial message (pasted/long idea from homepage)
        const totalUserChars = currentMessages
          .filter(m => m.role === 'user')
          .reduce((sum, m) => sum + (m.content?.length || 0), 0);
        const substantialSingleMessage = currentUserCount === 1 && totalUserChars >= 400;

        // Notify parent of coverage + extracted + confidence updates
        if (onCoverageUpdate) {
          const willBeReady = (isReady && (currentUserCount >= MIN_EXCHANGES || substantialSingleMessage))
            || currentUserCount >= MAX_EXCHANGES;
          onCoverageUpdate(result.coverage, willBeReady, result.extracted, result.confidence);
        }

        if (isReady && (currentUserCount >= MIN_EXCHANGES || substantialSingleMessage)) {
          setCanGenerate(true);
          // Clean up any streaming placeholder — replace with ready message
          setIsStreamingMessage(false);
          streamingMessageId.current = null;
          resetStream();
          followupInFlight.current = false;
          setMessages(prev => {
            // Remove the streaming placeholder if it exists with no content
            const cleaned = prev.filter(m => m.id !== streamMsgId || m.content.length > 0);
            return [...cleaned, {
              id: crypto.randomUUID(),
              role: 'assistant' as const,
              content: `Great, I have a solid picture of your idea!\n\n**Ready to run the validation analysis?** This will take about 30 seconds.\n\nClick **Generate** when you're ready, or tell me more details.`,
              timestamp: new Date(),
            }];
          });
        } else {
          let question = result.question;
          if (!question) {
            const fb = pickFallbackQuestion(currentMessages, result.coverage, fallbackIndex);
            question = fb.question;
            setFallbackIndex(fb.nextIndex);
          }

          // If streaming finalize effect already handled the message, skip.
          // Otherwise, set message from the HTTP response (source of truth).
          const streamAlreadyFinalized = streamingMessageId.current === null;
          setIsStreamingMessage(false);
          streamingMessageId.current = null;
          resetStream();
          followupInFlight.current = false;
          if (!streamAlreadyFinalized) {
            setMessages(prev => {
              const streamIdx = prev.findIndex(m => m.id === streamMsgId);
              if (streamIdx !== -1 && prev[streamIdx].content.length > 0) {
                // Streaming delivered content — update with final question
                const updated = [...prev];
                updated[streamIdx] = { ...updated[streamIdx], content: question };
                return updated;
              }
              // No streaming content — add as new message
              const cleaned = prev.filter(m => m.id !== streamMsgId);
              return [...cleaned, {
                id: crypto.randomUUID(),
                role: 'assistant' as const,
                content: question,
                timestamp: new Date(),
              }];
            });
          }
        }
      } else {
        // Edge function failed — use depth-aware fallback
        console.warn('[ValidatorChat] AI followup failed, using context-aware fallback');
        clearTimeout(flightTimeout);
        setIsStreamingMessage(false);
        streamingMessageId.current = null;
        resetStream();

        const fb = pickFallbackQuestion(currentMessages, latestCoverage, fallbackIndex);
        setFallbackIndex(fb.nextIndex);

        const totalUserChars = currentMessages
          .filter(m => m.role === 'user')
          .reduce((sum, m) => sum + (m.content?.length || 0), 0);
        if (currentUserCount >= MIN_EXCHANGES || totalUserChars >= 200) {
          setCanGenerate(true);
        }

        followupInFlight.current = false;
        setMessages(prev => {
          const cleaned = prev.filter(m => m.id !== streamMsgId);
          return [...cleaned, {
            id: crypto.randomUUID(),
            role: 'assistant' as const,
            content: fb.question,
            timestamp: new Date(),
          }];
        });
      }
    } catch (err) {
      console.warn('[ValidatorChat] Network error or timeout, using context-aware fallback', err);
      clearTimeout(flightTimeout);
      setIsTyping(false);
      setIsStreamingMessage(false);
      streamingMessageId.current = null;
      resetStream();

      const fb = pickFallbackQuestion(currentMessages, latestCoverage, fallbackIndex);
      setFallbackIndex(fb.nextIndex);

      const totalUserChars = currentMessages
        .filter(m => m.role === 'user')
        .reduce((sum, m) => sum + (m.content?.length || 0), 0);
      if (currentUserCount >= MIN_EXCHANGES || totalUserChars >= 200) {
        setCanGenerate(true);
      }

      followupInFlight.current = false;
      setMessages(prev => {
        const cleaned = prev.filter(m => m.id !== streamMsgId);
        return [...cleaned, {
          id: crypto.randomUUID(),
          role: 'assistant' as const,
          content: fb.question,
          timestamp: new Date(),
        }];
      });
    }
  }, [buildConversationMessages, getNextQuestion, fallbackIndex, latestCoverage, onCoverageUpdate, subscribeToStream, resetStream]);

  // Process initial idea from homepage if provided
  useEffect(() => {
    if (initialIdea && !initialIdeaProcessed.current) {
      initialIdeaProcessed.current = true;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: initialIdea,
        timestamp: new Date(),
      };

      const introMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Great start! I've captured your idea. Let me ask a few quick questions to strengthen the analysis.",
        timestamp: new Date(),
      };

      const updatedMessages = [...[WELCOME_MESSAGE], userMessage, introMessage];
      setMessages(updatedMessages);

      setTimeout(() => {
        askFollowup(updatedMessages);
      }, 500);
    }
  }, [initialIdea]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle user message
  const handleSendMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      setTimeout(() => askFollowup(updated), 100);
      return updated;
    });
  }, [askFollowup]);

  // 4B: Check if minimum data threshold is met for generation
  // Bypass when canGenerate is already true (system decided readiness) or after MAX_EXCHANGES
  const meetsMinimumData = canGenerate
    || userMessageCount >= MAX_EXCHANGES
    || (latestCoverage ? hasMinimumData(latestCoverage) : false);

  // Quick generate: send text + start pipeline immediately (skip Q&A)
  const handleSendAndGenerate = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const ideaDescription = updatedMessages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Starting validation analysis now...",
        timestamp: new Date(),
      }]);
    }, 800);

    setTimeout(() => {
      setIsProcessing(true);
    }, 1000);

    setTimeout(async () => {
      await startValidation(ideaDescription, startupId, true, null);
      setIsProcessing(false);
    }, 2000);
  }, [messages, startValidation, startupId]);

  // Handle generate validation
  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    const ideaDescription = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Perfect! Starting validation analysis now...",
        timestamp: new Date(),
      }]);
    }, 800);

    setTimeout(() => {
      setIsProcessing(true);
    }, 1000);

    setTimeout(async () => {
      // 002-EFN: Pass interview context to pipeline for smarter extraction
      const interviewContext = latestCoverage && latestExtracted
        ? {
            coverage: latestCoverage,
            extracted: latestExtracted,
            confidence: latestConfidence || undefined,
            discoveredEntities: latestDiscoveries || undefined,
          }
        : null;
      await startValidation(ideaDescription, startupId, true, interviewContext);
      setIsProcessing(false);
    }, 2000);
  }, [canGenerate, messages, startValidation, startupId, latestCoverage, latestExtracted, latestConfidence, latestDiscoveries]);

  return (
    <>
      <AnimatePresence>
        {isProcessing && (
          <ValidatorProcessingAnimation
            isActive={isProcessing}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">Idea Validator</h2>
              <p className="text-xs text-muted-foreground">
                {canGenerate && meetsMinimumData
                  ? 'Ready to generate your 14-section report'
                  : canGenerate && !meetsMinimumData
                    ? 'Describe the problem and customer for a better report'
                    : 'Describe your startup idea to begin'}
              </p>
            </div>
            {canGenerate && meetsMinimumData && (
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            )}
          </div>
          {latestContradictions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {latestContradictions.map((c, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-status-warning-light text-status-warning">
                  Clarify: {c.length > 60 ? c.slice(0, 57) + '...' : c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-4 max-w-[1100px] mx-auto" role="log" aria-label="Validation chat messages" aria-busy={isTyping}>
            {messages.map((message, index) => (
              <ValidatorChatMessage
                key={message.id}
                ref={message.role === 'assistant' && index === messages.length - 1 ? lastAssistantRef : undefined}
                message={message}
              />
            ))}

            {isTyping && !isStreamingMessage && (
              <ValidatorChatMessage
                message={{
                  id: 'typing',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date(),
                }}
                isTyping
              />
            )}
          </div>
        </ScrollArea>

        {/* Screen reader live region for new AI messages (AC 37) */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 md:p-6 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="max-w-[1100px] mx-auto">
            <ValidatorChatInput
              onSendMessage={handleSendMessage}
              onGenerate={handleGenerate}
              onSendAndGenerate={handleSendAndGenerate}
              isProcessing={isProcessing || isTyping}
              canGenerate={canGenerate && meetsMinimumData}
              generateDisabledReason={
                !canGenerate
                  ? 'Answer a few more questions for a better report'
                  : !meetsMinimumData
                    ? 'Describe the problem and target customer first'
                    : undefined
              }
              placeholder="Describe your startup idea in detail..."
              prefillText={prefillText}
            />
          </div>
        </div>
      </div>
    </>
  );
}
