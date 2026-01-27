import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TableCell {
  value: string | number;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger";
  progress?: number;
  progressLabel?: string;
}

interface EnhancedDataTableProps {
  headers: string[];
  rows: (string | number | TableCell)[][];
  title?: string;
  subtitle?: string;
  caption?: string;
}

const EnhancedDataTable = ({ headers, rows, title, subtitle, caption }: EnhancedDataTableProps) => {
  const renderCell = (cell: string | number | TableCell, cellIndex: number) => {
    if (typeof cell === "string" || typeof cell === "number") {
      return <span>{cell}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {cell.badge && (
            <Badge 
              variant="outline"
              className={cn(
                "text-[10px] font-medium",
                cell.badgeVariant === "success" && "border-primary/30 bg-primary/10 text-primary",
                cell.badgeVariant === "warning" && "border-accent/30 bg-accent/10 text-accent-foreground",
                cell.badgeVariant === "danger" && "border-destructive/30 bg-destructive/10 text-destructive"
              )}
            >
              {cell.badge}
            </Badge>
          )}
          <span className={cn(
            cell.badge && "font-medium text-primary"
          )}>
            {cell.value}
          </span>
        </div>
        {cell.progress !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${cell.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            {cell.progressLabel && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {cell.progressLabel}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      {(title || subtitle) && (
        <div className="flex items-end justify-between">
          <div>
            {title && (
              <h4 className="font-display text-lg font-semibold text-foreground">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {caption && (
            <span className="text-xs text-muted-foreground">{caption}</span>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                className={cn(
                  "border-b border-border last:border-0 transition-colors hover:bg-muted/20",
                  rowIndex % 2 === 0 ? "bg-card" : "bg-card/50"
                )}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-4 text-sm text-foreground"
                  >
                    {renderCell(cell, cellIndex)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default EnhancedDataTable;
