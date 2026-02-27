/**
 * Global AI Assistant Component
 *
 * Legacy floating overlay for PUBLIC pages only.
 * Authenticated pages use the persistent AIPanel in DashboardLayout instead.
 *
 * @see AIPanel — persistent 360px panel (CORE-02)
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGlobalAIAssistant } from '@/hooks/useGlobalAIAssistant';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { AIFloatingIcon } from './AIFloatingIcon';
import { AIDrawer } from './AIDrawer';
import { AIBottomSheet } from './AIBottomSheet';

/** Routes that use DashboardLayout (persistent panel handles AI) */
const DASHBOARD_PREFIXES = [
  '/dashboard', '/tasks', '/crm', '/documents', '/investors',
  '/settings', '/lean-canvas', '/user-profile', '/company-profile',
  '/app/', '/projects', '/validate', '/analytics', '/weekly-review',
  '/ai-chat', '/sprint-plan',
];

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

  // Don't render on routes that use DashboardLayout (persistent panel handles it)
  const isDashboardRoute = DASHBOARD_PREFIXES.some(
    (prefix) => location.pathname === prefix || location.pathname.startsWith(prefix + '/')
  );

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

  // Skip on dashboard routes — persistent panel in DashboardLayout handles AI
  if (isDashboardRoute) return null;

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
