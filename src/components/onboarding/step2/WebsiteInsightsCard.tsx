import { useState, useEffect } from 'react';
import { Globe, Sparkles, Loader2, Pencil, Check, Target, Zap, Users, Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { WizardFormData } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WebsiteInsightsCardProps {
  data: WizardFormData;
  detectedPhrases?: string[];
  inferredFields?: string[];
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onEnhance: (field: string) => Promise<void>;
  isEnhancing: Record<string, boolean>;
  isLoading?: boolean; // Show skeletons while URL extraction is in progress
}

interface EditableChipsProps {
  label: string;
  icon: React.ReactNode;
  values: string[];
  onChange: (values: string[]) => void;
  onEnhance?: () => void;
  isEnhancing?: boolean;
  isInferred?: boolean;
  isLoading?: boolean;
}

function EditableChips({ label, icon, values, onChange, onEnhance, isEnhancing, isInferred, isLoading }: EditableChipsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(values.join(', '));
  const [hasAnimated, setHasAnimated] = useState(false);

  // Reset animation state when values change from empty to populated
  useEffect(() => {
    if (values.length > 0 && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [values, hasAnimated]);

  const saveEdit = () => {
    const newValues = editValue.split(',').map(s => s.trim()).filter(Boolean);
    onChange(newValues);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          {label}
          {isInferred && values.length > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/5 text-primary border-primary/20">
              AI-inferred
            </Badge>
          )}
        </span>
        <div className="flex items-center gap-1">
          {onEnhance && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1 text-primary hover:bg-primary/5"
              onClick={onEnhance}
              disabled={isEnhancing}
            >
              {isEnhancing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
            </Button>
          )}
          {!isLoading && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Check className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ) : isEditing ? (
        <div className="space-y-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Comma-separated values..."
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={saveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-wrap gap-1.5"
            initial={values.length > 0 ? { opacity: 0, y: 5 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {values.length > 0 ? values.map((v, i) => (
              <motion.div
                key={`${v}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Badge variant="secondary" className={cn("text-xs", isInferred && "bg-primary/10 border-primary/20")}>
                  {v}
                </Badge>
              </motion.div>
            )) : (
              <span className="text-sm text-muted-foreground italic flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Click enhance to generate
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export function WebsiteInsightsCard({
  data,
  detectedPhrases = [],
  inferredFields = [],
  onUpdate,
  onEnhance,
  isEnhancing,
}: WebsiteInsightsCardProps) {
  const [editingTagline, setEditingTagline] = useState(false);
  const [taglineValue, setTaglineValue] = useState(data.tagline || '');

  // Helper to check if a field was inferred
  const isInferred = (field: string) => inferredFields.includes(field);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Website Context Insights
          </CardTitle>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Gemini urlContext + searchGrounding
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Value Proposition */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Detected Value Proposition
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1 text-primary hover:bg-primary/5"
              onClick={() => onEnhance('tagline')}
              disabled={isEnhancing.tagline}
            >
              {isEnhancing.tagline ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              AI Enhance
            </Button>
          </div>
          {editingTagline ? (
            <div className="space-y-2">
              <Input
                value={taglineValue}
                onChange={(e) => setTaglineValue(e.target.value)}
                className="text-lg font-display"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => {
                  onUpdate({ tagline: taglineValue });
                  setEditingTagline(false);
                }}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingTagline(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p 
              className="text-lg font-display italic cursor-pointer hover:bg-accent/30 p-2 rounded-md transition-colors -ml-2"
              onClick={() => {
                setTaglineValue(data.tagline || '');
                setEditingTagline(true);
              }}
            >
              {data.tagline || 'Click to add value proposition...'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Key Features */}
          <EditableChips
            label="Key Features"
            icon={<Zap className="h-3 w-3" />}
            values={data.key_features || []}
            onChange={(values) => onUpdate({ key_features: values })}
            onEnhance={() => onEnhance('key_features')}
            isEnhancing={isEnhancing.key_features}
            isInferred={isInferred('key_features')}
          />
          
          {/* Product Summary */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Product Summary
            </span>
            <p className="text-sm text-muted-foreground">
              {data.description?.slice(0, 120) || 'An all-in-one workspace for creative teams to brief, generate, review, and approve assets.'}
              {data.description && data.description.length > 120 && '...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Target Audience */}
          <EditableChips
            label="Target Audience"
            icon={<Users className="h-3 w-3" />}
            values={data.target_customers || []}
            onChange={(values) => onUpdate({ target_customers: values })}
            onEnhance={() => onEnhance('target_customers')}
            isEnhancing={isEnhancing.target_customers}
            isInferred={isInferred('target_audience')}
          />

          {/* Detected Phrases */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Quote className="h-3 w-3" />
              Detected Phrases
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detectedPhrases.length > 0 ? detectedPhrases.map((phrase, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-muted/50">
                  {phrase.startsWith('"') ? phrase : `"${phrase}"`}
                </Badge>
              )) : (
                <span className="text-sm text-muted-foreground italic">
                  No brand phrases extracted
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WebsiteInsightsCard;
