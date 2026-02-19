import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Layer {
  title: string;
  subtitle: string;
  description?: string;
}

interface StackedDiagramProps {
  layers: Layer[];
  title?: string;
}

const StackedDiagram = ({ layers, title }: StackedDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border p-6 md:p-8"
    >
      {title && (
        <h4 className="font-display text-lg font-medium text-foreground mb-6 text-center">
          {title}
        </h4>
      )}
      
      <div className="space-y-0">
        {layers.map((layer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: (layers.length - index - 1) * 0.15, ease: "easeOut" }}
            className={`relative border-2 border-primary/20 p-4 md:p-5 ${
              index === 0 ? 'rounded-t-xl' : ''
            } ${
              index === layers.length - 1 ? 'rounded-b-xl' : ''
            } ${
              index % 2 === 0 ? 'bg-sage-light/50' : 'bg-card'
            }`}
            style={{
              marginTop: index === 0 ? 0 : -2
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">{layer.title}</h5>
                <p className="text-sm text-muted-foreground mt-0.5">{layer.subtitle}</p>
              </div>
              {layer.description && (
                <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded">
                  {layer.description}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StackedDiagram;
