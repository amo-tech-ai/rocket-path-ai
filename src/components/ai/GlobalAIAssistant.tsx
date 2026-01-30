/**
 * Global AI Assistant Component
 * 
 * Floating AI assistant accessible from every screen.
 * - Public Mode: Answer questions about StartupAI
 * - Authenticated Mode: Full contextual startup advisor
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGlobalAIAssistant } from '@/hooks/useGlobalAIAssistant';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { AIFloatingIcon } from './AIFloatingIcon';
import { AIDrawer } from './AIDrawer';
import { AIBottomSheet } from './AIBottomSheet';

interface GlobalAIAssistantProps {
  className?: string;
}

export function GlobalAIAssistant({ className }: GlobalAIAssistantProps) {
  const location = useLocation();
  const { isMobile } = useMobileDetect();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const {
    isOpen,
    toggle,
    close,
  } = useGlobalAIAssistant();

  // Hide on dedicated chat page
  const isOnChatPage = location.pathname === '/ai-chat';

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
        buttonRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const handleClose = useCallback(() => {
    close();
    buttonRef.current?.focus();
  }, [close]);

  // Don't render on dedicated chat page
  if (isOnChatPage) return null;

  return (
    <>
      {/* Floating Icon */}
      <AIFloatingIcon
        ref={buttonRef}
        onClick={toggle}
        isOpen={isOpen}
        className={className}
      />

      {/* Chat Panel - Desktop Drawer or Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          isMobile ? (
            <AIBottomSheet onClose={handleClose} />
          ) : (
            <AIDrawer onClose={handleClose} />
          )
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalAIAssistant;
