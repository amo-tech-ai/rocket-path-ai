import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StartupHealthProps {
  overallScore: number;
  brandStoryScore: number;
  tractionScore: number;
  aiTip?: string;
}

export function StartupHealth({ 
  overallScore = 75, 
  brandStoryScore = 80, 
  tractionScore = 40,
  aiTip = "Add 'Monthly Active Users' to boost your Traction score."
}: StartupHealthProps) {
  const navigate = useNavigate();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-premium p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">Startup Health</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary/80 h-auto p-0 font-medium"
          onClick={() => navigate('/company-profile')}
        >
          View Report
        </Button>
      </div>

      <div className="flex items-start gap-6">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="w-28 h-28 -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#healthGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(25 95% 53%)" />
                <stop offset="100%" stopColor="hsl(15 90% 50%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{overallScore}%</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Score</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">Brand Story</span>
              <span className="text-sm font-semibold text-foreground">{brandStoryScore}/100</span>
            </div>
            <Progress value={brandStoryScore} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">Traction</span>
              <span className="text-sm font-semibold text-primary">{tractionScore}/100</span>
            </div>
            <Progress value={tractionScore} className="h-2" />
          </div>
        </div>
      </div>

      {/* AI Tip */}
      <div className="mt-5 p-3 rounded-xl bg-accent border border-primary/10">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-xs font-semibold text-primary">AI Tip: </span>
            <span className="text-xs text-accent-foreground">{aiTip}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}