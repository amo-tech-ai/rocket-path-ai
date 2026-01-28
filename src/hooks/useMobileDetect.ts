/**
 * Mobile Detection Hook
 * Provides responsive breakpoint detection for mobile-first design
 */

import { useState, useEffect } from 'react';

interface MobileState {
  isMobile: boolean;      // < 640px (sm)
  isTablet: boolean;      // 640px - 1024px
  isDesktop: boolean;     // > 1024px (lg)
  isTouch: boolean;       // Touch device
  screenWidth: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useMobileDetect(): MobileState {
  const [state, setState] = useState<MobileState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        screenWidth: 1024,
        breakpoint: 'desktop',
      };
    }
    
    const width = window.innerWidth;
    return {
      isMobile: width < BREAKPOINTS.sm,
      isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isTouch: 'ontouchstart' in window,
      screenWidth: width,
      breakpoint: width < BREAKPOINTS.sm ? 'mobile' : width < BREAKPOINTS.lg ? 'tablet' : 'desktop',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < BREAKPOINTS.sm,
        isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        isTouch: 'ontouchstart' in window,
        screenWidth: width,
        breakpoint: width < BREAKPOINTS.sm ? 'mobile' : width < BREAKPOINTS.lg ? 'tablet' : 'desktop',
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

export default useMobileDetect;
