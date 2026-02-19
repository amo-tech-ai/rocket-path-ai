/**
 * Presentation Mode Component
 * Fullscreen slide presentation with navigation
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Slide } from '@/hooks/usePitchDeckEditor';

interface PresentationModeProps {
  slides: Slide[];
  initialSlideIndex?: number;
  onClose: () => void;
}

export function PresentationMode({
  slides,
  initialSlideIndex = 0,
  onClose,
}: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number | null>(null);

  const currentSlide = slides[currentIndex];
  const progress = ((currentIndex + 1) / slides.length) * 100;

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          prevSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          nextSlide();
          break;
        case 'Home':
          setCurrentIndex(0);
          break;
        case 'End':
          setCurrentIndex(slides.length - 1);
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length, onClose]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlay) {
      const interval = window.setInterval(() => {
        if (currentIndex < slides.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 5000);
      setAutoPlayInterval(interval);
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [isAutoPlay, currentIndex, slides.length]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: number;
    
    function handleMouseMove() {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay(prev => !prev);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900 flex flex-col"
      onClick={(e) => {
        // Click on left side = prev, right side = next
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('.slide-content')) return;
        
        const x = e.clientX;
        const width = window.innerWidth;
        if (x < width / 3) {
          prevSlide();
        } else if (x > width * 2 / 3) {
          nextSlide();
        }
      }}
    >
      {/* Top Bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1} / {slides.length}
          </span>
          <Progress value={progress} className="w-40 h-1" />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={toggleAutoPlay}
          >
            {isAutoPlay ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div 
          className="slide-content w-full max-w-6xl aspect-video rounded-lg overflow-hidden shadow-2xl"
          style={{
            background: currentSlide?.image_url || currentSlide?.content?.background_image
              ? `url(${currentSlide.image_url || currentSlide.content?.background_image}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          }}
        >
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-black/30">
            {/* Slide Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="text-xs uppercase tracking-wider text-white/60 font-medium">
                {currentSlide?.slide_type?.replace('_', ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg max-w-4xl">
              {currentSlide?.title || 'Untitled Slide'}
            </h1>

            {/* Subtitle */}
            {currentSlide?.subtitle && (
              <p className="text-2xl text-white/80 mb-8 max-w-3xl">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Bullets */}
            {currentSlide?.content?.bullets && currentSlide.content.bullets.length > 0 && (
              <ul className="space-y-4 text-left max-w-2xl">
                {currentSlide.content.bullets.map((bullet, i) => (
                  <li 
                    key={i} 
                    className="flex items-start gap-4 text-xl text-white/90"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className="text-primary mt-1">●</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Metrics */}
            {currentSlide?.content?.metrics && currentSlide.content.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-8 mt-8">
                {currentSlide.content.metrics.map((metric, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-white/60 uppercase tracking-wider">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      </div>

      <div className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Slide Indicator Dots */}
      <div className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              i === currentIndex 
                ? "w-8 bg-primary" 
                : "bg-white/40 hover:bg-white/60"
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>

      {/* Speaker Notes (optional - shown at bottom) */}
      {currentSlide?.content?.speaker_notes && showControls && (
        <div className="absolute bottom-16 left-8 right-8">
          <div className="bg-black/60 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-white/70 italic">
              {currentSlide.content.speaker_notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
