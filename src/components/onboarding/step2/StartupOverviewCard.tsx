import { useState } from 'react';
import { Sparkles, Building2, Loader2, Check, Pencil, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { WizardFormData } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

interface StartupOverviewCardProps {
  data: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onEnhance: (field: string) => Promise<void>;
  isEnhancing: Record<string, boolean>;
  groundingStatus: 'active' | 'inactive';
}

export function StartupOverviewCard({
  data,
  onUpdate,
  onEnhance,
  isEnhancing,
  groundingStatus,
}: StartupOverviewCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (field: string) => {
    onUpdate({ [field]: editValue });
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1 flex-1">
              {editingField === 'company_name' ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-xl font-semibold"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={() => saveEdit('company_name')}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                </div>
              ) : (
                <h2 
                  className="text-xl font-semibold font-display group cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                  onClick={() => startEdit('company_name', data.company_name || data.name || '')}
                >
                  {data.company_name || data.name || 'Company Name'}
                  <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                </h2>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {groundingStatus === 'active' && (
              <Badge variant="outline" className="bg-accent text-accent-foreground text-xs border-primary/20">
                <Globe className="h-3 w-3 mr-1" />
                Search Grounded
              </Badge>
            )}
            {data.industry && (
              <Badge className="bg-primary/10 text-primary border-0">{data.industry}</Badge>
            )}
            {data.business_model?.slice(0, 2).map((m) => (
              <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Context Badge */}
        {data.website_url && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="bg-accent/50 border-primary/10 text-primary text-xs">
              <Check className="h-3 w-3 mr-1" />
              URL Context Extracted
            </Badge>
            <span>Extracted from website + search grounding</span>
          </div>
        )}

        {/* Description Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              AI Summary
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs gap-1 text-primary hover:bg-primary/5"
                onClick={() => onEnhance('description')}
                disabled={isEnhancing.description}
              >
                {isEnhancing.description ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                Enhance
              </Button>
            </div>
          </div>
          {editingField === 'description' ? (
            <div className="space-y-2">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="min-h-[100px] text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveEdit('description')}>Save</Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p 
              className="text-sm text-foreground/90 leading-relaxed cursor-pointer hover:bg-accent/30 p-2 rounded-md transition-colors -ml-2"
              onClick={() => startEdit('description', data.description || '')}
            >
              {data.description || (
                <span className="text-muted-foreground italic">Click to add a description...</span>
              )}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StartupOverviewCard;
