/**
 * Animated Card Wrapper for slide-in effects
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cardSlideInVariants, cardSlideDownVariants } from '@/hooks/realtime/animations';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  direction?: 'right' | 'down';
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  direction = 'right',
  delay = 0,
  className,
  onClick,
}: AnimatedCardProps) {
  const variants = direction === 'down' ? cardSlideDownVariants : cardSlideInVariants;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay }}
      className={cn('cursor-default', className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for multiple animated cards
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.2,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className={className}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger item to be used inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
