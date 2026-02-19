/**
 * Slide Image Generator Component
 * Generates slide visuals using Nano Banana (Gemini Image)
 */

import { useState } from 'react';
import { 
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
  Check,
  Loader2,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SlideImageGeneratorProps {
  slideId: string;
  slideType: string;
  slideTitle: string | null;
  currentImageUrl: string | null;
  isGenerating: boolean;
  onGenerate: (customPrompt?: string, style?: string) => Promise<void>;
}

const SLIDE_IMAGE_STYLES = [
  { value: 'professional', label: 'Professional', description: 'Clean, corporate aesthetic' },
  { value: 'modern', label: 'Modern', description: 'Contemporary with bold colors' },
  { value: 'minimal', label: 'Minimal', description: 'Simple, focused visuals' },
  { value: 'abstract', label: 'Abstract', description: 'Geometric and artistic' },
  { value: 'data-driven', label: 'Data-Driven', description: 'Charts and diagrams focus' },
];

const SLIDE_TYPE_DESCRIPTIONS: Record<string, string> = {
  title: 'Abstract brand graphic representing innovation and growth',
  problem: 'Visual metaphor showing challenge or pain point',
  solution: 'Bright visualization showing breakthrough or clarity',
  product: 'Process flow diagram or system overview',
  market: 'TAM/SAM/SOM concentric circles or market visualization',
  traction: 'Growth chart with upward momentum',
  business_model: 'Revenue flow or monetization diagram',
  competition: '2x2 positioning matrix or landscape visualization',
  team: 'Professional silhouettes or role-based composition',
  roadmap: 'Timeline or milestone progression',
  ask: 'Investment allocation pie chart or funding visualization',
  contact: 'Clean closing visual with brand reinforcement',
};

export function SlideImageGenerator({
  slideId,
  slideType,
  slideTitle,
  currentImageUrl,
  isGenerating,
  onGenerate,
}: SlideImageGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('professional');

  const defaultDescription = SLIDE_TYPE_DESCRIPTIONS[slideType] || 'Professional pitch deck visual';

  const handleGenerate = async () => {
    const prompt = customPrompt.trim() || undefined;
    await onGenerate(prompt, selectedStyle);
    setIsOpen(false);
    setCustomPrompt('');
  };

  const handleQuickGenerate = () => {
    onGenerate(undefined, 'professional');
  };

  return (
    <div className="space-y-3">
      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="relative rounded-lg overflow-hidden border border-border aspect-video bg-muted">
          <img 
            src={currentImageUrl} 
            alt={`${slideType} slide visual`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleQuickGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {!currentImageUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleQuickGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Image
          </Button>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className={cn(!currentImageUrl && "flex-1")}>
              <Palette className="w-4 h-4 mr-2" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Generate Slide Image
              </DialogTitle>
              <DialogDescription>
                Create an AI-generated visual for your {slideType} slide using Nano Banana Pro.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Style Selector */}
              <div className="space-y-2">
                <Label>Visual Style</Label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SLIDE_IMAGE_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div className="flex flex-col">
                          <span>{style.label}</span>
                          <span className="text-xs text-muted-foreground">{style.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Default Description */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Suggested Visual</Label>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {defaultDescription}
                </p>
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom Instructions (optional)</Label>
                <Input
                  id="custom-prompt"
                  placeholder="Add specific details or override the default..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the AI-suggested visual for {slideType} slides.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating with Nano Banana Pro...</span>
        </div>
      )}
    </div>
  );
}
