import { Trophy } from 'lucide-react';

interface WinThemeLabelProps {
  themes?: string[];
}

export function WinThemeLabel({ themes }: WinThemeLabelProps) {
  if (!themes?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((theme, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
        >
          <Trophy className="h-3 w-3" />
          {theme}
        </span>
      ))}
    </div>
  );
}
