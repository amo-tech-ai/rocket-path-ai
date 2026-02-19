import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Brain, Map, Zap } from "lucide-react";

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Structured Input",
      description: "Answer guided questions about your vision, goals, resources, and constraints. No blank-page paralysis.",
      icon: FileText,
      diagram: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sage/30" />
            <div className="h-2 bg-border rounded flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sage/50" />
            <div className="h-2 bg-border rounded w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sage" />
            <div className="h-2 bg-border rounded w-1/2" />
          </div>
        </div>
      ),
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI agents analyze your inputs, identify patterns, surface risks, and find opportunities you might miss.",
      icon: Brain,
      diagram: (
        <div className="relative h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-sage/40 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-sage animate-pulse-soft" />
              </div>
            </div>
          </div>
          {/* Orbiting dots */}
          <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-sage/40" />
          <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-sage/40" />
          <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-sage/40" />
        </div>
      ),
    },
    {
      number: "03",
      title: "Clear Plan",
      description: "Receive a structured roadmap with milestones, priorities, and dependencies—ready to execute.",
      icon: Map,
      diagram: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-sage bg-sage/20" />
            <div className="h-1 bg-sage rounded flex-1" />
            <div className="w-4 h-4 rounded-full border-2 border-sage/50" />
          </div>
          <div className="flex items-center gap-3 pl-6">
            <div className="w-3 h-3 rounded-full border-2 border-border" />
            <div className="h-1 bg-border rounded flex-1" />
            <div className="w-3 h-3 rounded-full border-2 border-border" />
          </div>
          <div className="flex items-center gap-3 pl-12">
            <div className="w-2 h-2 rounded-full border-2 border-border" />
            <div className="h-1 bg-border rounded flex-1" />
          </div>
        </div>
      ),
    },
    {
      number: "04",
      title: "Daily Momentum",
      description: "Each day, see exactly what to focus on. Track progress, adjust priorities, and maintain flow.",
      icon: Zap,
      diagram: (
        <div className="flex items-end gap-1 h-16">
          {[40, 55, 45, 70, 60, 85, 75].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: i === 5 ? "hsl(var(--sage))" : "hsl(var(--sage) / 0.3)",
              }}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="section-padding">
      <div className="container-premium">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            How StartupAI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A guided flow that transforms your vision into actionable daily priorities.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="card-elevated p-8 hover-lift"
              >
                <div className="flex items-start gap-6">
                  {/* Step number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-sage" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-xs font-medium text-sage mb-1">{step.number}</div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                    
                    {/* Diagram */}
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      {step.diagram}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flow connector - desktop only */}
        <div className="hidden lg:block mt-12">
          <div className="max-w-3xl mx-auto">
            <svg viewBox="0 0 600 60" className="w-full h-auto">
              <path
                d="M 50 30 Q 150 10, 250 30 T 450 30 T 550 30"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              {[50, 200, 350, 550].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={30}
                  r="8"
                  fill={i === 3 ? "hsl(var(--sage))" : "hsl(var(--sage-light))"}
                  stroke="hsl(var(--sage))"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
