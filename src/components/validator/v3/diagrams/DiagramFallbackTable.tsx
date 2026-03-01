/**
 * DiagramFallbackTable -- Renders arbitrary diagram data as a readable key-value table.
 * Used as the fallback when a diagram component fails to render or data shape is unexpected.
 * Recursively handles nested objects, arrays, and primitive values.
 */
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface DiagramFallbackTableProps {
  data: unknown;
  dimensionId?: string;
}

/** Format a raw object key into a human-readable label */
function formatKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
    .replace(/[_-]/g, ' ')                // snake_case / kebab-case -> spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letters
}

/** Format a primitive value for display */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    // Format large numbers with locale separators, keep decimals reasonable
    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return String(value);
}

/** Check if a value is a plain object (not null, not array) */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Recursively render a data node */
function DataNode({ value, depth = 0 }: { value: unknown; depth?: number }) {
  // Primitives
  if (value === null || value === undefined || typeof value !== 'object') {
    return (
      <span className="text-sm text-foreground">{formatValue(value)}</span>
    );
  }

  // Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-sm text-muted-foreground italic">Empty list</span>;
    }

    // If every element is a primitive, render as a compact inline list
    const allPrimitive = value.every(
      (v) => v === null || v === undefined || typeof v !== 'object',
    );
    if (allPrimitive) {
      return (
        <div className="space-y-0.5">
          {value.map((item, i) => (
            <div key={i} className="flex items-baseline gap-2 text-sm">
              <span className="text-muted-foreground tabular-nums text-xs w-5 text-right shrink-0">
                {i + 1}.
              </span>
              <span className="text-foreground">{formatValue(item)}</span>
            </div>
          ))}
        </div>
      );
    }

    // Complex array items -- render each as a nested block
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div
            key={i}
            className={cn(
              'rounded-md border border-border/60 p-2.5',
              depth > 0 && 'bg-muted/30',
            )}
          >
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
              #{i + 1}
            </span>
            <DataNode value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  // Objects
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) {
    return <span className="text-sm text-muted-foreground italic">Empty</span>;
  }

  return (
    <div className="space-y-1.5">
      {entries.map(([key, val]) => {
        const isComplex = isPlainObject(val) || (Array.isArray(val) && val.length > 0);

        return (
          <div key={key} className={cn(isComplex ? 'space-y-1' : 'flex items-baseline gap-2')}>
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              {formatKey(key)}
              {!isComplex && ':'}
            </span>
            {isComplex ? (
              <div className={cn('pl-3 border-l-2 border-border/50', depth > 1 && 'ml-1')}>
                <DataNode value={val} depth={depth + 1} />
              </div>
            ) : (
              <DataNode value={val} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DiagramFallbackTable({ data, dimensionId }: DiagramFallbackTableProps) {
  // Null / undefined guard
  if (data === null || data === undefined) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Diagram data unavailable
          </p>
          {dimensionId && (
            <p className="text-xs text-muted-foreground/70">
              Dimension: {formatKey(dimensionId)}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">
            Raw data{dimensionId ? ` -- ${formatKey(dimensionId)}` : ''}
          </span>
        </div>
        <DataNode value={data} />
      </CardContent>
    </Card>
  );
}
