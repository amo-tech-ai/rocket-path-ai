import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Presentation, FileText, Mail, Sparkles } from "lucide-react";

const DocumentsPitchDecks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    { icon: Presentation, text: "Pitch decks" },
    { icon: FileText, text: "One-pagers" },
    { icon: Mail, text: "Updates & summaries" },
  ];

  const documents = [
    { 
      title: "Series A Pitch Deck", 
      type: "Presentation",
      status: "Ready",
      slides: 12,
      icon: Presentation
    },
    { 
      title: "Executive Summary", 
      type: "One-pager",
      status: "Ready",
      pages: 1,
      icon: FileText
    },
    { 
      title: "Investor Update Q4", 
      type: "Update",
      status: "Draft",
      pages: 2,
      icon: Mail
    },
  ];

  return (
    <section ref={ref} className="section-marketing bg-background">
      <div className="container-marketing">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Document Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="marketing-card p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-medium text-foreground">Documents</h3>
                <Button size="sm" className="btn-primary text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generate
                </Button>
              </div>
              
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="group flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="w-12 h-14 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                      <doc.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground truncate">{doc.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          doc.status === "Ready" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {"slides" in doc ? `${doc.slides} slides` : `${doc.pages} page${doc.pages > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-display font-medium text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-medium text-primary">2</p>
                  <p className="text-xs text-muted-foreground">Ready</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-medium text-foreground">1</p>
                  <p className="text-xs text-muted-foreground">Draft</p>
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
            <p className="eyebrow mb-4">Documents</p>
            <h2 className="headline-lg text-foreground mb-6">
              Investor-ready by default
            </h2>
            <p className="body-lg mb-8">
              Generate decks, briefs, and updates that match institutional expectations. 
              Professional quality, instantly.
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
              Generate a deck
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsPitchDecks;
