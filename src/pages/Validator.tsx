/**
 * Validation Dashboard Page
 * 3-panel layout with Coach Chat integration
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ValidatorLayout from '@/components/validator/ValidatorLayout';
import { useStartup } from '@/hooks/useDashboardData';
import { useValidation, ValidationRisk } from '@/hooks/useValidation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Zap, 
  Search, 
  Users, 
  AlertTriangle, 
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';

type ValidationMode = 'quick' | 'deep' | 'investor';

const MODE_INFO = {
  quick: { 
    icon: Zap, 
    title: 'Quick Validate', 
    duration: '~3 min',
    description: 'Fast overview of your startup readiness'
  },
  deep: { 
    icon: Search, 
    title: 'Deep Validate', 
    duration: '~15 min',
    description: 'Comprehensive 10-area assessment'
  },
  investor: { 
    icon: Users, 
    title: 'Investor Lens', 
    duration: '~10 min',
    description: 'See your startup through VC eyes'
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  problemClarity: 'Problem Clarity',
  marketSize: 'Market Size',
  solutionFit: 'Solution Fit',
  competitiveMoat: 'Competitive Moat',
  teamFit: 'Team Fit',
  traction: 'Traction',
  unitEconomics: 'Unit Economics',
  fundingFit: 'Funding Fit',
};

export default function Validator() {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const [activeMode, setActiveMode] = useState<ValidationMode>('quick');
  
  const { 
    currentResult, 
    history, 
    isLoadingHistory, 
    isValidating, 
    runValidation 
  } = useValidation(startup?.id);

  // Right panel with intelligence
  const rightPanel = (
    <div className="space-y-6">
      {/* Industry Badge */}
      <div className="card-premium p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</span>
        </div>
        <p className="font-medium text-foreground">{startup?.industry || 'Not set'}</p>
      </div>

      {/* Benchmark Comparison */}
      {currentResult && (
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry Benchmark</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Score</span>
              <span className="font-semibold text-foreground">{currentResult.score.overall}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Industry Average</span>
              <span className="text-muted-foreground">{currentResult.benchmarks.averageScore}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Top Performers</span>
              <span className="text-emerald-500 font-medium">{currentResult.benchmarks.topScore}+</span>
            </div>
          </div>
        </div>
      )}

      {/* Validation History */}
      <div className="card-premium p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">History</span>
        </div>
        {isLoadingHistory ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No validations yet</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{item.validationType}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.score}/100</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generated Tasks */}
      {currentResult && currentResult.generatedTasks.length > 0 && (
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Auto-Generated Tasks</span>
          </div>
          <div className="space-y-2">
            {currentResult.generatedTasks.slice(0, 3).map((task, i) => (
              <div key={i} className="text-sm p-2 rounded-lg bg-muted/50">
                <p className="font-medium text-foreground text-xs">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout aiPanel={rightPanel}>
      <ValidatorLayout startupId={startup?.id}>
        <div className="max-w-4xl space-y-6 p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Validation Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Stress-test your startup idea before pitching to investors.
            </p>
          </motion.div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(MODE_INFO) as ValidationMode[]).map((mode) => {
              const info = MODE_INFO[mode];
              const Icon = info.icon;
              const isActive = activeMode === mode;
              
              return (
                <motion.button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30 bg-card'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{info.duration}</Badge>
                  </div>
                  <h3 className="font-medium text-foreground">{info.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Run Validation Button */}
          <Button 
            onClick={() => runValidation(activeMode)}
            disabled={isValidating || !startup}
            className="w-full md:w-auto"
            size="lg"
          >
            {isValidating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 mr-2"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                Run {MODE_INFO[activeMode].title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Results */}
          <AnimatePresence mode="wait">
            {currentResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Score Overview */}
                <div className="card-premium p-6">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Score Circle */}
                    <div className="relative flex-shrink-0">
                      <svg className="w-40 h-40 -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#validationGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 70}
                          strokeDashoffset={2 * Math.PI * 70 * (1 - currentResult.score.overall / 100)}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="validationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-foreground">{currentResult.score.overall}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="flex-1 w-full space-y-3">
                      {Object.entries(currentResult.score.breakdown).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{CATEGORY_LABELS[key] || key}</span>
                            <span className={`font-medium ${value < 60 ? 'text-rose-500' : 'text-foreground'}`}>
                              {value}
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risks & Opportunities Tabs */}
                <Tabs defaultValue="risks" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="risks" className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risks ({currentResult.risks.length})
                    </TabsTrigger>
                    <TabsTrigger value="opportunities" className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Opportunities ({currentResult.opportunities.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="risks" className="mt-4 space-y-3">
                    {currentResult.risks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                        <p>No major risks detected!</p>
                      </div>
                    ) : (
                      currentResult.risks.map((risk) => (
                        <RiskCard key={risk.id} risk={risk} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="opportunities" className="mt-4 space-y-3">
                    {currentResult.opportunities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                        <p>Run a deep validation to discover opportunities</p>
                      </div>
                    ) : (
                      currentResult.opportunities.map((opp) => (
                        <div key={opp.id} className="card-premium p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <Lightbulb className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{opp.title}</h4>
                                <Badge variant="outline" className="text-xs capitalize">{opp.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{opp.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!currentResult && !isValidating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to validate your idea?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a validation mode above and click run to get AI-powered insights about your startup's strengths and weaknesses.
              </p>
            </motion.div>
          )}
        </div>
      </ValidatorLayout>
    </DashboardLayout>
  );
}

function RiskCard({ risk }: { risk: ValidationRisk }) {
  const severityColors = {
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <div className="card-premium p-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          risk.severity === 'high' ? 'bg-rose-500/10' : 
          risk.severity === 'medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'
        }`}>
          <AlertTriangle className={`w-4 h-4 ${
            risk.severity === 'high' ? 'text-rose-500' : 
            risk.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
          }`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{risk.title}</h4>
            <Badge variant="outline" className={`text-xs ${severityColors[risk.severity]}`}>
              {risk.severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Mitigation:</span> {risk.mitigation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
