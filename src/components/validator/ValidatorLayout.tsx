/**
 * Validator Layout
 * 3-panel layout: Nav | Main Content | Coach Chat
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import CoachPanel from '@/components/coach/CoachPanel';

interface ValidatorLayoutProps {
  children: React.ReactNode;
  startupId?: string;
}

export default function ValidatorLayout({ children, startupId }: ValidatorLayoutProps) {
  const [isCoachOpen, setIsCoachOpen] = useState(true);
  const [isCoachMinimized, setIsCoachMinimized] = useState(false);
  
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  // Auto-minimize on smaller screens
  useEffect(() => {
    if (!isDesktop && !isTablet) {
      setIsCoachMinimized(true);
    }
  }, [isDesktop, isTablet]);

  const handleToggleCoach = () => {
    if (isCoachMinimized) {
      setIsCoachMinimized(false);
      setIsCoachOpen(true);
    } else {
      setIsCoachMinimized(true);
    }
  };

  const handleCloseCoach = () => {
    setIsCoachOpen(false);
    setIsCoachMinimized(false);
  };

  // Desktop: side-by-side
  if (isDesktop) {
    return (
      <div className="flex h-full">
        {/* Main Content */}
        <div 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            isCoachOpen && !isCoachMinimized ? "pr-0" : "pr-0"
          )}
        >
          {children}
        </div>

        {/* Coach Panel */}
        <AnimatePresence>
          {startupId && isCoachOpen && !isCoachMinimized && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="h-full flex-shrink-0"
            >
              <CoachPanel
                startupId={startupId}
                onClose={handleCloseCoach}
                onMinimize={handleToggleCoach}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Coach Button */}
        {startupId && (isCoachMinimized || !isCoachOpen) && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleToggleCoach}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}

        {/* Toggle Button (Desktop) */}
        {startupId && !isCoachMinimized && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleCoach}
            className="fixed right-[412px] top-20 z-40 bg-background/80 backdrop-blur-sm border shadow-sm"
          >
            {isCoachOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </Button>
        )}
      </div>
    );
  }

  // Tablet: Drawer pattern
  if (isTablet) {
    return (
      <div className="relative h-full">
        {/* Main Content */}
        <div className="h-full overflow-auto">
          {children}
        </div>

        {/* Coach Drawer */}
        <AnimatePresence>
          {startupId && isCoachOpen && !isCoachMinimized && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleToggleCoach}
                className="fixed inset-0 bg-black/20 z-40"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed right-0 top-0 bottom-0 w-[400px] z-50 shadow-xl"
              >
                <CoachPanel
                  startupId={startupId}
                  onClose={handleCloseCoach}
                  onMinimize={handleToggleCoach}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Coach Button */}
        {startupId && (isCoachMinimized || !isCoachOpen) && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleToggleCoach}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    );
  }

  // Mobile: Toggle pattern
  return (
    <div className="relative h-full">
      {/* Main Content or Coach (toggle) */}
      <AnimatePresence mode="wait">
        {isCoachOpen && !isCoachMinimized && startupId ? (
          <motion.div
            key="coach"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="h-full"
          >
            <CoachPanel
              startupId={startupId}
              onClose={handleCloseCoach}
              onMinimize={handleToggleCoach}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full overflow-auto"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Coach Button (Mobile) */}
      {startupId && (isCoachMinimized || !isCoachOpen) && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={handleToggleCoach}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
