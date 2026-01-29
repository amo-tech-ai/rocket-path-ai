/**
 * PackCard Component
 * Displays a prompt pack with title, description, tags, and actions
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Layers, Play, Sparkles } from 'lucide-react';
import type { PromptPack } from '@/hooks/usePromptPack';

interface PackCardProps {
  pack: PromptPack;
  stepCount?: number;
  onSelect?: (pack: PromptPack) => void;
  onRun?: (pack: PromptPack) => void;
  isSelected?: boolean;
}

const categoryColors: Record<string, string> = {
  validation: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  canvas: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  pitch: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  gtm: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  ideation: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
};

const categoryIcons: Record<string, React.ReactNode> = {
  validation: <Sparkles className="h-4 w-4" />,
  canvas: <Layers className="h-4 w-4" />,
  pitch: <Play className="h-4 w-4" />,
};

export function PackCard({ pack, stepCount, onSelect, onRun, isSelected }: PackCardProps) {
  const estimatedTime = pack.metadata?.estimated_time_seconds;
  const categoryColor = categoryColors[pack.category] || 'bg-muted text-muted-foreground';
  const categoryIcon = categoryIcons[pack.category];

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}
      `}
      onClick={() => onSelect?.(pack)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {categoryIcon && (
              <div className={`p-1.5 rounded-md ${categoryColor}`}>
                {categoryIcon}
              </div>
            )}
            <Badge variant="outline" className={categoryColor}>
              {pack.category}
            </Badge>
          </div>
          {pack.metadata?.model && (
            <Badge variant="secondary" className="text-xs">
              {pack.metadata.model}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-1">{pack.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {pack.description || 'No description available'}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1.5">
          {pack.stage_tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {pack.industry_tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {stepCount !== undefined && (
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {stepCount} {stepCount === 1 ? 'step' : 'steps'}
            </span>
          )}
          {estimatedTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {estimatedTime < 60 ? `${estimatedTime}s` : `${Math.round(estimatedTime / 60)}m`}
            </span>
          )}
        </div>
        {onRun && (
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onRun(pack);
            }}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default PackCard;
