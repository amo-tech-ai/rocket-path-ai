/**
 * Pitch Deck Editor Page
 * 3-panel layout: Slide Navigation | Slide Editor | AI Intelligence
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Download, 
  Share2,
  Sparkles,
  GripVertical,
  Plus,
  MoreHorizontal,
  Check,
  X,
  Lightbulb,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { usePitchDeckEditor, type Slide, type AISuggestion, type SlideAnalysis } from '@/hooks/usePitchDeckEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const SLIDE_TYPE_ICONS: Record<string, string> = {
  cover: '🎯',
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

export default function PitchDeckEditor() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const {
    deck,
    slides,
    currentSlide,
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    updateSlideContent,
    updateDeckTitle,
    isLoading,
    isSaving,
    saveStatus,
    aiSuggestions,
    slideAnalysis,
    isLoadingSuggestions,
    fetchAISuggestions,
    applySuggestion,
    dismissSuggestion,
  } = usePitchDeckEditor({ deckId: deckId! });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  useEffect(() => {
    if (deck?.title) {
      setTitleValue(deck.title);
    }
  }, [deck?.title]);

  // Fetch AI suggestions when slide changes
  useEffect(() => {
    if (currentSlide && !isLoadingSuggestions && aiSuggestions.length === 0) {
      fetchAISuggestions();
    }
  }, [currentSlide?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-60 border-r p-4">
          <Skeleton className="h-8 w-full mb-4" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full mb-2" />
          ))}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="w-80 border-l p-4">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Deck not found</h2>
          <Button onClick={() => navigate('/app/pitch-decks')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Slide Navigation */}
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
                onChange={(e) => setTitleValue(e.target.value)}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateDeckTitle(titleValue);
                    setIsEditingTitle(false);
                  }
                  if (e.key === 'Escape') {
                    setTitleValue(deck.title);
                    setIsEditingTitle(false);
                  }
                }}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={() => {
                  updateDeckTitle(titleValue);
                  setIsEditingTitle(false);
                }}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <h2 
              className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {deck.title}
            </h2>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {slides.length} slides
            </Badge>
            {deck.signal_strength && (
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
              onClick={() => goToSlide(index)}
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

      {/* Main Panel - Slide Editor */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevSlide}
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
                onClick={nextSlide}
                disabled={currentSlideIndex === slides.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs flex items-center gap-1",
              saveStatus === 'saved' && "text-green-600",
              saveStatus === 'saving' && "text-muted-foreground",
              saveStatus === 'error' && "text-red-600"
            )}>
              {saveStatus === 'saved' && <><Check className="w-3 h-3" /> Saved</>}
              {saveStatus === 'saving' && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
              {saveStatus === 'error' && <><AlertCircle className="w-3 h-3" /> Error</>}
            </span>
            
            <Button variant="outline" size="sm">
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
              <Card className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardContent className="h-full flex flex-col items-center justify-center p-8">
                  <h1 className="text-3xl font-bold text-center mb-4">
                    {currentSlide.title || 'Untitled Slide'}
                  </h1>
                  {currentSlide.subtitle && (
                    <p className="text-lg text-slate-300">{currentSlide.subtitle}</p>
                  )}
                  {currentSlide.content?.bullets && currentSlide.content.bullets.length > 0 && (
                    <ul className="mt-6 space-y-2 text-left">
                      {currentSlide.content.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Content Editor */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={currentSlide.title || ''}
                    onChange={(e) => updateSlideContent(currentSlide.id, { title: e.target.value })}
                    placeholder="Slide title..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subtitle</label>
                  <Input
                    value={currentSlide.subtitle || ''}
                    onChange={(e) => updateSlideContent(currentSlide.id, { subtitle: e.target.value })}
                    placeholder="Optional subtitle..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={currentSlide.content?.bullets?.join('\n') || ''}
                    onChange={(e) => updateSlideContent(currentSlide.id, { 
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

                <Collapsible open={showSpeakerNotes} onOpenChange={setShowSpeakerNotes}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      {showSpeakerNotes ? 'Hide' : 'Show'} Speaker Notes
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <Textarea
                      value={currentSlide.content?.speaker_notes || ''}
                      onChange={(e) => updateSlideContent(currentSlide.id, { speaker_notes: e.target.value })}
                      placeholder="Add speaker notes for presenting..."
                      rows={4}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No slide selected
            </div>
          )}
        </div>
      </main>

      {/* Right Panel - AI Intelligence */}
      <aside className="w-80 border-l border-border bg-muted/30 overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Intelligence
          </h3>
        </div>

        {/* Slide Analysis */}
        {slideAnalysis ? (
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-medium mb-3">Slide Analysis</h4>
            <div className="space-y-3">
              <AnalysisBar label="Clarity" value={slideAnalysis.clarity} />
              <AnalysisBar label="Impact" value={slideAnalysis.impact} />
              <AnalysisBar label="Tone" value={slideAnalysis.tone} />
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Overall</span>
                  <span className={cn(
                    "font-semibold",
                    slideAnalysis.overall >= 7 ? "text-green-600" :
                    slideAnalysis.overall >= 5 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {slideAnalysis.overall}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{slideAnalysis.feedback}</p>
              </div>
            </div>
          </div>
        ) : isLoadingSuggestions ? (
          <div className="p-4 border-b border-border">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : null}

        {/* AI Suggestions */}
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Suggestions
          </h4>
          
          {isLoadingSuggestions ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : aiSuggestions.length > 0 ? (
            <div className="space-y-3">
              {aiSuggestions.filter(s => !s.applied).map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={() => applySuggestion(suggestion.id)}
                  onDismiss={() => dismissSuggestion(suggestion.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No suggestions for this slide.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={fetchAISuggestions}>
              <Sparkles className="w-4 h-4 mr-2" />
              Improve This Slide
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add a Metric
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ImageIcon className="w-4 h-4 mr-2" />
              Generate Image
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Helper Components
function AnalysisBar({ label, value }: { label: string; value: number }) {
  const percentage = value * 10;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className={cn(
          value >= 7 ? "text-green-600" :
          value >= 5 ? "text-yellow-600" : "text-red-600"
        )}>
          {value}/10
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          value >= 7 ? "[&>div]:bg-green-500" :
          value >= 5 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
        )}
      />
    </div>
  );
}

function SuggestionCard({ 
  suggestion, 
  onApply, 
  onDismiss 
}: { 
  suggestion: AISuggestion; 
  onApply: () => void; 
  onDismiss: () => void;
}) {
  const typeColors: Record<string, string> = {
    clarity: 'bg-blue-100 text-blue-700',
    impact: 'bg-purple-100 text-purple-700',
    metric: 'bg-green-100 text-green-700',
    problem: 'bg-orange-100 text-orange-700',
    industry: 'bg-cyan-100 text-cyan-700',
    tone: 'bg-pink-100 text-pink-700',
  };

  return (
    <Card className="bg-background">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={cn("text-xs capitalize", typeColors[suggestion.type])}>
            {suggestion.type}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={onDismiss}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-sm mb-2">{suggestion.suggestion}</p>
        <p className="text-xs text-muted-foreground mb-3">{suggestion.reasoning}</p>
        <Button size="sm" className="w-full" onClick={onApply}>
          Apply
        </Button>
      </CardContent>
    </Card>
  );
}
