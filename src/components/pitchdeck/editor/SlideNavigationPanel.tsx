/**
 * Slide Navigation Panel
 * Left sidebar for slide list navigation and deck metadata
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, GripVertical, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, AISuggestion } from '@/hooks/usePitchDeckEditor';

export const SLIDE_TYPE_ICONS: Record<string, string> = {
  cover: '🎯',
  title: '🎯',
  problem: '⚠️',
  solution: '💡',
  market: '📊',
  product: '🛠️',
  traction: '📈',
  business_model: '💰',
  competition: '🎯',
  team: '👥',
  financials: '📉',
  ask: '🙏',
  appendix: '📎',
};

interface SlideNavigationPanelProps {
  deck: {
    title: string;
    status: string;
    template: string | null;
    signal_strength: number | null;
  };
  slides: Slide[];
  currentSlideIndex: number;
  aiSuggestions: AISuggestion[];
  isEditingTitle: boolean;
  titleValue: string;
  onSlideClick: (index: number) => void;
  onEditTitleStart: () => void;
  onEditTitleEnd: () => void;
  onTitleChange: (value: string) => void;
  onTitleSave: () => void;
}

export function SlideNavigationPanel({
  deck,
  slides,
  currentSlideIndex,
  aiSuggestions,
  isEditingTitle,
  titleValue,
  onSlideClick,
  onEditTitleStart,
  onEditTitleEnd,
  onTitleChange,
  onTitleSave,
}: SlideNavigationPanelProps) {
  return (
    <aside className="w-60 border-r border-border flex flex-col bg-sidebar">
      <div className="p-4 border-b border-border">
        <Link 
          to="/app/pitch-decks" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Decks
        </Link>
        
        {/* Deck Title - Editable */}
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={titleValue}
              onChange={(e) => onTitleChange(e.target.value)}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onTitleSave();
                if (e.key === 'Escape') onEditTitleEnd();
              }}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={onTitleSave}
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <h2 
            className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
            onClick={onEditTitleStart}
          >
            {deck.title}
          </h2>
        )}
        
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {slides.length} slides
          </Badge>
          {deck.signal_strength !== null && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                deck.signal_strength >= 70 ? "border-green-500 text-green-600" :
                deck.signal_strength >= 50 ? "border-yellow-500 text-yellow-600" :
                "border-red-500 text-red-600"
              )}
            >
              {deck.signal_strength}%
            </Badge>
          )}
        </div>
      </div>

      {/* Slide List */}
      <nav className="flex-1 overflow-y-auto p-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onSlideClick(index)}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors group",
              index === currentSlideIndex 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            )}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
            <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs">
              {SLIDE_TYPE_ICONS[slide.slide_type] || (index + 1)}
            </span>
            <span className="flex-1 truncate">
              {slide.title || slide.slide_type.replace('_', ' ')}
            </span>
            {aiSuggestions.length > 0 && index === currentSlideIndex && (
              <Sparkles className="w-3 h-3 text-amber-500" />
            )}
          </button>
        ))}
        
        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </nav>

      {/* Deck Metadata */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Template:</span>
          <span className="capitalize">{deck.template || 'Standard'}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Status:</span>
          <Badge variant="outline" className="text-xs capitalize">
            {deck.status}
          </Badge>
        </div>
      </div>
    </aside>
  );
}
