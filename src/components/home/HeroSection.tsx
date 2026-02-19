import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Diamond, Hexagon, Triangle, Circle } from "lucide-react";

const HeroSection = () => {
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light border border-sage/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse-soft" />
            <span className="text-sm text-sage-foreground font-medium">AI-Powered Operating System</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            AI-powered clarity for founders. Move from vision to action with intelligent 
            planning, automated insights, and daily momentum—all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard">
                Start Strategy Session
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroSecondary" size="xl" asChild>
              <Link to="#how-it-works">
                <Play className="w-4 h-4" />
                See How It Works
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-sm text-muted-foreground"
          >
            Trusted by 2,000+ founders building the next generation of companies
          </motion.p>
        </div>

        {/* Hero Visual - Abstract Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
