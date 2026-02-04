/**
 * Report Section Content
 * Individual section display with citations
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

export default function ReportSectionContent({ section, className }: ReportSectionContentProps) {
  const sectionInfo = SECTION_TITLES[section.number];
  const Icon = SECTION_ICONS[section.number] || FileText;
  
  const getScoreVariant = (score: number) => {
    if (score >= 8) return 'bg-sage-light text-sage-foreground';
    if (score >= 6) return 'bg-warm text-warm-foreground';
    return 'bg-destructive/10 text-destructive';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("card-premium overflow-hidden", className)}
    >
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {section.number}. {section.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {sectionInfo?.description}
              </p>
            </div>
          </div>
          
          {section.score !== undefined && (
            <Badge className={cn("px-3 py-1", getScoreVariant(section.score))}>
              {section.score}/10
            </Badge>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="text-foreground leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 mb-4">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              h3: ({ children }) => (
                <h3 className="font-display text-lg font-semibold text-foreground mt-6 mb-3">
                  {children}
                </h3>
              ),
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
        
        {/* Citations */}
        {section.citations && section.citations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sources
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.citations.map((citation, i) => (
                <CitationBadge key={i} citation={citation} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
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
        "text-xs",
        citation.url && "cursor-pointer hover:bg-muted"
      )}
    >
      {citation.source}
      {citation.year && <span className="ml-1 text-muted-foreground">({citation.year})</span>}
      {citation.url && <ExternalLink className="w-3 h-3 ml-1" />}
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
