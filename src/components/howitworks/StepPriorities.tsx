import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Calendar, AlertTriangle, ChevronRight, Circle, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Priorities ranked by impact",
    description: "Based on strategy, goals, and deadlines",
  },
  {
    icon: Calendar,
    title: "Fundraising activity surfaced",
    description: "Never miss a follow-up or meeting",
  },
  {
    icon: AlertTriangle,
    title: "Risk flagged early",
    description: "Before they slow down your runway",
  },
];

const priorities = [
  { title: "Finalize investor deck updates", priority: "High", progress: 85, status: "in-progress" },
  { title: "Send follow-up to Sequoia", priority: "High", progress: 0, status: "todo" },
  { title: "Review Q4 financial projections", priority: "Medium", progress: 100, status: "done" },
  { title: "Prepare demo for partner meeting", priority: "Medium", progress: 40, status: "in-progress" },
];

const StepPriorities = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-card rounded-2xl border border-border shadow-premium-lg p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-dark mb-1">Today's Priorities</h3>
                  <p className="text-sm text-muted-foreground">Thursday, Jan 17</p>
                </div>
                <span className="text-sm text-sage font-medium">4 tasks</span>
              </div>

              {/* Priority List */}
              <div className="space-y-3">
                {priorities.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-sage/30 transition-colors"
                  >
                    {item.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" />
                    ) : item.status === "in-progress" ? (
                      <div className="w-5 h-5 rounded-full border-2 border-sage flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-sage" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${item.status === "done" ? "text-muted-foreground line-through" : "text-dark"}`}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.priority === "High" 
                            ? "bg-sage/10 text-sage" 
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {item.priority}
                        </span>
                        {item.progress > 0 && item.progress < 100 && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-sage rounded-full" 
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{item.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="text-sm font-semibold tracking-widest text-sage uppercase mb-4 block">
              Step 03
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-dark mb-6">
              Get clear priorities{" "}
              <span className="text-sage italic">every day</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Wake up knowing exactly what matters. See the most important priorities 
              for today, plus context on why they rank highest.
            </p>

            {/* Benefit Cards */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StepPriorities;
