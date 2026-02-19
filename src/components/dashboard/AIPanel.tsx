import { useState, useRef, useEffect } from "react";
import { Sparkles, AlertTriangle, ArrowRight, TrendingUp, Clock, Send, Loader2, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIChat, useAIInsights, SuggestedAction } from "@/hooks/useAIChat";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIPanel = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();
  const { isLoading: _insightsLoading } = useAIInsights();
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Static insights for when AI is not active
  const staticInsights = [
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "Momentum building",
      description: "You've completed 12 tasks this week—40% above your average. Consider scheduling a strategic review.",
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Funding timeline",
      description: "Based on current burn rate and runway, you have 8 months. Recommend starting investor outreach in 2 weeks.",
    },
    {
      type: "action",
      icon: Clock,
      title: "Follow-up needed",
      description: "Sarah Chen hasn't responded in 5 days. This deal is in your top 3 pipeline—consider a warm re-engagement.",
    },
  ];

  const quickPrompts = [
    "What should I focus on today?",
    "Review my investor pipeline",
    "Summarize my progress this week",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue;
    setInputValue('');
    
    const response = await sendMessage(message, 'chat', { screen: 'dashboard' });
    if (response?.suggested_actions) {
      setSuggestedActions(response.suggested_actions);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    setShowChat(true);
    setInputValue(prompt);
    
    const response = await sendMessage(prompt, 'chat', { screen: 'dashboard' });
    if (response?.suggested_actions) {
      setSuggestedActions(response.suggested_actions);
    }
  };

  const handleSuggestedAction = (action: SuggestedAction) => {
    if (action.type === 'navigate' && action.payload?.route) {
      navigate(action.payload.route as string);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sage" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Insights</h3>
            <p className="text-xs text-muted-foreground">
              {showChat ? 'Chat active' : 'Updated just now'}
            </p>
          </div>
        </div>
        {showChat && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => {
              setShowChat(false);
              clearMessages();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showChat ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Chat messages */}
            <ScrollArea className="flex-1 pr-2 -mr-2">
              <div className="space-y-3 pb-2">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about your startup
                    </p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-sage text-sage-foreground ml-4' 
                        : 'bg-secondary mr-4'
                    }`}
                  >
                    {msg.content}
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl mr-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                )}
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Suggested actions */}
            {suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {suggestedActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestedAction(action)}
                  >
                    {action.label}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                ))}
              </div>
            )}

            {/* Chat input */}
            <div className="flex gap-2 pt-2 border-t">
              <Input
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="insights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 flex-1"
          >
            {/* Summary */}
            <div className="p-4 rounded-xl bg-sage-light border border-sage/20">
              <p className="text-sm text-sage-foreground leading-relaxed">
                <span className="font-medium">Today's Focus:</span> Strong progress on product launch. 
                Two high-priority items need attention before EOD. Cash position stable.
              </p>
            </div>

            {/* Insights */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Insights
              </h4>
              {staticInsights.map((insight, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-xl bg-card border border-border hover:border-sage/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      insight.type === "risk" 
                        ? "bg-warm text-warm-foreground" 
                        : insight.type === "opportunity"
                        ? "bg-sage-light text-sage"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      <insight.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium mb-1">{insight.title}</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick prompts */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </h4>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary text-sm text-left transition-colors group"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Ask AI */}
            <div className="pt-4 border-t border-ai-border">
              <Button 
                variant="sage" 
                size="sm" 
                className="w-full"
                onClick={() => setShowChat(true)}
              >
                <Sparkles className="w-4 h-4" />
                Ask AI a question
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIPanel;
