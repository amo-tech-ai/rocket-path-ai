import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Calendar, 
  Users, 
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Project, PROJECT_TYPES } from '@/hooks/useProjects';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  taskCount?: { total: number; completed: number };
  onEdit?: () => void;
  onDelete?: () => void;
  onViewTasks?: () => void;
  onClick?: () => void;
  index?: number;
}

// Must match database CHECK constraint: on_track, at_risk, behind, completed
const healthIcons = {
  on_track: CheckCircle2,
  at_risk: AlertTriangle,
  behind: XCircle,
  completed: CheckCircle2,
};

const healthColors = {
  on_track: 'text-sage',
  at_risk: 'text-warm-foreground',
  behind: 'text-destructive',
  completed: 'text-muted-foreground',
};

export function ProjectCard({ 
  project, 
  taskCount,
  onEdit, 
  onDelete,
  onViewTasks,
  onClick,
  index = 0 
}: ProjectCardProps) {
  const navigate = useNavigate();
  const health = (project.health || 'on_track') as keyof typeof healthIcons;
  const HealthIcon = healthIcons[health];
  const healthColor = healthColors[health];
  
  const projectType = PROJECT_TYPES.find(t => t.value === project.type);
  const progress = project.progress || 0;
  
  const teamMembers = project.team_members || [];

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-elevated p-5 hover-lift group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base truncate">{project.name}</h3>
            <HealthIcon className={cn("w-4 h-4 flex-shrink-0", healthColor)} />
          </div>
          {projectType && (
            <Badge variant="secondary" className="text-xs">
              {projectType.label}
            </Badge>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
              Edit project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewTasks?.(); }}>
              View tasks
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
              className="text-destructive"
            >
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {/* Tasks */}
          {taskCount && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{taskCount.completed}/{taskCount.total} tasks</span>
            </div>
          )}
          
          {/* Due date */}
          {project.end_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(project.end_date), 'MMM d')}</span>
            </div>
          )}
        </div>

        {/* Team members */}
        {teamMembers.length > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{teamMembers.length}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
          {project.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Quick action */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full mt-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onViewTasks}
      >
        View tasks
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </motion.div>
  );
}
