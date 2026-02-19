/**
 * Intelligence Panel Component
 * 
 * Right panel that displays industry-grounded AI advice.
 * Automatically filters content based on current screen context.
 * 
 * Features:
 * - Dynamic knowledge display based on route
 * - Industry terminology with definitions
 * - Benchmarks comparison
 * - Common mistakes warnings
 * - Success patterns
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  TrendingUp,
  Lightbulb,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlaybook } from '@/providers/PlaybookProvider';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface IntelligencePanelProps {
  className?: string;
  /** Override categories to display */
  categories?: string[];
  /** Custom title */
  title?: string;
}

// ============================================================================
// Component
// ============================================================================

export function IntelligencePanel({ 
  className, 
  categories: overrideCategories,
  title 
}: IntelligencePanelProps) {
  const location = useLocation();
  const { 
    industry, 
    stage, 
    context, 
    isLoading, 
    getKnowledge, 
    getFeatureContext 
  } = usePlaybook();
  
  // Get feature context for current route
  const featureContext = useMemo(() => 
    getFeatureContext(location.pathname), 
    [location.pathname, getFeatureContext]
  );
  
  // Get knowledge slice for current screen
  const categories = overrideCategories || featureContext.categories;
  const knowledge = useMemo(() => 
    getKnowledge(categories), 
    [categories, getKnowledge]
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className={cn("p-4 space-y-4", className)}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  // No industry selected
  if (!industry || !context) {
    return (
      <div className={cn("p-4", className)}>
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6 text-center">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Complete your profile to see industry-specific insights
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">
            {title || `${context.display_name} Intelligence`}
          </h3>
          {stage && (
            <Badge variant="outline" className="ml-auto text-xs">
              {stage.replace('_', ' ')}
            </Badge>
          )}
        </div>
        
        {/* Advisor Persona */}
        {context.advisor_persona && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-3">
              <p className="text-sm italic text-muted-foreground">
                "{context.advisor_persona}"
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Terminology Section */}
        {knowledge.terminology.length > 0 && (
          <IntelligenceSection
            icon={BookOpen}
            title="Key Terms"
            iconColor="text-blue-500"
          >
            <div className="space-y-2">
              {knowledge.terminology.slice(0, 5).map((item, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium">{item.term}:</span>{' '}
                  <span className="text-muted-foreground">{item.definition}</span>
                </div>
              ))}
            </div>
          </IntelligenceSection>
        )}
        
        {/* Benchmarks Section */}
        {Object.keys(knowledge.benchmarks).length > 0 && (
          <IntelligenceSection
            icon={Target}
            title="Industry Benchmarks"
            iconColor="text-green-500"
          >
            <div className="space-y-2">
              {Object.entries(knowledge.benchmarks).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </IntelligenceSection>
        )}
        
        {/* Mental Models */}
        {knowledge.mental_models.length > 0 && (
          <IntelligenceSection
            icon={Lightbulb}
            title="Mental Models"
            iconColor="text-yellow-500"
          >
            <ul className="space-y-1">
              {knowledge.mental_models.slice(0, 4).map((model, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{model}</span>
                </li>
              ))}
            </ul>
          </IntelligenceSection>
        )}
        
        {/* Common Mistakes */}
        {knowledge.common_mistakes.length > 0 && (
          <IntelligenceSection
            icon={AlertTriangle}
            title="Common Mistakes"
            iconColor="text-orange-500"
          >
            <ul className="space-y-1">
              {knowledge.common_mistakes.slice(0, 4).map((mistake, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-orange-500">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </IntelligenceSection>
        )}
        
        {/* Investor Expectations */}
        {Object.keys(knowledge.investor_expectations).length > 0 && (
          <IntelligenceSection
            icon={TrendingUp}
            title="Investor Expectations"
            iconColor="text-purple-500"
          >
            <div className="space-y-2">
              {Object.entries(knowledge.investor_expectations).slice(0, 3).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                  <span className="text-muted-foreground">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </IntelligenceSection>
        )}
      </div>
    </ScrollArea>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface IntelligenceSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  iconColor?: string;
  children: React.ReactNode;
}

function IntelligenceSection({ 
  icon: Icon, 
  title, 
  iconColor = 'text-primary',
  children 
}: IntelligenceSectionProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon className={cn("w-4 h-4", iconColor)} />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default IntelligencePanel;
