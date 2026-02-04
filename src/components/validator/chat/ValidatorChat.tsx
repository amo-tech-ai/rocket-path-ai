/**
 * Validator Chat
 * Main chat-to-validation experience component
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ValidatorChatInput from './ValidatorChatInput';
import ValidatorChatMessage, { ChatMessage } from './ValidatorChatMessage';
import ValidatorProcessingAnimation from './ValidatorProcessingAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ValidatorChatProps {
  startupId: string;
  onValidationComplete?: (reportId: string) => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome! I'm your validation coach. 

Tell me about your startup idea — **what problem are you solving and for whom?**

I'll help turn it into a clear, validated plan.`,
  timestamp: new Date(),
};

const FOLLOW_UP_QUESTIONS = [
  "Who specifically experiences this problem? Tell me about your target customer.",
  "How are people currently solving this? What alternatives exist?",
  "What makes your solution different or better?",
  "Have you talked to potential customers yet? Any early validation?",
];

export default function ValidatorChat({
  startupId,
  onValidationComplete,
}: ValidatorChatProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Check if we have enough info to generate
  const userMessages = messages.filter(m => m.role === 'user');
  const canGenerate = userMessages.length >= 1;

  // Add AI message with typing effect
  const addAIMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, newMessage]);
    }, 800);
  }, []);

  // Handle user message
  const handleSendMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Store extracted data based on question index
    const dataKeys = ['idea', 'customer', 'alternatives', 'differentiation', 'validation'];
    setExtractedData(prev => ({
      ...prev,
      [dataKeys[questionIndex] || 'extra']: content,
    }));

    // Ask follow-up question if we haven't asked enough
    if (questionIndex < FOLLOW_UP_QUESTIONS.length && userMessages.length < 3) {
      setTimeout(() => {
        addAIMessage(FOLLOW_UP_QUESTIONS[questionIndex]);
        setQuestionIndex(prev => prev + 1);
      }, 500);
    } else if (userMessages.length >= 2) {
      // Suggest generating after enough context
      setTimeout(() => {
        addAIMessage(`Great, I have a good picture of your idea! 

**Ready to run the validation analysis?** This will take about 30 seconds.

Click **Generate** when you're ready, or tell me more details.`);
      }, 500);
    }
  }, [questionIndex, userMessages.length, addAIMessage]);

  // Handle generate validation
  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    // Compile all user messages into a description
    const ideaDescription = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');

    // Add confirmation message
    addAIMessage("Perfect! Starting validation analysis now... 🚀");

    // Start processing animation
    setTimeout(() => {
      setIsProcessing(true);
    }, 1000);
  }, [canGenerate, messages, addAIMessage]);

  // Handle processing complete - call the AI agent
  const handleProcessingComplete = useCallback(async () => {
    try {
      const ideaDescription = messages
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join('\n\n');

      // Call the validation agent with chat data
      const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
        body: {
          action: 'generate_validation_report',
          startup_id: startupId,
          report_type: 'deep',
          chat_context: {
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            extracted_data: extractedData,
            idea_description: ideaDescription,
          },
        },
      });

      if (error) throw error;

      setIsProcessing(false);

      // Navigate to report view or callback
      if (onValidationComplete && data?.report?.id) {
        onValidationComplete(data.report.id);
      } else {
        // Navigate to validator with report loaded
        navigate('/validator?showReport=true');
      }

      toast({
        title: 'Validation Complete',
        description: 'Your 14-section report is ready!',
      });
    } catch (error) {
      console.error('Validation error:', error);
      setIsProcessing(false);
      toast({
        title: 'Validation Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  }, [messages, extractedData, startupId, onValidationComplete, navigate, toast]);

  return (
    <>
      {/* Processing Animation Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <ValidatorProcessingAnimation
            isActive={isProcessing}
            onComplete={handleProcessingComplete}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Idea Validator</h2>
              <p className="text-xs text-muted-foreground">
                {canGenerate ? 'Ready to generate' : 'Tell me about your idea'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 max-w-2xl mx-auto">
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

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <ValidatorChatInput
              onSendMessage={handleSendMessage}
              onGenerate={handleGenerate}
              isProcessing={isProcessing}
              canGenerate={canGenerate}
              placeholder="I'm thinking about building..."
            />
          </div>
        </div>
      </div>
    </>
  );
}
