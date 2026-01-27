import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Minus, LucideIcon } from "lucide-react";

interface Skill {
  name: string;
  proficient: boolean;
}

interface SkillCategory {
  title: string;
  icon: LucideIcon;
  skills: Skill[];
}

interface SkillsMatrixProps {
  title: string;
  subtitle?: string;
  categories: SkillCategory[];
}

const SkillsMatrix = ({ title, subtitle, categories }: SkillsMatrixProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className={cn(
        "grid gap-6",
        categories.length === 3 && "md:grid-cols-3",
        categories.length === 4 && "md:grid-cols-2 lg:grid-cols-4",
        categories.length === 2 && "md:grid-cols-2"
      )}>
        {categories.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground">
                  {category.title}
                </h4>
              </div>
            </div>
            
            {/* Skills list */}
            <div className="p-4 space-y-3">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{skill.name}</span>
                  {skill.proficient ? (
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                      <Minus className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsMatrix;
