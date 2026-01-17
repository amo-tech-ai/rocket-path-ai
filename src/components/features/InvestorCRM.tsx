import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Bell, FileText, Building2 } from "lucide-react";

const InvestorCRM = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    { icon: Users, text: "Investor pipeline" },
    { icon: Bell, text: "Smart follow-ups" },
    { icon: FileText, text: "Context-aware notes" },
  ];

  const stages = [
    { 
      name: "Researching", 
      count: 12,
      investors: ["Sequoia Capital", "a16z"] 
    },
    { 
      name: "Outreach", 
      count: 8,
      investors: ["Greylock", "Index"] 
    },
    { 
      name: "Meeting", 
      count: 4,
      investors: ["Accel", "Bessemer"] 
    },
    { 
      name: "Term Sheet", 
      count: 1,
      investors: ["Benchmark"] 
    },
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
            <p className="eyebrow mb-4">Investor relations</p>
            <h2 className="headline-lg text-foreground mb-6">
              Every conversation. One place.
            </h2>
            <p className="body-lg mb-8">
              Track investors, meetings, follow-ups, and momentum with full context. 
              Never lose track of where you stand.
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
              Explore investor pipeline
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Right: Kanban Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="marketing-card p-6 overflow-hidden">
              <h3 className="font-display text-lg font-medium text-foreground mb-6">Investor Pipeline</h3>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {stages.map((stage, stageIndex) => (
                  <motion.div
                    key={stage.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + stageIndex * 0.1 }}
                    className="flex-shrink-0 w-36"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {stage.name}
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {stage.count}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {stage.investors.map((investor, i) => (
                        <div 
                          key={investor}
                          className="p-3 rounded-lg border border-border bg-background hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-foreground truncate">
                              {investor}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stageIndex === 0 ? "Research phase" : 
                             stageIndex === 1 ? "Email sent" :
                             stageIndex === 2 ? "Call scheduled" : "Reviewing"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestorCRM;
