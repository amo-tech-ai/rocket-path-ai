import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EcosystemLayer {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
}

interface EcosystemStackProps {
  title: string;
  subtitle?: string;
  layers: EcosystemLayer[];
}

const EcosystemStack = ({ title, subtitle, layers }: EcosystemStackProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {layers.map((layer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className={cn(
              "relative rounded-xl border border-border overflow-hidden",
              index === 0 && "bg-primary/5 border-primary/20",
              index === 1 && "bg-muted/50",
              index === 2 && "bg-background"
            )}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                  index === 0 && "bg-primary/10 text-primary",
                  index === 1 && "bg-muted text-muted-foreground",
                  index === 2 && "bg-muted/50 text-muted-foreground"
                )}>
                  <layer.icon className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      {layer.number}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      {layer.subtitle}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                    {layer.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Connection line to next layer */}
            {index < layers.length - 1 && (
              <div className="absolute -bottom-4 left-12 w-px h-4 bg-border z-10" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EcosystemStack;
