import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Target, Filter, Star, Building2, Users } from "lucide-react";

const DiscoveryResearch = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    { icon: Target, text: "Smart matching" },
    { icon: Star, text: "Relevance scoring" },
    { icon: Filter, text: "Fast filtering" },
  ];

  const results = [
    { name: "Sequoia Capital", match: 94, focus: "Series A • SaaS", type: "VC" },
    { name: "First Round", match: 89, focus: "Seed • Enterprise", type: "VC" },
    { name: "Bessemer Venture", match: 87, focus: "Series A • Cloud", type: "VC" },
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
            <p className="eyebrow mb-4">Discovery</p>
            <h2 className="headline-lg text-foreground mb-6">
              Find what fits
            </h2>
            <p className="body-lg mb-8">
              Search investors, partners, and markets using natural language. 
              Get matched based on your specific needs.
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
              Try discovery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Right: Search Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="marketing-card p-6 lg:p-8">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <div className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground">
                  SaaS investors interested in AI for Series A
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                  Series A
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                  SaaS
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                  AI/ML
                </span>
              </div>
              
              {/* Results */}
              <div className="space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={result.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{result.name}</p>
                      <p className="text-sm text-muted-foreground">{result.focus}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-lg font-display font-medium text-primary">{result.match}%</p>
                        <p className="text-xs text-muted-foreground">match</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-muted-foreground">47 more results available</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryResearch;
