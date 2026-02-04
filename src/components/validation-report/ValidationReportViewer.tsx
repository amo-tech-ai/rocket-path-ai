/**
 * Full Validation Report Viewer
 * Premium 14-section report display
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Share2, 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ValidationReport } from '@/types/validation-report';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import TAMSAMSOMChart from './TAMSAMSOMChart';
import DimensionScoresChart from './DimensionScoresChart';
import FactorsBreakdownCard from './FactorsBreakdownCard';
import SectionNavigation from './SectionNavigation';
import ReportSectionContent from './ReportSectionContent';

interface ValidationReportViewerProps {
  report: ValidationReport;
  onRegenerate?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  isRegenerating?: boolean;
  className?: string;
}

export default function ValidationReportViewer({
  report,
  onRegenerate,
  onExport,
  onShare,
  isRegenerating = false,
  className,
}: ValidationReportViewerProps) {
  const [activeSection, setActiveSection] = useState(1);
  const [viewMode, setViewMode] = useState<'overview' | 'sections'>('overview');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top when section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);
  
  const currentSection = report.sections.find(s => s.number === activeSection);
  const completedSections = report.sections.map(s => s.number);
  
  const handlePrevSection = () => {
    if (activeSection > 1) setActiveSection(activeSection - 1);
  };
  
  const handleNextSection = () => {
    if (activeSection < 14) setActiveSection(activeSection + 1);
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Title */}
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Validation Report
                </h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {report.reportType}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {onRegenerate && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                >
                  <RefreshCw className={cn(
                    "w-4 h-4 mr-2",
                    isRegenerating && "animate-spin"
                  )} />
                  Regenerate
                </Button>
              )}
              {onShare && (
                <Button variant="ghost" size="sm" onClick={onShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
              {onExport && (
                <Button variant="default" size="sm" onClick={onExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </div>
          
          {/* View mode tabs */}
          <div className="flex gap-1 pb-3">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('overview')}
              className="text-xs"
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'sections' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('sections')}
              className="text-xs"
            >
              Full Report
            </Button>
          </div>
        </div>
      </motion.header>
      
      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Executive Summary */}
              <ExecutiveSummaryCard
                score={report.overallScore}
                verdict={report.verdict}
                summary={report.executiveSummary}
                highlights={report.highlights}
                redFlags={report.redFlags}
                percentile={report.benchmarks.percentile}
              />
              
              {/* TAM/SAM/SOM + Dimensions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TAMSAMSOMChart data={report.marketSizing} />
                <DimensionScoresChart scores={report.dimensionScores} />
              </div>
              
              {/* Factors Breakdown */}
              <FactorsBreakdownCard
                marketFactors={report.marketFactors}
                executionFactors={report.executionFactors}
              />
              
              {/* CTA to view full report */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-8"
              >
                <Button 
                  size="lg" 
                  onClick={() => setViewMode('sections')}
                  className="gap-2"
                >
                  View Full 14-Section Report
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-8"
            >
              {/* Section Navigation (Desktop) */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <SectionNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    completedSections={completedSections}
                  />
                </div>
              </div>
              
              {/* Section Content */}
              <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
                {/* Mobile section nav */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handlePrevSection}
                    disabled={activeSection === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-foreground">
                    Section {activeSection} of 14
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleNextSection}
                    disabled={activeSection === 14}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Section content */}
                <AnimatePresence mode="wait">
                  {currentSection && (
                    <ReportSectionContent 
                      key={activeSection}
                      section={currentSection} 
                    />
                  )}
                </AnimatePresence>
                
                {/* Section pagination */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevSection}
                    disabled={activeSection === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant={activeSection === 14 ? 'default' : 'outline'}
                    onClick={activeSection === 14 ? () => setViewMode('overview') : handleNextSection}
                  >
                    {activeSection === 14 ? 'Back to Overview' : 'Next'}
                    {activeSection !== 14 && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
