import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-background">
      <div className="container-marketing">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="eyebrow"
            >
              AI Operating System for Founders
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="headline-xl text-foreground mb-6"
            >
              From strategy to daily execution, in one guided flow.
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="body-lg mb-10"
            >
              StartupAI is the central intelligence layer that transforms scattered 
              tools and information into a unified, investor-ready operating system.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button size="lg" className="px-8" asChild>
                <Link to="/login">
                  Start Your Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href="#how-it-works">
                  <Play className="w-4 h-4 mr-2" />
                  Watch How It Works
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right: Product Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-card rounded-2xl border border-border p-6 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Mock UI Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-sage/60" />
              </div>

              {/* Mock Dashboard Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-4 bg-primary/20 rounded w-20" />
                </div>
                
                {/* Progress bars */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">Strategy</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-xs text-foreground font-medium">85%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">Pitch Deck</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[60%] h-full bg-sage rounded-full" />
                    </div>
                    <span className="text-xs text-foreground font-medium">60%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">Financials</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[40%] h-full bg-primary/60 rounded-full" />
                    </div>
                    <span className="text-xs text-foreground font-medium">40%</span>
                  </div>
                </div>

                {/* Tasks preview */}
                <div className="pt-4 border-t border-border mt-4">
                  <div className="text-xs font-medium text-foreground mb-3">Today's Focus</div>
                  <div className="space-y-2">
                    {["Complete market analysis", "Review pitch deck draft", "Schedule investor call"].map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-4 h-4 rounded border border-border flex items-center justify-center">
                          {i === 0 && <div className="w-2 h-2 bg-primary rounded-sm" />}
                        </div>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg"
            >
              <div className="text-2xl font-display font-medium">10x</div>
              <div className="text-xs opacity-90">faster than manual</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
