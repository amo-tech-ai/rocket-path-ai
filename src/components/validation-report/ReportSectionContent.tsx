/**
 * Report Section Content
 * Premium consulting-grade section display with citations
 */

import { motion } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  Quote,
  CheckCircle2,
  AlertTriangle,
  Target,
  Users,
  DollarSign,
  Rocket,
  Clock,
  Shield,
  TrendingUp,
  ListChecks,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportSection, SECTION_TITLES, Citation } from '@/types/validation-report';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

interface ReportSectionContentProps {
  section: ReportSection;
  className?: string;
}

// Icon mapping for each section
const SECTION_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: FileText,       // Executive Summary
  2: AlertTriangle,  // Problem Analysis
  3: CheckCircle2,   // Solution Assessment
  4: Target,         // Market Size
  5: Users,          // Competition
  6: DollarSign,     // Business Model
  7: Rocket,         // Go-to-Market
  8: Users,          // Team Assessment
  9: Clock,          // Timing Analysis
  10: Shield,        // Risk Assessment
  11: TrendingUp,    // Financial Projections
  12: CheckCircle2,  // Validation Status
  13: ListChecks,    // Recommendations
  14: BookOpen,      // Appendix
};

// Agent mapping for sections (muted label)
const SECTION_AGENTS: Record<number, string> = {
  1: 'ComposerAgent',
  2: 'ExtractorAgent',
  3: 'ExtractorAgent',
  4: 'ResearchAgent',
  5: 'CompetitorAgent',
  6: 'ExtractorAgent',
  7: 'ExtractorAgent',
  8: 'ExtractorAgent',
  9: 'ResearchAgent',
  10: 'ScoringAgent',
  11: 'ScoringAgent',
  12: 'VerifierAgent',
  13: 'MVPAgent',
  14: 'ComposerAgent',
};

export default function ReportSectionContent({ section, className }: ReportSectionContentProps) {
  const sectionInfo = SECTION_TITLES[section.number];
  const Icon = SECTION_ICONS[section.number] || FileText;
  const agentName = SECTION_AGENTS[section.number];
  
  const getScoreVariant = (score: number) => {
    if (score >= 8) return 'text-primary';
    if (score >= 6) return 'text-amber-600';
    return 'text-destructive';
  };
  
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}
    >
      {/* Section Header */}
      <header className="px-8 py-6 border-b border-border bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Section {section.number}
                </span>
                {agentName && (
                  <span className="text-xs text-muted-foreground/60">
                    via {agentName}
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {sectionInfo?.description}
              </p>
            </div>
          </div>
          
          {section.score !== undefined && (
            <div className="text-right flex-shrink-0">
              <span className={cn(
                "font-display text-2xl font-semibold tabular-nums",
                getScoreVariant(section.score)
              )}>
                {section.score}
              </span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          )}
        </div>
      </header>
      
      {/* Section Content */}
      <div className="px-8 py-8">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="text-foreground leading-relaxed mb-5 last:mb-0">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2.5 mb-5 last:mb-0">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2.5 mb-5 last:mb-0 list-decimal list-inside">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2.5 text-foreground leading-relaxed">
                  <span className="text-primary mt-1.5 text-xs">•</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              h3: ({ children }) => (
                <h3 className="font-display text-lg font-semibold text-foreground mt-8 mb-4 first:mt-0">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="font-medium text-foreground mt-6 mb-3 first:mt-0">
                  {children}
                </h4>
              ),
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
        
        {/* Citations */}
        {section.citations && section.citations.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Quote className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Sources
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.citations.map((citation, i) => (
                <CitationBadge key={i} citation={citation} />
              ))}
            </div>
          </footer>
        )}
      </div>
    </motion.article>
  );
}

interface CitationBadgeProps {
  citation: Citation;
}

function CitationBadge({ citation }: CitationBadgeProps) {
  const content = (
    <Badge 
      variant="outline" 
      className={cn(
        "text-xs font-normal py-1 px-2.5",
        citation.url && "cursor-pointer hover:bg-muted transition-colors"
      )}
    >
      {citation.source}
      {citation.year && <span className="ml-1.5 text-muted-foreground">({citation.year})</span>}
      {citation.url && <ExternalLink className="w-3 h-3 ml-1.5" />}
    </Badge>
  );
  
  if (citation.url) {
    return (
      <a href={citation.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  
  return content;
}
