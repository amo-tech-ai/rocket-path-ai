/**
 * Lean Canvas Section Component
 * Mini Lean Canvas with AI-assisted field suggestions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface LeanCanvasData {
  problem?: string;
  solution?: string;
  uniqueValueProp?: string;
  unfairAdvantage?: string;
  customerSegments?: string;
  keyMetrics?: string;
  channels?: string;
  costStructure?: string;
  revenueStreams?: string;
}

export interface CanvasFieldSuggestion {
  id: string;
  title: string;
  explanation: string;
}

interface LeanCanvasSectionProps {
  data: LeanCanvasData;
  onChange: (field: keyof LeanCanvasData, value: string) => void;
  onRequestSuggestions: (field: keyof LeanCanvasData) => void;
  fieldSuggestions: Record<string, CanvasFieldSuggestion[]>;
  loadingField?: keyof LeanCanvasData | null;
  onAddSuggestion: (field: keyof LeanCanvasData, suggestion: CanvasFieldSuggestion) => void;
}

const CANVAS_FIELDS: Array<{
  key: keyof LeanCanvasData;
  label: string;
  placeholder: string;
  description: string;
}> = [
  {
    key: 'problem',
    label: 'Problem',
    placeholder: 'Top 3 problems you solve',
    description: 'What pain points do customers have?',
  },
  {
    key: 'solution',
    label: 'Solution',
    placeholder: 'Your solution to each problem',
    description: 'How do you solve these problems?',
  },
  {
    key: 'uniqueValueProp',
    label: 'Unique Value Proposition',
    placeholder: 'Clear, compelling message',
    description: 'Why should customers choose you?',
  },
  {
    key: 'customerSegments',
    label: 'Customer Segments',
    placeholder: 'Target customers and users',
    description: 'Who are your early adopters?',
  },
  {
    key: 'channels',
    label: 'Channels',
    placeholder: 'Path to customers',
    description: 'How do you reach customers?',
  },
  {
    key: 'revenueStreams',
    label: 'Revenue Streams',
    placeholder: 'Revenue model',
    description: 'How do you make money?',
  },
];

export function LeanCanvasSection({
  data,
  onChange,
  onRequestSuggestions,
  fieldSuggestions,
  loadingField,
  onAddSuggestion,
}: LeanCanvasSectionProps) {
  const [expandedFields, setExpandedFields] = useState<Set<keyof LeanCanvasData>>(new Set());
  const [activeField, setActiveField] = useState<keyof LeanCanvasData | null>(null);

  const toggleField = (field: keyof LeanCanvasData) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(field)) {
      newExpanded.delete(field);
    } else {
      newExpanded.add(field);
    }
    setExpandedFields(newExpanded);
  };

  const handleRequestSuggestions = (field: keyof LeanCanvasData) => {
    setActiveField(field);
    onRequestSuggestions(field);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Lean Canvas Preview</h3>
          <p className="text-xs text-muted-foreground">
            AI will help populate your business model canvas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {CANVAS_FIELDS.map((field) => {
          const isExpanded = expandedFields.has(field.key);
          const suggestions = fieldSuggestions[field.key] || [];
          const isLoading = loadingField === field.key;
          const value = data[field.key] || '';

          return (
            <div
              key={field.key}
              className={cn(
                'border border-border rounded-lg overflow-hidden transition-all',
                isExpanded && 'col-span-2'
              )}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleField(field.key)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{field.label}</span>
                  {value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestSuggestions(field.key);
                    }}
                    disabled={isLoading}
                    className="h-6 w-6 p-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-sage" />
                    )}
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 space-y-2"
                  >
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                    <Textarea
                      value={value}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="min-h-[60px] text-xs resize-none"
                    />

                    {/* AI Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-border">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          AI Suggestions
                        </p>
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="group flex items-start justify-between gap-2 p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">
                                {suggestion.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {suggestion.explanation}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onAddSuggestion(field.key, suggestion)}
                              className="opacity-0 group-hover:opacity-100 h-6 px-2 text-xs"
                            >
                              <Plus className="w-2.5 h-2.5 mr-1" />
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
