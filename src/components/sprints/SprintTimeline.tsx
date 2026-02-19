import type { Sprint } from "@/hooks/useSprints";

interface SprintTimelineProps {
  sprints: Sprint[];
  activeSprint?: string;
  onSelect: (id: string) => void;
}

export function SprintTimeline({ sprints, activeSprint, onSelect }: SprintTimelineProps) {
  if (sprints.length === 0) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {sprints.map((sprint, i) => {
        const isActive = sprint.id === activeSprint;
        const isCompleted = sprint.status === 'completed';
        return (
          <div key={sprint.id} className="flex items-center">
            <button
              onClick={() => onSelect(sprint.id)}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors shrink-0
                ${isActive ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' : ''}
                ${isCompleted && !isActive ? 'bg-green-100 text-green-700' : ''}
                ${!isCompleted && !isActive ? 'bg-muted text-muted-foreground hover:bg-muted/80' : ''}
              `}
            >
              {sprint.sprint_number}
            </button>
            {i < sprints.length - 1 && (
              <div className={`w-6 h-0.5 ${isCompleted ? 'bg-green-300' : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
