/**
 * Deck Card Component
 * Individual deck card for the dashboard grid
 */

import { 
  FileText,
  MoreHorizontal,
  Clock,
  Copy,
  Trash2,
  Archive,
  Download,
  Edit,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { PitchDeckSummary } from '@/hooks/usePitchDecks';

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: Edit },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  generating: { label: 'Generating', color: 'bg-purple-100 text-purple-700', icon: Loader2 },
  review: { label: 'Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  final: { label: 'Final', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  archived: { label: 'Archived', color: 'bg-slate-100 text-slate-500', icon: Archive },
};

interface DeckCardProps {
  deck: PitchDeckSummary;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function DeckCard({ 
  deck, 
  onEdit, 
  onDuplicate, 
  onArchive, 
  onDelete 
}: DeckCardProps) {
  const status = STATUS_CONFIG[deck.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all hover:shadow-md",
        deck.status === 'in_progress' && "border-dashed"
      )}
      onClick={onEdit}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-lg flex items-center justify-center relative">
        <FileText className="w-12 h-12 text-slate-600" />
        {deck.status === 'in_progress' && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
            Resume
          </Badge>
        )}
        {deck.status === 'generating' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold truncate flex-1">{deck.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Badge variant="outline" className={cn("text-xs", status.color)}>
            <StatusIcon className={cn("w-3 h-3 mr-1", deck.status === 'generating' && "animate-spin")} />
            {status.label}
          </Badge>
          <span className="text-xs">
            {deck.slide_count} {deck.slide_count === 1 ? 'slide' : 'slides'}
          </span>
        </div>

        {/* Signal Strength Bar */}
        {deck.signal_strength !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Signal</span>
              <span className={cn(
                "font-medium",
                deck.signal_strength >= 70 ? "text-green-600" :
                deck.signal_strength >= 50 ? "text-yellow-600" : "text-red-600"
              )}>
                {deck.signal_strength}%
              </span>
            </div>
            <Progress 
              value={deck.signal_strength} 
              className={cn(
                "h-1.5",
                deck.signal_strength >= 70 ? "[&>div]:bg-green-500" :
                deck.signal_strength >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
              )}
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(deck.updated_at), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}
