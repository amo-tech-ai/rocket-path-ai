import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Role {
  title: string;
  description: string;
  variant?: "emerging" | "stable";
}

interface RoleCardsProps {
  title: string;
  roles: Role[];
  variant?: "emerging" | "stable";
}

const RoleCards = ({ title, roles, variant = "emerging" }: RoleCardsProps) => {
  return (
    <div className="space-y-6">
      <h4 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h4>
      
      <div className="space-y-3">
        {roles.map((role, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: variant === "emerging" ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
            className={cn(
              "p-4 rounded-xl border transition-all",
              variant === "emerging" 
                ? "border-primary/20 bg-primary/5 hover:bg-primary/10" 
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            <h5 className={cn(
              "font-medium mb-1",
              variant === "emerging" ? "text-primary" : "text-foreground"
            )}>
              {role.title}
            </h5>
            <p className="text-sm text-muted-foreground">
              {role.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoleCards;
