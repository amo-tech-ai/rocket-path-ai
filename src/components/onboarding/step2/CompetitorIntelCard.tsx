import { useState } from 'react';
import { Search, Plus, X, TrendingUp, Tag, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WizardFormData } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

interface CompetitorIntelCardProps {
  data: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onRescan: () => Promise<void>;
  isRescanning: boolean;
}

interface Competitor {
  name: string;
  domain?: string;
  focus?: string;
}

export function CompetitorIntelCard({
  data,
  onUpdate,
  onRescan,
  isRescanning,
}: CompetitorIntelCardProps) {
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState('');

  const competitors: Competitor[] = (data.competitors || []).map(name => ({
    name,
    domain: `${name.toLowerCase().replace(/\s+/g, '')}.com`,
    focus: 'Enterprise solution',
  }));

  const addCompetitor = () => {
    if (newCompetitor.trim()) {
      onUpdate({
        competitors: [...(data.competitors || []), newCompetitor.trim()],
      });
      setNewCompetitor('');
      setIsAddingCompetitor(false);
    }
  };

  const removeCompetitor = (name: string) => {
    onUpdate({
      competitors: (data.competitors || []).filter(c => c !== name),
    });
  };

  // Mock industry trends
  const industryTrends = [
    'Shift towards Generative AI integration in DAMs',
    'Consolidation of creative tools into suites',
    'Increased focus on brand safety in AI generation',
  ];

  // Mock market labels
  const marketLabels = [
    'Creative Operations',
    'DAM',
    'Generative AI',
    'Enterprise Collaboration',
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Competitor & Market Intelligence
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={onRescan}
            disabled={isRescanning}
          >
            {isRescanning ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            AI Re-scan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Competitor Cards */}
        <div className="grid grid-cols-3 gap-3">
          {competitors.slice(0, 3).map((competitor) => (
            <div 
              key={competitor.name}
              className="p-3 bg-card border border-border/50 rounded-lg relative group"
            >
              <button
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={() => removeCompetitor(competitor.name)}
              >
                <X className="h-3 w-3" />
              </button>
              <h4 className="font-semibold text-sm">{competitor.name}</h4>
              <p className="text-xs text-primary">{competitor.domain}</p>
              <p className="text-xs text-muted-foreground mt-1">{competitor.focus}</p>
            </div>
          ))}
          
          {/* Add Competitor Button */}
          {!isAddingCompetitor ? (
            <button
              className="p-3 bg-muted/50 border border-dashed border-border/50 rounded-lg flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/70 hover:border-primary/30 transition-colors"
              onClick={() => setIsAddingCompetitor(true)}
            >
              <Plus className="h-4 w-4" />
              Add competitor
            </button>
          ) : (
            <div className="p-3 bg-card border border-primary/30 rounded-lg space-y-2">
              <Input
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder="Competitor name..."
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
              />
              <div className="flex gap-1">
                <Button size="sm" className="h-6 text-xs" onClick={addCompetitor}>Add</Button>
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setIsAddingCompetitor(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* Industry Trends */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" />
            Industry Trends
          </span>
          <div className="space-y-1.5">
            {industryTrends.map((trend, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">→</span>
                <span>{trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Labels */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="h-3 w-3" />
            Market Labels
          </span>
          <div className="flex flex-wrap gap-1.5">
            {marketLabels.map((label, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-muted/50">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CompetitorIntelCard;
