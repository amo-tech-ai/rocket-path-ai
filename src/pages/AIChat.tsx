import { useState, useRef, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Send, 
  Sparkles, 
  History, 
  Lightbulb,
  TrendingUp,
  FileText,
  Users,
  Presentation,
  Loader2,
  MessageSquare,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIChat, AIMessage } from "@/hooks/useAIChat";
import { useStartup } from "@/hooks/useDashboardData";
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

// Quick action suggestions
const quickActions = [
  { label: "Review my pitch deck", icon: Presentation, action: "Review my pitch deck and suggest improvements" },
  { label: "Analyze my traction", icon: TrendingUp, action: "Analyze my current traction metrics and suggest next steps" },
  { label: "Find investors", icon: Users, action: "Help me find investors that match my startup profile" },
  { label: "Generate tasks", icon: Lightbulb, action: "Generate high-priority tasks for my current stage" },
];

// Chat message component
function ChatMessage({ message, isLast }: { message: AIMessage; isLast: boolean }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-primary-foreground">You</span>
        </div>
      )}
    </motion.div>
  );
}

// AI Context Panel
function AIContextPanel({ startup }: { startup: { name?: string; industry?: string; stage?: string } | null }) {
  return (
    <div className="space-y-4">
      {/* Context Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Brain className="w-4 h-4 text-primary" />
            AI Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Startup</span>
              <span className="font-medium">{startup?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Industry</span>
              <span className="font-medium">{startup?.industry || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Stage</span>
              <Badge variant="secondary" className="text-xs">
                {startup?.stage || 'Unknown'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <TrendingUp className="w-3 h-3 mr-2" />
            Get Industry Benchmarks
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <Presentation className="w-3 h-3 mr-2" />
            Pitch Deck Review
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <FileText className="w-3 h-3 mr-2" />
            Traction Analysis
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <Users className="w-3 h-3 mr-2" />
            Investor Matching
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <History className="w-4 h-4 text-muted-foreground" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-4">
            Chat history will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const AIChat = () => {
  const { data: startup } = useStartup();
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    
    await sendMessage(message, 'chat', {
      screen: 'ai-chat',
      startup_id: startup?.id,
      data: {
        startup_name: startup?.name,
        industry: startup?.industry,
        stage: startup?.stage,
      },
    });
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout aiPanel={<AIContextPanel startup={startup} />}>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              AI Chat
            </h1>
            <p className="text-muted-foreground text-sm">
              Your startup advisor, powered by AI
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearMessages}>
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Start a Conversation</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-md">
                  Ask me anything about fundraising, growth strategy, pitch decks, 
                  or get personalized recommendations for your startup.
                </p>
                
                {/* Quick Action Cards */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <action.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={index} 
                      message={message} 
                      isLast={index === messages.length - 1} 
                    />
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your startup..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are generated based on your startup profile and may not be 100% accurate.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIChat;
