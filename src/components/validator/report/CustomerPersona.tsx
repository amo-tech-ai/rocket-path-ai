import { memo } from 'react';
import { Clock } from 'lucide-react';

interface CustomerPersonaProps {
  persona: { name: string; role: string; context: string };
  without: string;
  with: string;
  timeSaved: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const CustomerPersona = memo(function CustomerPersona({
  persona,
  without,
  with: withProduct,
  timeSaved,
}: CustomerPersonaProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sage-light text-primary text-sm font-medium flex items-center justify-center shrink-0">
          {getInitials(persona.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-display font-medium text-foreground">
            {persona.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {persona.role} &middot; {persona.context}
          </p>
        </div>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-4">
          <span className="text-xs uppercase tracking-wider text-destructive/60 font-medium">
            Without
          </span>
          <p className="text-sm text-foreground mt-1.5">{without}</p>
        </div>

        <div className="bg-sage-light border border-primary/10 rounded-lg p-4">
          <span className="text-xs uppercase tracking-wider text-primary font-medium">
            With
          </span>
          <p className="text-sm text-foreground mt-1.5">{withProduct}</p>
        </div>
      </div>

      {/* Time saved */}
      <div className="flex items-center gap-2 mt-4">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">{timeSaved}</span>
      </div>
    </div>
  );
});
