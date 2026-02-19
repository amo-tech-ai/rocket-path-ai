/**
 * KanbanBoard — 4-column drag-and-drop board for sprint validation tasks.
 * Uses @dnd-kit for drag-drop. Columns: Backlog → To Do → Doing → Done.
 */

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, GripVertical } from 'lucide-react';
import type { SprintTask, KanbanColumn } from '@/hooks/useSprintAgent';

const COLUMNS: { id: KanbanColumn; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-slate-300' },
  { id: 'todo', label: 'To Do', color: 'border-blue-400' },
  { id: 'doing', label: 'Doing', color: 'border-amber-400' },
  { id: 'done', label: 'Done', color: 'border-emerald-400' },
];

const SOURCE_COLORS: Record<string, string> = {
  problem: 'bg-red-100 text-red-700',
  solution: 'bg-blue-100 text-blue-700',
  channels: 'bg-purple-100 text-purple-700',
  revenue: 'bg-emerald-100 text-emerald-700',
  customers: 'bg-amber-100 text-amber-700',
  competition: 'bg-orange-100 text-orange-700',
  metrics: 'bg-cyan-100 text-cyan-700',
  advantage: 'bg-indigo-100 text-indigo-700',
  risk: 'bg-rose-100 text-rose-700',
};

const PRIORITY_BADGES: Record<string, string> = {
  high: 'bg-red-500/10 text-red-600 border-red-200',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-200',
  low: 'bg-slate-500/10 text-slate-600 border-slate-200',
};

interface KanbanBoardProps {
  tasks: SprintTask[];
  tasksByColumn: Record<KanbanColumn, SprintTask[]>;
  onMoveTask: (taskId: string, column: KanbanColumn) => void;
  sprintFilter?: number;
}

export function KanbanBoard({ tasks, tasksByColumn, onMoveTask, sprintFilter }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredByColumn = (col: KanbanColumn) => {
    const colTasks = tasksByColumn[col] || [];
    return sprintFilter ? colTasks.filter(t => t.sprint_number === sprintFilter) : colTasks;
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const targetColumn = over.id as KanbanColumn;
    if (COLUMNS.some(c => c.id === targetColumn)) {
      onMoveTask(active.id as string, targetColumn);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn key={col.id} column={col} tasks={filteredByColumn(col.id)} />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragOverlay />}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ column, tasks }: { column: typeof COLUMNS[0]; tasks: SprintTask[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-xl border-2 border-dashed p-3 min-h-[300px] transition-colors',
        column.color,
        isOver && 'bg-primary/5 border-primary/40',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{column.label}</h3>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <DraggableTask key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Drag cards here
          </p>
        )}
      </div>
    </div>
  );
}

function DraggableTask({ task }: { task: SprintTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-40')}>
      <TaskCard task={task} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

function TaskCard({ task, isDragOverlay, dragHandleProps }: {
  task: SprintTask;
  isDragOverlay?: boolean;
  dragHandleProps?: Record<string, unknown>;
}) {
  const sourceClass = SOURCE_COLORS[task.source] || 'bg-slate-100 text-slate-700';
  const priorityClass = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;

  return (
    <div
      className={cn(
        'bg-card rounded-lg border border-border p-3 shadow-sm',
        isDragOverlay && 'shadow-lg ring-2 ring-primary/30 rotate-2',
      )}
    >
      <div className="flex items-start gap-2">
        <button {...(dragHandleProps as React.HTMLAttributes<HTMLButtonElement>)} className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', sourceClass)}>
              {task.source}
            </span>
            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', priorityClass)}>
              {task.priority}
            </Badge>
            <span className="text-[10px] text-muted-foreground">S{task.sprint_number}</span>
          </div>

          <div className="mt-2 flex items-start gap-1.5">
            <Target className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-snug">{task.success_criteria}</p>
          </div>

          <div className="mt-1.5 flex items-start gap-1.5">
            <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground italic leading-snug">{task.ai_tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
