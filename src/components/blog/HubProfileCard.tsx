import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";

interface HubProfileCardProps {
  name: string;
  region: string;
  whyItMatters: string[];
  whatGetsFunded?: string[];
  whyFoundersMove?: string[];
  index?: number;
}

const HubProfileCard = ({ 
  name, 
  region, 
  whyItMatters, 
  whatGetsFunded,
  whyFoundersMove,
  index = 0 
}: HubProfileCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border p-6 hover:border-primary/20 transition-colors"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-display text-lg font-medium text-foreground">
            {name}
          </h4>
          <p className="text-sm text-muted-foreground">{region}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Why it matters
          </h5>
          <ul className="space-y-1">
            {whyItMatters.map((item, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {whatGetsFunded && (
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              What gets funded
            </h5>
            <ul className="space-y-1">
              {whatGetsFunded.map((item, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-sage mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {whyFoundersMove && (
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Why founders move here
            </h5>
            <ul className="space-y-1">
              {whyFoundersMove.map((item, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HubProfileCard;
