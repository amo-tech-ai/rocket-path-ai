import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ListOrdered, BarChart2, Check, Circle, Clock } from "lucide-react";

const TasksExecution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    { icon: Sparkles, text: "AI-generated tasks" },
    { icon: ListOrdered, text: "Smart prioritization" },
    { icon: BarChart2, text: "Visual progress" },
  ];

  const tasks = [
    { title: "Draft investor update email", status: "done", priority: "High" },
    { title: "Prepare Q1 metrics report", status: "progress", priority: "High" },
    { title: "Schedule advisor call", status: "todo", priority: "Medium" },
    { title: "Review competitor analysis", status: "todo", priority: "Medium" },
  ];

  return (
    <section ref={ref} className="section-marketing bg-background">
      <div className="container-marketing">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Task List Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="marketing-card p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-medium text-foreground">Generated Tasks</h3>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">AI Generated</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                  >
                    {task.status === "done" ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    ) : task.status === "progress" ? (
                      <Clock className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {task.title}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "High" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* Progress Summary */}
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">1 of 4 completed</span>
                <div className="flex gap-1">
                  <div className="w-8 h-2 rounded-full bg-primary" />
                  <div className="w-8 h-2 rounded-full bg-muted" />
                  <div className="w-8 h-2 rounded-full bg-muted" />
                  <div className="w-8 h-2 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="eyebrow mb-4">Execution</p>
            <h2 className="headline-lg text-foreground mb-6">
              Tasks that create themselves
            </h2>
            <p className="body-lg mb-8">
              StartupAI converts strategy into prioritized tasks without manual planning. 
              Focus on execution, not organization.
            </p>
            
            <div className="space-y-4 mb-8">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
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
              See execution flow
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TasksExecution;
