import { Mic, TrendingUp, Users, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ChatMode = 'authenticated' | 'practice_pitch' | 'growth_strategy' | 'deal_review' | 'canvas_coach';

interface ChatModeSelectorProps {
  activeMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const MODES = [
  { id: 'authenticated' as const, label: 'General', icon: null, description: 'Ask anything' },
  { id: 'practice_pitch' as const, label: 'Practice Pitch', icon: Mic, description: 'AI plays investor' },
  { id: 'growth_strategy' as const, label: 'Growth', icon: TrendingUp, description: 'AARRR funnel' },
  { id: 'deal_review' as const, label: 'Deal Review', icon: Users, description: 'Score investors' },
  { id: 'canvas_coach' as const, label: 'Canvas Coach', icon: LayoutGrid, description: 'Fix weak spots' },
] as const;

export function ChatModeSelector({ activeMode, onModeChange }: ChatModeSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1">
      {MODES.map(({ id, label, icon: Icon, description }) => (
        <Button
          key={id}
          variant={activeMode === id ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap text-xs',
            activeMode === id && 'shadow-sm'
          )}
          onClick={() => onModeChange(id)}
          title={description}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
