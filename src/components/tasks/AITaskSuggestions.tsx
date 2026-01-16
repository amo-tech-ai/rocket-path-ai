import { useState } from 'react';
import { Sparkles, Plus, Loader2, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskSuggestion {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  estimated_time?: string;
}

interface AITaskSuggestionsProps {
  startupId: string;
  startupContext: {
    name?: string;
    stage?: string;
    industry?: string;
  };
  onAcceptTask: (task: { title: string; description?: string; priority: string }) => Promise<void>;
}

export function AITaskSuggestions({ 
  startupId, 
  startupContext, 
  onAcceptTask 
}: AITaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [acceptingIndex, setAcceptingIndex] = useState<number | null>(null);

  const generateTasks = async () => {
    setIsGenerating(true);
    setSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `Generate 5 actionable onboarding tasks for my startup. Focus on practical next steps based on my stage and industry.`,
          action: 'generate_tasks',
          context: {
            screen: 'tasks',
            startup_id: startupId,
            data: startupContext
          }
        }
      });

      if (error) throw error;

      // Parse the response to extract tasks
      const responseText = data?.response || data?.message || '';
      const parsedTasks = parseTasksFromResponse(responseText);
      
      if (parsedTasks.length > 0) {
        setSuggestions(parsedTasks);
        toast.success(`Generated ${parsedTasks.length} task suggestions`);
      } else {
        toast.info('No specific tasks could be extracted. Try again or create tasks manually.');
      }
    } catch (err) {
      console.error('Task generation error:', err);
      toast.error('Failed to generate tasks. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseTasksFromResponse = (response: string): TaskSuggestion[] => {
    const tasks: TaskSuggestion[] = [];
    
    // Try to parse JSON if the response contains it
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.tasks)) {
          return parsed.tasks.slice(0, 8).map((t: any) => ({
            title: t.title || t.name || 'Untitled Task',
            description: t.description || '',
            priority: normalizePriority(t.priority),
            category: t.category || 'general',
            estimated_time: t.estimated_time || t.estimatedTime || '',
          }));
        }
      }
    } catch {
      // Fall back to text parsing
    }

    // Parse numbered or bulleted list
    const lines = response.split('\n').filter(line => line.trim());
    for (const line of lines) {
      const taskMatch = line.match(/^[\d\-\*\•]+[\.\):]?\s*(.+)/);
      if (taskMatch) {
        const taskText = taskMatch[1].trim();
        if (taskText.length > 10 && taskText.length < 200) {
          // Extract priority from text if mentioned
          let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
          if (/urgent|critical|asap/i.test(taskText)) priority = 'urgent';
          else if (/high|important/i.test(taskText)) priority = 'high';
          else if (/low|optional/i.test(taskText)) priority = 'low';

          tasks.push({
            title: taskText.replace(/\*\*/g, '').slice(0, 100),
            priority,
            category: 'general',
          });
        }
      }
    }

    return tasks.slice(0, 8);
  };

  const normalizePriority = (p: string): 'low' | 'medium' | 'high' | 'urgent' => {
    const lower = String(p || '').toLowerCase();
    if (lower.includes('urgent') || lower.includes('critical')) return 'urgent';
    if (lower.includes('high')) return 'high';
    if (lower.includes('low')) return 'low';
    return 'medium';
  };

  const handleAcceptTask = async (suggestion: TaskSuggestion, index: number) => {
    setAcceptingIndex(index);
    try {
      await onAcceptTask({
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority,
      });
      // Remove from suggestions
      setSuggestions(prev => prev.filter((_, i) => i !== index));
      toast.success('Task added');
    } catch (err) {
      toast.error('Failed to add task');
    } finally {
      setAcceptingIndex(null);
    }
  };

  const dismissSuggestion = (index: number) => {
    setSuggestions(prev => prev.filter((_, i) => i !== index));
  };

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-secondary text-secondary-foreground',
    high: 'bg-warm/20 text-warm-foreground',
    urgent: 'bg-destructive/20 text-destructive',
  };

  return (
    <Card className="border-sage/20 bg-sage-light/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-sage" />
          AI Task Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length === 0 ? (
          <>
            <p className="text-xs text-muted-foreground">
              Let AI suggest actionable tasks based on your startup's stage and goals.
            </p>
            <Button 
              onClick={generateTasks} 
              disabled={isGenerating}
              variant="sage"
              size="sm"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Task Ideas
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={generateTasks}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Regenerate'}
              </Button>
            </div>
            
            <AnimatePresence mode="popLayout">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={`${suggestion.title}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-background border border-border"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{suggestion.title}</p>
                      {suggestion.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {suggestion.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={priorityColors[suggestion.priority]}>
                          {suggestion.priority}
                        </Badge>
                        {suggestion.category && suggestion.category !== 'general' && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-sage hover:text-sage hover:bg-sage-light"
                        onClick={() => handleAcceptTask(suggestion, index)}
                        disabled={acceptingIndex === index}
                      >
                        {acceptingIndex === index ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => dismissSuggestion(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </CardContent>
    </Card>
  );
}
