import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Send } from "lucide-react";

const StepDecisions = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-widest text-sage uppercase mb-4 block">
              Step 04
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-dark mb-6">
              Make better decisions,{" "}
              <span className="text-sage italic">faster</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ask any question about your startup. Get answers grounded in your strategy, 
              your numbers, and your market context — not generic advice.
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Strategic Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Ask anything about your startup</p>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="space-y-4 mb-6">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-4 rounded-2xl rounded-br-md bg-sage text-dark-foreground">
                    <p className="text-sm">Should we focus on enterprise sales or self-serve for the next quarter?</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-[90%] p-4 rounded-2xl rounded-bl-md bg-secondary/50 border border-border">
                    <p className="text-sm text-dark leading-relaxed mb-3">
                      Based on your strategy profile, I'd recommend prioritizing <span className="font-medium">enterprise sales</span> for Q1. Here's why:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-sage mt-1">•</span>
                        Your current runway (14 months) supports longer sales cycles
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sage mt-1">•</span>
                        Enterprise ACV ($45K) is 9x higher than self-serve
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sage mt-1">•</span>
                        3 warm enterprise leads in your pipeline are ready for demos
                      </li>
                    </ul>
                    <p className="text-sm text-dark mt-3">
                      Self-serve can wait until Q2 when the product has the features enterprise customers are requesting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about strategy, metrics, or next steps..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-sage/50"
                  disabled
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
                  <Send className="w-4 h-4 text-dark-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StepDecisions;
