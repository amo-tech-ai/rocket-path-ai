/**
 * Slide Editor Panel
 * Main content area for editing slide content
 */

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Download, 
  Share2,
  Sparkles,
  Check,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ExportModal } from './ExportModal';
import type { Slide, SlideContent } from '@/hooks/usePitchDeckEditor';

interface SlideEditorPanelProps {
  slides: Slide[];
  currentSlide: Slide | null;
  currentSlideIndex: number;
  saveStatus: 'saved' | 'saving' | 'error';
  deckId: string;
  deckTitle: string;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onUpdateContent: (slideId: string, updates: Partial<SlideContent>) => void;
}

export function SlideEditorPanel({
  slides,
  currentSlide,
  currentSlideIndex,
  saveStatus,
  deckId,
  deckTitle,
  onPrevSlide,
  onNextSlide,
  onUpdateContent,
}: SlideEditorPanelProps) {
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Editor Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPrevSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SaveStatusIndicator status={saveStatus} />
          
          <Button variant="outline" size="sm" onClick={() => setExportModalOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Slide Editor Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {currentSlide ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Slide Preview */}
            <SlidePreview slide={currentSlide} />

            {/* Content Editor */}
            <SlideContentEditor 
              slide={currentSlide}
              onUpdateContent={onUpdateContent}
              showSpeakerNotes={showSpeakerNotes}
              onToggleSpeakerNotes={setShowSpeakerNotes}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No slide selected
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        deckId={deckId}
        deckTitle={deckTitle}
        slides={slides}
      />
    </main>
  );
}

function SaveStatusIndicator({ status }: { status: 'saved' | 'saving' | 'error' }) {
  return (
    <span className={cn(
      "text-xs flex items-center gap-1",
      status === 'saved' && "text-green-600",
      status === 'saving' && "text-muted-foreground",
      status === 'error' && "text-red-600"
    )}>
      {status === 'saved' && <><Check className="w-3 h-3" /> Saved</>}
      {status === 'saving' && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
      {status === 'error' && <><AlertCircle className="w-3 h-3" /> Error</>}
    </span>
  );
}

function SlidePreview({ slide }: { slide: Slide }) {
  return (
    <Card className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardContent className="h-full flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          {slide.title || 'Untitled Slide'}
        </h1>
        {slide.subtitle && (
          <p className="text-lg text-slate-300">{slide.subtitle}</p>
        )}
        {slide.content?.bullets && slide.content.bullets.length > 0 && (
          <ul className="mt-6 space-y-2 text-left">
            {slide.content.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface SlideContentEditorProps {
  slide: Slide;
  onUpdateContent: (slideId: string, updates: Partial<SlideContent>) => void;
  showSpeakerNotes: boolean;
  onToggleSpeakerNotes: (show: boolean) => void;
}

function SlideContentEditor({
  slide,
  onUpdateContent,
  showSpeakerNotes,
  onToggleSpeakerNotes,
}: SlideContentEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <Input
          value={slide.title || ''}
          onChange={(e) => onUpdateContent(slide.id, { title: e.target.value })}
          placeholder="Slide title..."
          className="text-lg"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Subtitle</label>
        <Input
          value={slide.subtitle || ''}
          onChange={(e) => onUpdateContent(slide.id, { subtitle: e.target.value })}
          placeholder="Optional subtitle..."
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Content</label>
        <Textarea
          value={slide.content?.bullets?.join('\n') || ''}
          onChange={(e) => onUpdateContent(slide.id, { 
            bullets: e.target.value.split('\n').filter(b => b.trim()) 
          })}
          placeholder="Enter bullet points (one per line)..."
          rows={6}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <ImageIcon className="w-4 h-4 mr-2" />
          Add Image
        </Button>
        <Button variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Image
        </Button>
      </div>

      <Collapsible open={showSpeakerNotes} onOpenChange={onToggleSpeakerNotes}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            {showSpeakerNotes ? 'Hide' : 'Show'} Speaker Notes
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Textarea
            value={slide.content?.speaker_notes || ''}
            onChange={(e) => onUpdateContent(slide.id, { speaker_notes: e.target.value })}
            placeholder="Add speaker notes for presenting..."
            rows={4}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
