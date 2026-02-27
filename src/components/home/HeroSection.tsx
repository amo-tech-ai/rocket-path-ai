import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Play, Diamond, Hexagon, Triangle, Circle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { setReturnPathOnce } from "@/lib/authReturnPath";

const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState("");

  // Fast staggered animation — CTA visible in <1.5s
  const fade = (delay: number) =>
    prefersReducedMotion
      ? {}
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sage-light/30 via-background to-background" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm/30 rounded-full blur-3xl" />

      <div className="container-premium relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            {...fade(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light border border-sage/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse-soft" />
            <span className="text-sm text-sage-foreground font-medium">AI-Powered Operating System</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fade(0.05)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6 text-balance"
          >
            Strategy to
            <br />
            daily execution,
            <br />
            <span className="text-foreground/60">in one guided flow</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fade(0.1)}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            AI-powered clarity for founders. Move from vision to action with intelligent
            planning, automated insights, and daily momentum—all in one place.
          </motion.p>

          {/* Idea input + CTAs */}
          <motion.div
            {...fade(0.15)}
            className="max-w-xl mx-auto w-full space-y-4"
          >
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea... e.g. 'An AI-powered platform that helps landlords screen tenants faster'"
              className="min-h-[80px] resize-none text-base bg-card/80 border-border/60 focus:border-sage/40"
              maxLength={1000}
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={() => {
                  const trimmed = idea.trim();
                  if (trimmed) {
                    sessionStorage.setItem("pendingIdea", trimmed);
                    if (user) {
                      navigate("/validate?hasIdea=true");
                    } else {
                      const returnTo = "/validate?hasIdea=true";
                      setReturnPathOnce(returnTo);
                      navigate(`/login?redirect=${encodeURIComponent(returnTo)}`);
                    }
                  } else {
                    navigate("/validate");
                  }
                }}
              >
                Validate Your Idea
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroSecondary" size="xl" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.35, delay: 0.3 } })}
            className="mt-12 text-sm text-muted-foreground"
          >
            Trusted by 2,000+ founders building the next generation of companies
          </motion.p>
        </div>

        {/* Hero Visual - Abstract Flow Diagram */}
        <motion.div
          {...(prefersReducedMotion ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 } })}
          className="mt-16 lg:mt-24"
        >
          <div className="card-elevated p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Flow nodes */}
              {[
                { label: "Strategy", sublabel: "Define vision", Icon: Diamond },
                { label: "Plan", sublabel: "AI creates roadmap", Icon: Hexagon },
                { label: "Execute", sublabel: "Track progress", Icon: Triangle },
                { label: "Reflect", sublabel: "Learn & iterate", Icon: Circle },
              ].map((node, index) => (
                <div key={node.label} className="relative">
                  <div className="diagram-node diagram-node-active text-center">
                    <node.Icon className="w-6 h-6 mx-auto mb-2 text-sage" />
                    <div className="font-semibold text-foreground">{node.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{node.sublabel}</div>
                  </div>
                  {/* Connector */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border transform -translate-y-1/2">
                      <div className="absolute right-0 top-1/2 w-2 h-2 border-t border-r border-border transform rotate-45 -translate-y-1/2 -translate-x-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
