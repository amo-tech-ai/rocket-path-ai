import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SourceBadge from "./SourceBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Source {
  name: string;
  url?: string;
}

interface SourcesSectionProps {
  sources: Source[];
  methodology?: string;
  definitions?: { term: string; definition: string }[];
  limitations?: string[];
}

const SourcesSection = ({ sources, methodology, definitions, limitations }: SourcesSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-muted/30 rounded-xl border border-border p-6 md:p-8"
    >
      <h3 className="font-display text-xl font-medium text-foreground mb-6">
        Sources & Methodology
      </h3>
      
      {/* Source badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sources.map((source, index) => (
          <SourceBadge key={index} name={source.name} url={source.url} />
        ))}
      </div>
      
      {/* Accordion for details */}
      <Accordion type="single" collapsible className="space-y-2">
        {methodology && (
          <AccordionItem value="methodology" className="border-border">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Methodology
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {methodology}
            </AccordionContent>
          </AccordionItem>
        )}
        
        {definitions && definitions.length > 0 && (
          <AccordionItem value="definitions" className="border-border">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Definitions
            </AccordionTrigger>
            <AccordionContent>
              <dl className="space-y-3">
                {definitions.map((def, index) => (
                  <div key={index}>
                    <dt className="text-sm font-medium text-foreground">{def.term}</dt>
                    <dd className="text-sm text-muted-foreground mt-0.5">{def.definition}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {limitations && limitations.length > 0 && (
          <AccordionItem value="limitations" className="border-border">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Limitations & Gaps
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {limitations.map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
};

export default SourcesSection;
