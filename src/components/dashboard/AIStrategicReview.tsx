import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Insight {
  type: 'opportunity' | 'engagement' | 'risk';
  title: string;
  description: string;
  action?: string;
}

interface AIStrategicReviewProps {
  insights?: Insight[];
  onGenerateReport?: () => void;
}

const defaultInsights: Insight[] = [
  {
    type: 'opportunity',
    title: 'Opportunity Detected',
    description: "25% growth in 'AI Tools' interest. Update your Market slide data.",
  },
  {
    type: 'engagement',
    title: 'High Engagement',
    description: "Your 'Solution' slide has 40% higher retention. Add a CTA.",
  },
];

export function AIStrategicReview({ 
  insights = defaultInsights,
  onGenerateReport 
}: AIStrategicReviewProps) {
  const navigate = useNavigate();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Lightbulb;
      case 'engagement': return TrendingUp;
      case 'risk': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-primary';
      case 'engagement': return 'text-primary';
      case 'risk': return 'text-yellow-500';
      default: return 'text-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-5 text-white"
      style={{ background: 'hsl(var(--ai-background))' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold">AI Strategic Review</h3>
      </div>

      <div className="space-y-4 mb-5">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-2 mb-2">
                <Icon className={`w-4 h-4 ${getInsightColor(insight.type)} flex-shrink-0 mt-0.5`} />
                <span className="text-sm font-medium text-white">{insight.title}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed pl-6">
                {insight.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <Button 
        variant="outline"
        size="sm"
        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
        onClick={onGenerateReport}
      >
        Generate Full Report
      </Button>
    </motion.div>
  );
}