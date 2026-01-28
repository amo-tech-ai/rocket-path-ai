/**
 * Slide Visual Preview Component
 * Renders slide with generated images, charts, and diagrams
 */

import { useMemo } from 'react';
import { 
  TrendingUp,
  Users,
  Target,
  Zap,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Slide, SlideContent } from '@/hooks/usePitchDeckEditor';

interface SlideVisualPreviewProps {
  slide: Slide;
  className?: string;
}

export function SlideVisualPreview({ slide, className }: SlideVisualPreviewProps) {
  const backgroundStyle = useMemo(() => {
    const imageUrl = slide.image_url || slide.content?.background_image;
    if (imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  }, [slide.image_url, slide.content?.background_image]);

  const hasImage = !!(slide.image_url || slide.content?.background_image);

  return (
    <Card 
      className={cn(
        "aspect-video overflow-hidden transition-all duration-200",
        className
      )}
      style={backgroundStyle}
    >
      <CardContent className={cn(
        "h-full flex flex-col p-8",
        hasImage ? "bg-black/40 text-white" : "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      )}>
        {/* Dynamic Slide Content Based on Type */}
        <SlideTypeContent slide={slide} />
      </CardContent>
    </Card>
  );
}

function SlideTypeContent({ slide }: { slide: Slide }) {
  switch (slide.slide_type) {
    case 'title':
      return <TitleSlideContent slide={slide} />;
    case 'problem':
      return <ProblemSlideContent slide={slide} />;
    case 'solution':
      return <SolutionSlideContent slide={slide} />;
    case 'market':
      return <MarketSlideContent slide={slide} />;
    case 'traction':
      return <TractionSlideContent slide={slide} />;
    case 'business_model':
      return <BusinessModelSlideContent slide={slide} />;
    case 'competition':
      return <CompetitionSlideContent slide={slide} />;
    case 'team':
      return <TeamSlideContent slide={slide} />;
    case 'ask':
      return <AskSlideContent slide={slide} />;
    default:
      return <DefaultSlideContent slide={slide} />;
  }
}

function TitleSlideContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">
        {slide.title || 'Your Startup Name'}
      </h1>
      {slide.subtitle && (
        <p className="text-xl text-white/80 max-w-2xl">{slide.subtitle}</p>
      )}
    </div>
  );
}

function ProblemSlideContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Zap className="w-8 h-8 text-orange-400" />
        {slide.title || 'The Problem'}
      </h2>
      {slide.content?.bullets && slide.content.bullets.length > 0 ? (
        <ul className="space-y-4 flex-1">
          {slide.content.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-lg">
              <span className="text-orange-400 mt-1">✕</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white/60">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Add problem statements to highlight pain points</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SolutionSlideContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Target className="w-8 h-8 text-green-400" />
        {slide.title || 'Our Solution'}
      </h2>
      {slide.content?.bullets && slide.content.bullets.length > 0 ? (
        <ul className="space-y-4 flex-1">
          {slide.content.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-lg">
              <span className="text-green-400 mt-1">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white/60">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Describe how your solution addresses the problem</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketSlideContent({ slide }: { slide: Slide }) {
  const metrics = slide.content?.metrics || [];
  
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <PieChart className="w-8 h-8 text-blue-400" />
        {slide.title || 'Market Opportunity'}
      </h2>
      
      {metrics.length > 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-8">
            {metrics.map((metric, i) => (
              <div key={i} className="text-center">
                <div className={cn(
                  "text-4xl font-bold mb-2",
                  i === 0 ? "text-blue-400" : i === 1 ? "text-green-400" : "text-purple-400"
                )}>
                  {metric.value}
                </div>
                <div className="text-sm uppercase tracking-wider text-white/60">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          {/* TAM/SAM/SOM Circles Visualization */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/30 border-2 border-purple-400/60 flex items-center justify-center">
                  <span className="text-xs font-bold">SOM</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 top-0 text-xs text-blue-400">TAM</div>
            <div className="absolute -right-20 top-1/3 text-xs text-green-400">SAM</div>
            <div className="absolute -right-20 top-2/3 text-xs text-purple-400">SOM</div>
          </div>
        </div>
      )}
    </div>
  );
}

function TractionSlideContent({ slide }: { slide: Slide }) {
  const metrics = slide.content?.metrics || [];
  
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-green-400" />
        {slide.title || 'Traction'}
      </h2>
      
      {metrics.length > 0 ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
              <div key={i} className="text-center bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-white/60">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
          {/* Growth Chart Placeholder */}
          <div className="mt-6 h-24 flex items-end justify-center gap-2">
            {[20, 35, 45, 60, 75, 90, 100].map((h, i) => (
              <div 
                key={i}
                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <LineChart className="w-32 h-32 text-green-400/30" />
        </div>
      )}
    </div>
  );
}

function BusinessModelSlideContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-yellow-400" />
        {slide.title || 'Business Model'}
      </h2>
      {slide.content?.bullets && slide.content.bullets.length > 0 ? (
        <ul className="space-y-4 flex-1">
          {slide.content.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-lg">
              <DollarSign className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-8">
            <div className="text-center p-4 border border-white/20 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <span className="text-sm">Customers</span>
            </div>
            <div className="text-2xl">→</div>
            <div className="text-center p-4 border border-white/20 rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <span className="text-sm">Product</span>
            </div>
            <div className="text-2xl">→</div>
            <div className="text-center p-4 border border-white/20 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <span className="text-sm">Revenue</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompetitionSlideContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-purple-400" />
        {slide.title || 'Competitive Landscape'}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        {/* 2x2 Matrix Placeholder */}
        <div className="relative w-64 h-64 border border-white/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-xs text-white/60">
            High Value
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs text-white/60">
            Low Value
          </div>
          <div className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 text-xs text-white/60 -rotate-90">
            Low Cost
          </div>
          <div className="absolute right-0 top-1/2 translate-x-12 -translate-y-1/2 text-xs text-white/60 -rotate-90">
            High Cost
          </div>
          
          {/* Quadrants */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
            Us
          </div>
          <div className="absolute bottom-8 left-8 w-4 h-4 bg-white/30 rounded-full" />
          <div className="absolute top-12 left-12 w-4 h-4 bg-white/30 rounded-full" />
          <div className="absolute bottom-16 right-16 w-4 h-4 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function TeamSlideContent({ slide }: { slide: Slide }) {
  const teamMembers = slide.content?.bullets || [];
  
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Users className="w-8 h-8 text-cyan-400" />
        {slide.title || 'Our Team'}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {teamMembers.slice(0, 4).map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium">{member}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-8">
            {['CEO', 'CTO', 'COO', 'CMO'].map((role, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white/40" />
                </div>
                <div className="text-sm text-white/60">{role}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AskSlideContent({ slide }: { slide: Slide }) {
  const metrics = slide.content?.metrics || [];
  
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-green-400" />
        {slide.title || 'The Ask'}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        {metrics.length > 0 ? (
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-4">
              {metrics[0]?.value || '$X'}
            </div>
            <div className="text-xl text-white/80 mb-8">
              {metrics[0]?.label || 'Raising'}
            </div>
            {slide.content?.bullets && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {slide.content.bullets.slice(0, 3).map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400 mb-4">$X Million</div>
            <div className="text-xl text-white/80">Seed Round</div>
            <div className="mt-8 flex justify-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-green-400 flex items-center justify-center">
                <span className="text-sm text-center">Product<br/>40%</span>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-blue-400 flex items-center justify-center">
                <span className="text-sm text-center">Growth<br/>35%</span>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-purple-400 flex items-center justify-center">
                <span className="text-sm text-center">Ops<br/>25%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DefaultSlideContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">
        {slide.title || 'Untitled Slide'}
      </h1>
      {slide.subtitle && (
        <p className="text-lg text-white/80 mb-6">{slide.subtitle}</p>
      )}
      {slide.content?.bullets && slide.content.bullets.length > 0 && (
        <ul className="space-y-3 text-left max-w-xl">
          {slide.content.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
