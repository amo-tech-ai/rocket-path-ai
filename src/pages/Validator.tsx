/**
 * Validation Dashboard Page
 * 3-panel layout with Coach Chat integration and full report viewer
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ValidatorLayout from '@/components/validator/ValidatorLayout';
import { useStartup } from '@/hooks/useDashboardData';
import { useValidationReport } from '@/hooks/useValidationReport';
import { ValidationReportViewer, GenerationProgress } from '@/components/validation-report';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Zap, 
  Search, 
  Users, 
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileText,
  ChevronLeft
} from 'lucide-react';
import { ValidationReportType } from '@/types/validation-report';

type ValidationMode = 'quick' | 'deep' | 'investor';

const MODE_INFO = {
  quick: { 
    icon: Zap, 
    title: 'Quick Validate', 
    duration: '~30 sec',
    description: 'Fast overview of your startup readiness'
  },
  deep: { 
    icon: Search, 
    title: 'Deep Validate', 
    duration: '~60 sec',
    description: 'Comprehensive 14-section analysis'
  },
  investor: { 
    icon: Users, 
    title: 'Investor Lens', 
    duration: '~45 sec',
    description: 'See your startup through VC eyes'
  },
};

export default function Validator() {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const [activeMode, setActiveMode] = useState<ValidationMode>('deep');
  const [showReport, setShowReport] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);
  
  const { 
    report,
    history,
    isLoadingReport,
    isLoadingHistory,
    isGenerating,
    generateReport,
  } = useValidationReport(startup?.id);

  // Simulate phase progression during generation
  useEffect(() => {
    if (!isGenerating) {
      setGenerationPhase(0);
      return;
    }
    
    const phaseInterval = setInterval(() => {
      setGenerationPhase(prev => Math.min(prev + 1, 4));
    }, 8000); // Progress every 8 seconds
    
    return () => clearInterval(phaseInterval);
  }, [isGenerating]);

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
      {report && (
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry Benchmark</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Score</span>
              <span className="font-semibold text-foreground">{report.overallScore}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Industry Average</span>
              <span className="text-muted-foreground">{report.benchmarks.averageScore}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Top Performers</span>
              <span className="text-sage font-medium">{report.benchmarks.topPerformers}+</span>
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
              <button
                key={item.id}
                onClick={() => setShowReport(true)}
                className="w-full flex items-center justify-between text-sm hover:bg-muted/50 p-2 rounded-lg transition-colors"
              >
                <span className="text-muted-foreground capitalize">{item.reportType}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.overallScore}/100</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {report && (
        <div className="card-premium p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Actions</span>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setShowReport(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // Show full report view
  if (showReport && report) {
    return (
      <DashboardLayout>
        <div className="relative">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReport(false)}
            className="absolute top-4 left-4 z-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
          
          <ValidationReportViewer
            report={report}
            onRegenerate={() => generateReport(activeMode)}
            isRegenerating={isGenerating}
          />
        </div>
      </DashboardLayout>
    );
  }

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
              Generate comprehensive 14-section validation reports for your startup.
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

          {/* Generate Button */}
          <Button 
            onClick={() => generateReport(activeMode as ValidationReportType)}
            disabled={isGenerating || !startup}
            className="w-full md:w-auto"
            size="lg"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 mr-2"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Generating Report...
              </>
            ) : (
              <>
                Generate {MODE_INFO[activeMode].title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Generation Progress */}
          {isGenerating && (
            <GenerationProgress
              isGenerating={isGenerating}
              currentPhase={generationPhase}
              reportType={activeMode}
            />
          )}

          {/* Existing Report Preview */}
          <AnimatePresence mode="wait">
            {report && !isGenerating && (
              <motion.div
                key="report-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Report Summary Card */}
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
                          strokeDashoffset={2 * Math.PI * 70 * (1 - report.overallScore / 100)}
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
                        <span className="text-4xl font-bold text-foreground">{report.overallScore}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>

                    {/* Report Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <Badge 
                          className={
                            report.verdict === 'go' 
                              ? 'bg-sage-light text-sage-foreground' 
                              : report.verdict === 'caution'
                                ? 'bg-warm text-warm-foreground'
                                : 'bg-destructive/10 text-destructive'
                          }
                        >
                          {report.verdict.toUpperCase()}
                        </Badge>
                        <h3 className="font-display text-xl font-semibold text-foreground mt-2">
                          {report.executiveSummary.slice(0, 100)}...
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {report.sections.length} Sections
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          TAM: ${(report.marketSizing.tam / 1_000_000_000).toFixed(1)}B
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {report.reportType}
                        </Badge>
                      </div>
                      
                      <Button onClick={() => setShowReport(true)} className="gap-2">
                        View Full Report
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Highlights & Red Flags Quick View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card-premium p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sage" />
                      Highlights
                    </h4>
                    <ul className="space-y-2">
                      {report.highlights.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-premium p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      Red Flags
                    </h4>
                    <ul className="space-y-2">
                      {report.redFlags.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!report && !isGenerating && !isLoadingReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to validate your idea?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a validation mode above and click generate to get a comprehensive 14-section AI-powered report with TAM/SAM/SOM analysis, factor scores, and actionable recommendations.
              </p>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoadingReport && (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          )}
        </div>
      </ValidatorLayout>
    </DashboardLayout>
  );
}
