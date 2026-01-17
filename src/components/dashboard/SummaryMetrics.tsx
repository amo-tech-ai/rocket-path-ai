import { motion } from 'framer-motion';
import { 
  Monitor, 
  Briefcase, 
  CheckSquare, 
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SummaryMetric {
  icon: typeof Monitor;
  value: number;
  label: string;
  change?: number;
  path: string;
}

interface SummaryMetricsProps {
  decksCount: number;
  investorsCount: number;
  tasksCount: number;
  eventsCount: number;
}

export function SummaryMetrics({ 
  decksCount, 
  investorsCount, 
  tasksCount, 
  eventsCount 
}: SummaryMetricsProps) {
  const navigate = useNavigate();

  const metrics: SummaryMetric[] = [
    { 
      icon: Monitor, 
      value: decksCount, 
      label: 'Decks', 
      change: 2,
      path: '/documents' 
    },
    { 
      icon: Briefcase, 
      value: investorsCount, 
      label: 'Investors', 
      change: 1,
      path: '/investors' 
    },
    { 
      icon: CheckSquare, 
      value: tasksCount, 
      label: 'Tasks',
      path: '/tasks' 
    },
    { 
      icon: Calendar, 
      value: eventsCount, 
      label: 'Events',
      path: '/projects' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((metric, index) => (
        <motion.button
          key={metric.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          onClick={() => navigate(metric.path)}
          className="metric-card text-left hover:border-primary/30 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <metric.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            {metric.change && metric.change > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-sage bg-sage-light px-1.5 py-0.5 rounded-full">
                <span>+{metric.change}</span>
                <TrendingUp className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-foreground">{metric.value}</div>
          <div className="text-sm text-muted-foreground">{metric.label}</div>
        </motion.button>
      ))}
    </div>
  );
}