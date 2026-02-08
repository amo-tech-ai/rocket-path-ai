/**
 * Validator Chat
 * Main chat-to-validation experience component
 * Uses AI-powered follow-up questions via Gemini Flash
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ValidatorChatInput from './ValidatorChatInput';
import ValidatorChatMessage, { ChatMessage } from './ValidatorChatMessage';
import ValidatorProcessingAnimation from './ValidatorProcessingAnimation';
import { useValidatorPipeline } from '@/hooks/useValidatorPipeline';
import { useValidatorFollowup, type FollowupCoverage } from '@/hooks/useValidatorFollowup';

interface ValidatorChatProps {
  startupId?: string;
  onValidationComplete?: (reportId: string) => void;
  initialIdea?: string;
  onCoverageUpdate?: (coverage: FollowupCoverage, canGenerate: boolean) => void;
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
// Each has keywords to detect if the topic was already discussed in chat.
const FALLBACK_QUESTIONS: { question: string; keywords: string[] }[] = [
  { question: "Who specifically would use this? What's their role, industry, or situation?", keywords: ['customer', 'consumer', 'user', 'traveler', 'traveller', 'nomad', 'founder', 'agent', 'buyer', 'audience', 'demographic', 'segment', 'persona', 'target'] },
  { question: "What alternatives or workarounds do these people use today?", keywords: ['competitor', 'alternative', 'workaround', 'currently', 'existing', 'today', 'instead', 'compare', 'mindtrip', 'tripit', 'kayak', 'google travel'] },
  { question: "What's novel about your approach — why now and why you?", keywords: ['novel', 'unique', 'different', 'approach', 'innovation', 'why now', 'advantage', 'special', 'better than', 'unlike'] },
  { question: "What's your unfair advantage or moat that competitors can't easily copy?", keywords: ['moat', 'advantage', 'defensible', 'patent', 'network effect', 'data', 'proprietary'] },
  { question: "Do you have any evidence people want this — conversations, waitlists, or surveys?", keywords: ['evidence', 'waitlist', 'survey', 'interview', 'feedback', 'pilot', 'beta', 'users signed', 'traction', 'demand'] },
  { question: "Have you done any market research? What did you learn about the opportunity size?", keywords: ['market size', 'tam', 'sam', 'research', 'opportunity', 'billion', 'million', 'growth', 'report'] },
];

/**
 * Find the next fallback question that hasn't already been covered in conversation.
 * Checks user messages for keyword overlap to avoid re-asking answered topics.
 */
function pickFallbackQuestion(messages: ChatMessage[], startIndex: number): { question: string; nextIndex: number } {
  const userText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  for (let i = 0; i < FALLBACK_QUESTIONS.length; i++) {
    const idx = (startIndex + i) % FALLBACK_QUESTIONS.length;
    const fb = FALLBACK_QUESTIONS[idx];
    const alreadyCovered = fb.keywords.some(kw => userText.includes(kw.toLowerCase()));
    if (!alreadyCovered) {
      return { question: fb.question, nextIndex: idx + 1 };
    }
  }
  // All topics seem covered — return a generic prompt
  return {
    question: "Tell me anything else about your idea, or click **Generate** to start the analysis.",
    nextIndex: startIndex + FALLBACK_QUESTIONS.length,
  };
}

const MIN_EXCHANGES = 2;
const MAX_EXCHANGES = 7;

export default function ValidatorChat({
  startupId,
  onValidationComplete,
  initialIdea,
  onCoverageUpdate,
  prefillText,
}: ValidatorChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialIdeaProcessed = useRef(false);
  const followupInFlight = useRef(false); // G1: Guard against concurrent AI calls
  const { startValidation, isStarting } = useValidatorPipeline();
  const { getNextQuestion, isLoading: isFollowupLoading } = useValidatorFollowup();

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  // Build conversation messages for the edge function (exclude welcome and typing)
  const buildConversationMessages = useCallback((msgs: ChatMessage[]) => {
    return msgs
      .filter(m => m.id !== 'welcome' && m.id !== 'typing')
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
  }, []);

  // Ask AI for the next question, with fallback and concurrency guard
  const askFollowup = useCallback(async (currentMessages: ChatMessage[]) => {
    // G1: Prevent concurrent AI calls
    if (followupInFlight.current) return;
    followupInFlight.current = true;

    const conversationMessages = buildConversationMessages(currentMessages);
    const currentUserCount = currentMessages.filter(m => m.role === 'user').length;

    // Hard cap: always enable Generate after MAX_EXCHANGES user messages
    if (currentUserCount >= MAX_EXCHANGES) {
      setCanGenerate(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        followupInFlight.current = false;
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Great, I have a solid picture of your idea!\n\n**Ready to run the validation analysis?** This will take about 30 seconds.\n\nClick **Generate** when you're ready, or tell me more details.`,
          timestamp: new Date(),
        }]);
      }, 800);
      return;
    }

    setIsTyping(true);

    try {
      const result = await getNextQuestion(conversationMessages);

      if (result) {
        // Notify parent of coverage updates
        if (result.coverage && onCoverageUpdate) {
          const willBeReady = result.action === 'ready' && currentUserCount >= MIN_EXCHANGES;
          onCoverageUpdate(result.coverage, willBeReady || currentUserCount >= MAX_EXCHANGES);
        }

        // Ignore "ready" signal before MIN_EXCHANGES
        if (result.action === 'ready' && currentUserCount >= MIN_EXCHANGES) {
          setCanGenerate(true);
          setTimeout(() => {
            setIsTyping(false);
            followupInFlight.current = false;
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: `Great, I have a solid picture of your idea!\n\n**Ready to run the validation analysis?** This will take about 30 seconds.\n\nClick **Generate** when you're ready, or tell me more details.`,
              timestamp: new Date(),
            }]);
          }, 800);
        } else {
          // Ask the AI-generated question, with context-aware fallback if empty
          let question = result.question;
          if (!question) {
            const fb = pickFallbackQuestion(currentMessages, fallbackIndex);
            question = fb.question;
            setFallbackIndex(fb.nextIndex);
          }
          setTimeout(() => {
            setIsTyping(false);
            followupInFlight.current = false;
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: question,
              timestamp: new Date(),
            }]);
          }, 800);
        }
      } else {
        // Edge function failed — use context-aware fallback (skips covered topics)
        console.warn('[ValidatorChat] AI followup failed, using context-aware fallback');
        const fb = pickFallbackQuestion(currentMessages, fallbackIndex);
        setFallbackIndex(fb.nextIndex);

        // Enable Generate after enough fallback exchanges
        if (currentUserCount >= MIN_EXCHANGES + 1 && fallbackIndex >= 2) {
          setCanGenerate(true);
        }

        setTimeout(() => {
          setIsTyping(false);
          followupInFlight.current = false;
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: fb.question,
            timestamp: new Date(),
          }]);
        }, 800);
      }
    } catch {
      // Network error — use context-aware fallback (skips covered topics)
      console.warn('[ValidatorChat] Network error, using context-aware fallback');
      const fb = pickFallbackQuestion(currentMessages, fallbackIndex);
      setFallbackIndex(fb.nextIndex);

      if (currentUserCount >= MIN_EXCHANGES + 1 && fallbackIndex >= 2) {
        setCanGenerate(true);
      }

      setIsTyping(false);
      followupInFlight.current = false;
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fb.question,
        timestamp: new Date(),
      }]);
    }
  }, [buildConversationMessages, getNextQuestion, fallbackIndex, onCoverageUpdate]);

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

      // Get first AI-powered follow-up based on the idea
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
      // Trigger AI follow-up after state update
      setTimeout(() => askFollowup(updated), 100);
      return updated;
    });
  }, [askFollowup]);

  // Handle generate validation
  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    // Compile all user messages into a description
    const ideaDescription = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');

    // Add confirmation message
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

    // Start processing animation
    setTimeout(() => {
      setIsProcessing(true);
    }, 1000);

    // Start the actual pipeline after brief animation
    setTimeout(async () => {
      await startValidation(ideaDescription, startupId, true);
      setIsProcessing(false);
    }, 2000);
  }, [canGenerate, messages, startValidation, startupId]);

  return (
    <>
      {/* Processing Animation Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <ValidatorProcessingAnimation
            isActive={isProcessing}
            onComplete={() => {}} // Pipeline handles navigation now
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
                {canGenerate ? 'Ready to generate your 14-section report' : 'Describe your startup idea to begin'}
              </p>
            </div>
            {canGenerate && (
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            )}
          </div>
        </div>

        {/* Messages - Wide container */}
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-4 max-w-[1100px] mx-auto">
            {messages.map((message) => (
              <ValidatorChatMessage
                key={message.id}
                message={message}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
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

        {/* Input Area - Wide */}
        <div className="flex-shrink-0 p-4 md:p-6 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="max-w-[1100px] mx-auto">
            <ValidatorChatInput
              onSendMessage={handleSendMessage}
              onGenerate={handleGenerate}
              isProcessing={isProcessing || isTyping}
              canGenerate={canGenerate}
              placeholder="Describe your startup idea in detail..."
              prefillText={prefillText}
            />
          </div>
        </div>
      </div>
    </>
  );
}
