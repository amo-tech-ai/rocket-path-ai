import { useRef, useState, useEffect } from 'react';

export function useScrollReveal(options?: { threshold?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [isVisible, setIsVisible] = useState(prefersReduced);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const id = setTimeout(() => setIsVisible(true), options?.delay ?? 0);
          observer.disconnect();
          return () => clearTimeout(id);
        }
      },
      { threshold: options?.threshold ?? 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced, options?.threshold, options?.delay]);

  return { ref, isVisible };
}
