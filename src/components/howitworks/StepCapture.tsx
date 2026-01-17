import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Clock, Target, Users } from "lucide-react";

const StepCapture = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-widest text-sage uppercase mb-4 block">
              Step 01
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-dark mb-6">
              Capture your strategy{" "}
              <span className="text-muted-foreground">(30 minutes)</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              StartupAI runs an onboarding conversation with you: what you're building, 
              your business model, your strengths and gaps. By the end, your strategic 
              foundation is captured and stored.
            </p>
          </motion.div>

          {/* Right - UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl border border-border shadow-premium-lg p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-semibold text-dark mb-1">Strategy Session</h3>
                  <p className="text-sm text-muted-foreground">Complete your profile</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-sage">
                  <Clock className="w-4 h-4" />
                  <span>~30 min</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-sage">67%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-sage rounded-full" />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                  <CheckCircle2 className="w-5 h-5 text-sage" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">Company Overview</p>
                    <p className="text-xs text-muted-foreground">Vision, mission, and product</p>
                  </div>
                  <span className="text-xs text-sage font-medium">Complete</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                  <CheckCircle2 className="w-5 h-5 text-sage" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">Business Model</p>
                    <p className="text-xs text-muted-foreground">Revenue, pricing, and channels</p>
                  </div>
                  <span className="text-xs text-sage font-medium">Complete</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border-2 border-sage/30">
                  <Target className="w-5 h-5 text-sage" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">Market & Competition</p>
                    <p className="text-xs text-muted-foreground">Target market and competitive landscape</p>
                  </div>
                  <span className="text-xs text-sage font-medium">In Progress</span>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border opacity-60">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Team & Resources</p>
                    <p className="text-xs text-muted-foreground">Capabilities and constraints</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Upcoming</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StepCapture;
