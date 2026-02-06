/**
 * Section Navigation
 * Premium consulting-grade report navigation
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SECTION_TITLES } from '@/types/validation-report';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SectionNavigationProps {
  activeSection: number;
  onSectionChange: (section: number) => void;
  completedSections?: number[];
  className?: string;
}

export default function SectionNavigation({
  activeSection,
  onSectionChange,
  completedSections = [],
  className,
}: SectionNavigationProps) {
  const sections = Object.entries(SECTION_TITLES);
  
  return (
    <nav className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}>
      <header className="px-6 py-4 border-b border-border">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Report Sections
        </h4>
      </header>
      
      <ScrollArea className="h-[480px] lg:h-[560px]">
        <div className="p-3 space-y-0.5">
          {sections.map(([num, { title }]) => {
            const sectionNum = parseInt(num);
            const isActive = activeSection === sectionNum;
            const isCompleted = completedSections.includes(sectionNum);
            
            return (
              <motion.button
                key={num}
                onClick={() => onSectionChange(sectionNum)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                whileTap={{ scale: 0.98 }}
              >
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 border",
                  isActive 
                    ? "bg-primary-foreground text-primary border-transparent" 
                    : isCompleted
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-transparent text-muted-foreground border-border"
                )}>
                  {num}
                </span>
                <span className="text-sm truncate">{title}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </nav>
  );
}
