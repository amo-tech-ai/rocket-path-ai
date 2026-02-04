/**
 * Section Navigation
 * Sticky navigation for 14 report sections
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
    <div className={cn("card-premium p-4", className)}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Report Sections
      </h4>
      <ScrollArea className="h-[400px] lg:h-[600px]">
        <nav className="space-y-1 pr-3">
          {sections.map(([num, { title }]) => {
            const sectionNum = parseInt(num);
            const isActive = activeSection === sectionNum;
            const isCompleted = completedSections.includes(sectionNum);
            
            return (
              <motion.button
                key={num}
                onClick={() => onSectionChange(sectionNum)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  isActive 
                    ? "bg-primary-foreground text-primary" 
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                )}>
                  {num}
                </span>
                <span className="text-sm font-medium truncate">{title}</span>
              </motion.button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
