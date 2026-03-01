/**
 * PainChain — Causal flow diagram from trigger to business cost.
 * Renders nodes as color-coded cards in a horizontal flow connected by arrows.
 * Node types: trigger (blue) -> symptom (amber) -> consequence (orange) -> cost (red).
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { PainChainData, PainChainNode } from '@/types/v3-report';

interface PainChainProps {
  data: PainChainData;
  color?: string;
}

const NODE_STYLES: Record<PainChainNode['type'], { bg: string; border: string; badge: string; label: string }> = {
  trigger: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-300 dark:border-blue-700',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    label: 'Trigger',
  },
  symptom: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-300 dark:border-amber-700',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    label: 'Symptom',
  },
  consequence: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-300 dark:border-orange-700',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    label: 'Consequence',
  },
  cost: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-300 dark:border-red-700',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    label: 'Cost',
  },
};

/** Order nodes by following edges from roots to leaves */
function orderNodes(nodes: PainChainNode[], edges: PainChainData['edges']): PainChainNode[] {
  if (edges.length === 0) return nodes;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const childrenOf = new Map<string, string[]>();
  const hasIncoming = new Set<string>();

  for (const edge of edges) {
    const children = childrenOf.get(edge.from) ?? [];
    children.push(edge.to);
    childrenOf.set(edge.from, children);
    hasIncoming.add(edge.to);
  }

  // Find root nodes (no incoming edges)
  const roots = nodes.filter((n) => !hasIncoming.has(n.id));
  if (roots.length === 0) return nodes;

  // BFS to produce ordered list
  const ordered: PainChainNode[] = [];
  const visited = new Set<string>();
  const queue = [...roots];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    ordered.push(current);

    const children = childrenOf.get(current.id) ?? [];
    for (const childId of children) {
      const child = nodeMap.get(childId);
      if (child && !visited.has(childId)) {
        queue.push(child);
      }
    }
  }

  // Append any disconnected nodes
  for (const n of nodes) {
    if (!visited.has(n.id)) ordered.push(n);
  }

  return ordered;
}

/** Find the edge label between two adjacent ordered nodes */
function getEdgeLabel(
  fromId: string,
  toId: string,
  edges: PainChainData['edges'],
): string | undefined {
  return edges.find((e) => e.from === fromId && e.to === toId)?.label;
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      Not enough data to display pain chain
    </div>
  );
}

export const PainChain = memo(function PainChain({ data, color }: PainChainProps) {
  if (!data?.nodes || data.nodes.length < 2) {
    return <EmptyState />;
  }

  const ordered = orderNodes(data.nodes, data.edges ?? []);

  return (
    <div className="w-full overflow-x-auto">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: color ?? '#3B82F6' }}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pain Chain
        </span>
      </div>

      {/* Horizontal flow — stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 min-w-0">
        {ordered.map((node, idx) => {
          const style = NODE_STYLES[node.type] ?? NODE_STYLES.trigger;
          const edgeLabel =
            idx < ordered.length - 1
              ? getEdgeLabel(node.id, ordered[idx + 1].id, data.edges ?? [])
              : undefined;

          return (
            <div
              key={node.id}
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 min-w-0"
            >
              {/* Node card */}
              <div
                className={cn(
                  'rounded-xl border px-4 py-3 min-w-[140px] max-w-[200px] shrink-0',
                  style.bg,
                  style.border,
                )}
              >
                <span
                  className={cn(
                    'inline-block text-[10px] font-bold uppercase tracking-wide rounded-md px-1.5 py-0.5 mb-1.5',
                    style.badge,
                  )}
                >
                  {style.label}
                </span>
                <p className="text-sm font-medium text-foreground leading-tight">
                  {node.label}
                </p>
              </div>

              {/* Arrow connector between nodes */}
              {idx < ordered.length - 1 && (
                <div className="flex flex-col sm:flex-row items-center gap-0.5 px-1 shrink-0">
                  {/* Vertical arrow on mobile, horizontal on desktop */}
                  <div className="hidden sm:flex items-center text-muted-foreground/60">
                    <div className="w-4 h-px bg-current" />
                    <svg
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M1 1L6 6L1 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex sm:hidden items-center text-muted-foreground/60">
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {edgeLabel && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {edgeLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border/50">
        {(['trigger', 'symptom', 'consequence', 'cost'] as const).map((type) => {
          const style = NODE_STYLES[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <div className={cn('w-2.5 h-2.5 rounded-sm', style.badge.split(' ')[0])} />
              <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
