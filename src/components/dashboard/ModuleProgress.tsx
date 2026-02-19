/**
 * ModuleProgress Component
 * Displays progress cards for each major module (Canvas, Pitch, Tasks, CRM)
 * Helps founders track completion across the platform
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Presentation, 
  CheckSquare, 
  Users,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ModuleData {
  canvasProgress: number;
  pitchProgress: number;
  tasksCompleted: number;
  tasksTotal: number;
  activeDeals: number;
}

interface ModuleProgressProps {
  data?: ModuleData;
  isLoading?: boolean;
}

const MODULES = [
  {
    id: 'canvas',
    name: 'Lean Canvas',
    icon: LayoutGrid,
    route: '/app/canvas',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    getProgress: (data: ModuleData) => data.canvasProgress,
    getLabel: (data: ModuleData) => `${data.canvasProgress}% Complete`,
  },
  {
    id: 'pitch',
    name: 'Pitch Deck',
    icon: Presentation,
    route: '/app/pitch',
    color: 'text-status-info',
    bgColor: 'bg-status-info-light',
    getProgress: (data: ModuleData) => data.pitchProgress,
    getLabel: (data: ModuleData) => `${data.pitchProgress}% Complete`,
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: CheckSquare,
    route: '/app/tasks',
    color: 'text-status-success',
    bgColor: 'bg-status-success-light',
    getProgress: (data: ModuleData) =>
      data.tasksTotal > 0 ? Math.round((data.tasksCompleted / data.tasksTotal) * 100) : 0,
    getLabel: (data: ModuleData) => `${data.tasksCompleted}/${data.tasksTotal} Done`,
  },
  {
    id: 'crm',
    name: 'CRM Pipeline',
    icon: Users,
    route: '/app/contacts',
    color: 'text-status-warning',
    bgColor: 'bg-status-warning-light',
    getProgress: (data: ModuleData) => Math.min(data.activeDeals * 20, 100),
    getLabel: (data: ModuleData) => `${data.activeDeals} Active Deals`,
  },
];

export function ModuleProgress({ data, isLoading }: ModuleProgressProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Module Progress
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const defaultData: ModuleData = {
    canvasProgress: 0,
    pitchProgress: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
    activeDeals: 0,
  };

  const moduleData = data || defaultData;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Module Progress
        </h3>
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          Track your journey
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {MODULES.map((module, index) => {
          const Icon = module.icon;
          const progress = module.getProgress(moduleData);
          const label = module.getLabel(moduleData);

          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(module.route)}
              className="card-premium p-4 text-left hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${module.bgColor}`}>
                  <Icon className={`w-4 h-4 ${module.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <p className="text-sm font-medium text-foreground mb-1">{module.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{label}</p>
              
              <Progress 
                value={progress} 
                className="h-1.5"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleProgress;
