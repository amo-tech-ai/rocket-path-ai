import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  Calendar, 
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InsightsTabsProps {
  insights?: Array<{
    type: 'ai' | 'perk' | 'event';
    title: string;
    description: string;
    badge?: string;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    priority: string;
    dueDate: string;
    project: string;
  }>;
  activities?: Array<{
    id: string;
    action: string;
    time: string;
    type: 'user' | 'ai' | 'external';
  }>;
}

const defaultInsights = [
  {
    type: 'ai' as const,
    title: 'Update Your Traction Slide',
    description: 'AI suggests adding your latest user growth metrics to improve credibility.',
    badge: 'AI Suggestion'
  },
  {
    type: 'perk' as const,
    title: '90% off HubSpot for Startups',
    description: 'A new high-value perk has been added to the community portal.',
    badge: 'New Perk Available'
  },
  {
    type: 'event' as const,
    title: 'Founder Networking Night',
    description: 'Join our virtual networking event this Friday to connect with peers.',
    badge: 'Upcoming Event'
  }
];

const defaultTasks = [
  { id: '1', title: 'Complete investor deck', priority: 'urgent', dueDate: 'Today', project: 'Series A Raise' },
  { id: '2', title: 'Review financial projections', priority: 'high', dueDate: 'Tomorrow', project: 'Series A Raise' },
];

const defaultActivities = [
  { id: '1', action: 'You updated the Problem slide', time: '2 hours ago', type: 'user' as const },
  { id: '2', action: 'AI generated 3 new tasks', time: '4 hours ago', type: 'ai' as const },
  { id: '3', action: 'Investor John Smith viewed deck', time: 'Yesterday', type: 'external' as const },
  { id: '4', action: 'You completed "Update financials"', time: 'Yesterday', type: 'user' as const },
  { id: '5', action: 'New perk available: HubSpot', time: '2 days ago', type: 'ai' as const },
];

export function InsightsTabs({
  insights = defaultInsights,
  tasks = defaultTasks,
  activities = defaultActivities
}: InsightsTabsProps) {
  const [activeTab, setActiveTab] = useState('insights');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'ai': return Sparkles;
      case 'perk': return Gift;
      case 'event': return Calendar;
      default: return Sparkles;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-premium overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-border">
          <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="insights"
              className="data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
            >
              Insights
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground text-xs">
                {insights.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className="data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
            >
              Tasks
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {tasks.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
            >
              Activity
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {activities.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <TabsContent key="insights" value="insights" className="m-0 p-4 space-y-3">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <motion.div
                  key={`insight-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="insight-card flex items-start gap-3"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    insight.type === 'ai' && "bg-accent text-primary",
                    insight.type === 'perk' && "bg-sage-light text-sage",
                    insight.type === 'event' && "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex-shrink-0">
                        {insight.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent key="tasks" value="tasks" className="m-0 p-4 space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id || `task-${index}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="insight-card flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                    <Badge 
                      variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}
                      className="text-[10px] uppercase"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {task.dueDate} • Project: {task.project}
                  </p>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent key="activity" value="activity" className="m-0 p-4 space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id || `activity-${index}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 py-2"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  activity.type === 'user' && "bg-primary",
                  activity.type === 'ai' && "bg-sage",
                  activity.type === 'external' && "bg-muted-foreground"
                )} />
                <span className="text-sm text-foreground flex-1">{activity.action}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}