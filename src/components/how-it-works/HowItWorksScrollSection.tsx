import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import StepList from "./StepList";
import AppWindow from "./AppWindow";
import { useCursorAnimation } from "./useCursorAnimation";

const HowItWorksScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  
  const [activeStep, setActiveStep] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll-based step detection
  useEffect(() => {
    if (isMobile || !sectionRef.current) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = -rect.top;
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, sectionTop / sectionHeight));

      // Map scroll progress to steps (0-25% = 1, 25-50% = 2, 50-75% = 3, 75-100% = 4)
      const newStep = Math.min(4, Math.max(1, Math.ceil(scrollProgress * 4)));
      
      if (newStep !== activeStep) {
        setActiveStep(newStep);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeStep, isMobile]);

  // Cursor animation hook
  const { cursorState, uiState } = useCursorAnimation({
    activeStep,
    isInView: isInView && !isMobile,
    prefersReducedMotion,
  });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-secondary/30"
      style={{ height: isMobile ? 'auto' : '400vh' }}
      aria-label="How StartupAI works"
    >
      {/* Sticky Container for Desktop */}
      <div
        ref={contentRef}
        className={`${
          isMobile 
            ? 'py-16 px-4' 
            : 'sticky top-0 h-screen flex items-center'
        }`}
      >
        <div className="container-premium w-full">
          {/* Desktop Layout - Two Columns */}
          {!isMobile && (
            <div className="grid lg:grid-cols-[40%_60%] gap-8 lg:gap-16 items-center">
              {/* Left Column - Text & Steps */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {/* Eyebrow */}
                <span className="text-xs font-semibold tracking-widest text-sage uppercase mb-4 block">
                  How It Works
                </span>
                
                {/* Headline */}
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-8">
                  From strategy to daily{" "}
                  <span className="text-sage italic">execution</span>,{" "}
                  in one platform.
                </h2>

                {/* Step List */}
                <StepList activeStep={activeStep} />
              </motion.div>

              {/* Right Column - App Window */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AppWindow
                  activeStep={activeStep}
                  cursorState={cursorState}
                  uiState={uiState}
                  isMobile={false}
                />
              </motion.div>
            </div>
          )}

          {/* Mobile Layout - Stacked Sections */}
          {isMobile && (
            <div className="space-y-12">
              {/* Header */}
              <div className="text-center">
                <span className="text-xs font-semibold tracking-widest text-sage uppercase mb-4 block">
                  How It Works
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  From strategy to daily{" "}
                  <span className="text-sage italic">execution</span>,{" "}
                  in one platform.
                </h2>
              </div>

              {/* Each Step as Section */}
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-foreground">{step}</span>
                    <div className="w-2 h-2 rounded-full bg-sage" />
                    <span className="text-lg font-semibold text-foreground">
                      {step === 1 && 'Profile'}
                      {step === 2 && 'Analysis'}
                      {step === 3 && 'Pitch Deck'}
                      {step === 4 && 'Execution'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {step === 1 && 'Tell us about your startup once. We do the rest.'}
                    {step === 2 && 'AI turns your info into investor readiness insights.'}
                    {step === 3 && 'Investor-ready materials, auto-generated from your data.'}
                    {step === 4 && 'Track relationships and actions in one intelligent CRM.'}
                  </p>

                  {/* App Window - Completed State */}
                  <AppWindow
                    activeStep={step}
                    cursorState={{ x: 0, y: 0, scale: 1, opacity: 0, isVisible: false }}
                    uiState={null}
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Hint - Desktop only */}
      {!isMobile && isInView && activeStep === 1 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default HowItWorksScrollSection;
