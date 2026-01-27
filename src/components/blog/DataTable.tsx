import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  headers: string[];
  rows: (string | { value: string; badge?: string; badgeVariant?: "default" | "measured" | "projected" | "high" | "medium" | "low" })[][];
  caption?: string;
  footnote?: string;
}

const DataTable = ({ headers, rows, caption, footnote }: DataTableProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getBadgeStyles = (variant?: string) => {
    switch (variant) {
      case "measured":
        return "bg-primary/10 text-primary border-0";
      case "projected":
        return "bg-amber-500/10 text-amber-600 border-0";
      case "high":
        return "bg-emerald-500/10 text-emerald-600 border-0";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-0";
      case "low":
        return "bg-muted text-muted-foreground border-0";
      default:
        return "bg-secondary text-secondary-foreground border-0";
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {caption && (
        <div className="px-6 py-4 border-b border-border">
          <h4 className="font-display text-lg font-medium text-foreground">{caption}</h4>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {headers.map((header, i) => (
                <TableHead 
                  key={i} 
                  className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground ${i === headers.length - 1 || typeof header === 'number' ? 'text-right' : ''}`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/20">
                {row.map((cell, cellIndex) => {
                  const isObject = typeof cell === 'object';
                  const value = isObject ? cell.value : cell;
                  const badge = isObject ? cell.badge : undefined;
                  const badgeVariant = isObject ? cell.badgeVariant : undefined;
                  
                  // Right-align numeric columns (detect by checking if value starts with number or currency)
                  const isNumeric = /^[€$£\d%+−-]/.test(value);
                  
                  return (
                    <TableCell 
                      key={cellIndex} 
                      className={`text-sm ${isNumeric ? 'text-right font-mono tabular-nums' : ''} ${cellIndex === 0 ? 'font-medium' : ''}`}
                    >
                      <div className={`flex items-center gap-2 ${isNumeric ? 'justify-end' : ''}`}>
                        <span>{value}</span>
                        {badge && (
                          <Badge className={`${getBadgeStyles(badgeVariant)} text-[10px]`}>
                            {badge}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {footnote && (
        <div className="px-6 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground italic">{footnote}</p>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;
