import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Pencil, Check, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { WizardFormData, ReadinessScore } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

interface Step2AnalysisProps {
  data: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  readinessScore: ReadinessScore | null;
  onRecalculate: () => void;
  onEnhanceField: (fieldName: string) => Promise<void>;
  isCalculating: boolean;
  isEnhancing: Record<string, boolean>;
}

function getScoreLabel(score: number) {
  if (score >= 80) return { label: 'EXCELLENT', color: 'text-primary' };
  if (score >= 65) return { label: 'GOOD', color: 'text-primary/80' };
  if (score >= 50) return { label: 'FAIR', color: 'text-muted-foreground' };
  return { label: 'NEEDS WORK', color: 'text-destructive' };
}

interface EditableFieldProps {
  label: string;
  value: string | string[];
  onSave: (value: string | string[]) => void;
  onEnhance?: () => void;
  isEnhancing?: boolean;
  type?: 'text' | 'textarea' | 'list';
}

function EditableField({
  label,
  value,
  onSave,
  onEnhance,
  isEnhancing = false,
  type = 'text',
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    Array.isArray(value) ? value.join(', ') : value
  );

  const handleSave = () => {
    const newValue = type === 'list' 
      ? editValue.split(',').map(s => s.trim()).filter(Boolean)
      : editValue;
    onSave(newValue);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1">
          {onEnhance && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
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
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Check className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          {type === 'textarea' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md"
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm">
          {Array.isArray(value) ? (
            <span className="flex flex-wrap gap-1">
              {value.map((v, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{v}</Badge>
              ))}
            </span>
          ) : value || <span className="text-muted-foreground italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

export function Step2Analysis({
  data,
  onUpdate,
  readinessScore,
  onRecalculate,
  onEnhanceField,
  isCalculating,
  isEnhancing,
}: Step2AnalysisProps) {
  const scoreInfo = readinessScore 
    ? getScoreLabel(readinessScore.overall_score) 
    : { label: 'CALCULATING', color: 'text-muted-foreground' };

  return (
    <div className="space-y-6">
      {/* Company Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{data.name || data.company_name || 'Your Company'}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {data.tagline || 'Add a compelling one-liner'}
              </p>
            </div>
            <div className="flex gap-1">
              {data.industry && <Badge>{data.industry}</Badge>}
              {data.business_model?.map((m, i) => (
                <Badge key={i} variant="secondary">{m}</Badge>
              ))}
              {data.stage && <Badge variant="outline">{data.stage}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="Description"
            value={data.description || ''}
            onSave={(value) => onUpdate({ description: value as string })}
            onEnhance={() => onEnhanceField('description')}
            isEnhancing={isEnhancing.description}
            type="textarea"
          />
        </CardContent>
      </Card>

      {/* Key Insights Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key Insights from Your Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="Value Proposition"
            value={data.tagline || ''}
            onSave={(value) => onUpdate({ tagline: value as string })}
            onEnhance={() => onEnhanceField('tagline')}
            isEnhancing={isEnhancing.tagline}
          />
          
          <EditableField
            label="Key Features"
            value={data.key_features || []}
            onSave={(value) => onUpdate({ key_features: value as string[] })}
            onEnhance={() => onEnhanceField('key_features')}
            isEnhancing={isEnhancing.key_features}
            type="list"
          />
          
          <EditableField
            label="Target Customers"
            value={data.target_customers || []}
            onSave={(value) => onUpdate({ target_customers: value as string[] })}
            onEnhance={() => onEnhanceField('target_customers')}
            isEnhancing={isEnhancing.target_customers}
            type="list"
          />
          
          <EditableField
            label="Competitors"
            value={data.competitors || []}
            onSave={(value) => onUpdate({ competitors: value as string[] })}
            onEnhance={() => onEnhanceField('competitors')}
            isEnhancing={isEnhancing.competitors}
            type="list"
          />
        </CardContent>
      </Card>

      {/* Team Overview */}
      {data.founders && data.founders.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.founders.map((founder) => (
                <div key={founder.id} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {founder.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{founder.name}</p>
                    <p className="text-xs text-muted-foreground">{founder.role}</p>
                  </div>
                  {founder.enriched && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Step2Analysis;
