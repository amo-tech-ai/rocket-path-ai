import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, AlertTriangle, TrendingUp, CheckCircle2, Clock, BarChart3 } from "lucide-react";

const IntelligenceDashboard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    { icon: Target, text: "Clear next actions" },
    { icon: AlertTriangle, text: "Risk alerts" },
    { icon: TrendingUp, text: "Progress visibility" },
  ];

  return (
    <section ref={ref} className="section-marketing bg-secondary/30">
      <div className="container-marketing">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow mb-4">Your command center</p>
            <h2 className="headline-lg text-foreground mb-6">
              See what matters today
            </h2>
            <p className="body-lg mb-8">
              StartupAI turns goals, data, and context into clear daily priorities. 
              No more guessing what to focus on.
            </p>
            
            <div className="space-y-4 mb-8">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="icon-container">
                    <outcome.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{outcome.text}</span>
                </motion.div>
              ))}
            </div>
            
            <Button variant="outline" className="btn-secondary">
              View dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Right: Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="marketing-card p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-medium text-foreground">Today's Priorities</h3>
                <span className="text-xs text-muted-foreground">Jan 17, 2026</span>
              </div>
              
              {/* Priority Items */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">Follow up with Sequoia</p>
                    <p className="text-sm text-muted-foreground">Meeting scheduled for 2pm</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground font-semibold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">Review pitch deck v3</p>
                    <p className="text-sm text-muted-foreground">Due by end of day</p>
                  </div>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground font-semibold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">Update financial model</p>
                    <p className="text-sm text-muted-foreground">Q1 projections</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Weekly progress</span>
                  <span className="text-sm font-medium text-primary">67%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceDashboard;
