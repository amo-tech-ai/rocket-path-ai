/**
 * useReportLeanCanvas — Maps report dimension data to 9 lean canvas blocks
 *
 * Client-side mapping: extracts content from ReportDetailsV2/V3 structured data
 * and maps it to the 9 standard lean canvas blocks with source attribution
 * and confidence indicators.
 *
 * MVP-07: AI Lean Canvas Report Page
 */

import { useMemo } from 'react';
import type { ReportDetailsV2 } from '@/types/validation-report';
import type { DimensionId, DimensionPageData, V3ReportDetails } from '@/types/v3-report';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CanvasConfidence = 'high' | 'medium' | 'low';

export interface CanvasBlockData {
  /** Block number (1-9) */
  number: number;
  /** Block title for display */
  title: string;
  /** Auto-generated content from report data */
  content: string;
  /** Primary source dimension for attribution badge */
  sourceDimension: DimensionId | null;
  /** Secondary source dimension (for blocks that combine 2 dimensions) */
  secondaryDimension?: DimensionId;
  /** Confidence level based on data completeness */
  confidence: CanvasConfidence;
}

export interface ReportLeanCanvasResult {
  /** True when at least 1 block has content */
  hasData: boolean;
  /** True when report has V3 dimension data */
  hasV3Dimensions: boolean;
  /** The 9 canvas blocks in display order */
  blocks: CanvasBlockData[];
}

// ---------------------------------------------------------------------------
// Block configuration — maps canvas blocks to report dimensions
// ---------------------------------------------------------------------------

interface BlockConfig {
  number: number;
  title: string;
  sourceDimension: DimensionId;
  secondaryDimension?: DimensionId;
  /** Extracts content from V2 report details */
  extractV2: (d: ReportDetailsV2) => string | null;
  /** Extracts content from V3 dimension data */
  extractV3: (dims: Partial<Record<DimensionId, DimensionPageData>>) => string | null;
  /** Placeholder when no data is available */
  placeholder: string;
}

function prefixBullets(items: string[]): string {
  const clean = items.filter(Boolean);
  return clean.length > 0 ? `• ${clean.join('\n• ')}` : '';
}

const BLOCK_CONFIG: BlockConfig[] = [
  // 1. Core Problem — from Problem Fit
  {
    number: 1,
    title: 'Core Problem',
    sourceDimension: 'problem',
    extractV2: (d) => {
      const pc = d.problem_clarity;
      if (typeof pc === 'string') return pc || null;
      if (pc && typeof pc === 'object') {
        const parts: string[] = [];
        if (pc.who && pc.pain) parts.push(`${pc.who} — ${pc.pain}`);
        else if (pc.pain) parts.push(pc.pain);
        const currentFix = pc.current_fix || (pc as Record<string, unknown>).currentFix;
        if (currentFix) parts.push(`Current fix: ${currentFix}`);
        if (pc.severity) parts.push(`Severity: ${pc.severity}`);
        return parts.length > 0 ? parts.join('\n') : null;
      }
      return null;
    },
    extractV3: (dims) => {
      const dim = dims.problem;
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.summary) parts.push(dim.summary);
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Problem Fit dimension to populate this block',
  },
  // 2. Customer Segments — from Target Customer
  {
    number: 2,
    title: 'Customer Segments',
    sourceDimension: 'customer',
    extractV2: (d) => {
      const cu = d.customer_use_case;
      if (typeof cu === 'string') return cu || null;
      if (cu && typeof cu === 'object') {
        const parts: string[] = [];
        if (cu.persona) {
          // persona can be { name, role, context } or a string
          if (typeof cu.persona === 'string') {
            parts.push(`Primary: ${cu.persona}`);
          } else if (typeof cu.persona === 'object') {
            const p = cu.persona as { name?: string; role?: string; context?: string };
            const desc = [p.name, p.role, p.context].filter(Boolean).join(' — ');
            if (desc) parts.push(`Primary: ${desc}`);
          }
        }
        if (cu.without) parts.push(`Without: ${cu.without}`);
        if (cu.with) parts.push(`With: ${cu.with}`);
        const timeSaved = cu.time_saved || (cu as Record<string, unknown>).timeSaved;
        if (timeSaved) parts.push(`Time saved: ${timeSaved}`);
        return parts.length > 0 ? parts.join('\n') : null;
      }
      return null;
    },
    extractV3: (dims) => {
      const dim = dims.customer;
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.diagram?.type === 'icp-funnel' && dim.diagram.data.tiers?.length > 0) {
        const tiers = dim.diagram.data.tiers;
        parts.push(tiers.map(t => `${t.label}: ${t.count}`).join('\n'));
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Target Customer dimension to populate this block',
  },
  // 3. Value Proposition — from Problem Fit + Revenue Model
  {
    number: 3,
    title: 'Value Proposition',
    sourceDimension: 'problem',
    secondaryDimension: 'revenue',
    extractV2: (d) => {
      const parts: string[] = [];
      const pc = d.problem_clarity;
      if (typeof pc === 'object' && pc) {
        const pcRecord = pc as Record<string, unknown>;
        if (pcRecord.with) parts.push(String(pcRecord.with));
      }
      const cu = d.customer_use_case;
      if (typeof cu === 'object' && cu) {
        if (cu.with) parts.push(`With solution: ${cu.with}`);
        if (cu.without) parts.push(`Without: ${cu.without}`);
      }
      if (d.revenue_model?.recommended_model) {
        parts.push(`Model: ${d.revenue_model.recommended_model}`);
      }
      return parts.length > 0 ? parts.join('\n') : null;
    },
    extractV3: (dims) => {
      const parts: string[] = [];
      if (dims.problem?.headline) parts.push(dims.problem.headline);
      if (dims.revenue?.headline) parts.push(dims.revenue.headline);
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete Problem Fit and Revenue Model dimensions to populate this block',
  },
  // 4. AI Solution — from Tech & AI Advantage
  {
    number: 4,
    title: 'AI Solution',
    sourceDimension: 'ai-strategy',
    extractV2: (d) => {
      const tech = d.technology_stack;
      if (!tech) return null;
      const parts: string[] = [];
      const techRecord = tech as Record<string, unknown>;
      if (techRecord.recommended_stack) parts.push(`Stack: ${techRecord.recommended_stack}`);
      if (Array.isArray(techRecord.ai_capabilities) && techRecord.ai_capabilities.length > 0) {
        parts.push(prefixBullets(techRecord.ai_capabilities as string[]));
      }
      return parts.length > 0 ? parts.join('\n') : null;
    },
    extractV3: (dims) => {
      const dim = dims['ai-strategy'];
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.diagram?.type === 'capability-stack') {
        const layers = dim.diagram.data.layers;
        if (layers?.length > 0) {
          parts.push(layers.map(l => `${l.name}: ${l.description}`).join('\n'));
        }
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Tech & AI Advantage dimension to populate this block',
  },
  // 5. Unique Advantage — from Competitive Edge
  {
    number: 5,
    title: 'Unique Advantage',
    sourceDimension: 'competition',
    extractV2: (d) => {
      const comp = d.competition;
      if (!comp) return null;
      const parts: string[] = [];
      if (comp.market_gaps?.length) {
        parts.push(`Market gaps:\n${prefixBullets(comp.market_gaps)}`);
      }
      if (comp.positioning?.description) {
        parts.push(comp.positioning.description);
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    extractV3: (dims) => {
      const dim = dims.competition;
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.summary) parts.push(dim.summary);
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Competitive Edge dimension to populate this block',
  },
  // 6. Revenue Model — from Revenue Model
  {
    number: 6,
    title: 'Revenue Model',
    sourceDimension: 'revenue',
    extractV2: (d) => {
      const rm = d.revenue_model;
      if (!rm) return null;
      const parts: string[] = [];
      if (rm.recommended_model) parts.push(`Model: ${rm.recommended_model}`);
      if (rm.reasoning) parts.push(rm.reasoning);
      const ue = rm.unit_economics;
      if (ue) {
        const metrics: string[] = [];
        if (ue.cac) metrics.push(`CAC: $${ue.cac}`);
        if (ue.ltv) metrics.push(`LTV: $${ue.ltv}`);
        if (ue.ltv_cac_ratio) metrics.push(`LTV:CAC: ${ue.ltv_cac_ratio.toFixed(1)}x`);
        if (ue.payback_months) metrics.push(`Payback: ${ue.payback_months}mo`);
        if (metrics.length > 0) parts.push(metrics.join(' | '));
      }
      return parts.length > 0 ? parts.join('\n') : null;
    },
    extractV3: (dims) => {
      const dim = dims.revenue;
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.diagram?.type === 'revenue-engine') {
        const eng = dim.diagram.data;
        if (eng.model) parts.push(`Model: ${eng.model}`);
        if (eng.unitEconomics) {
          const ue = eng.unitEconomics;
          parts.push(`CAC: $${ue.cac} | LTV: $${ue.ltv} | Ratio: ${ue.ltvCacRatio.toFixed(1)}x`);
        }
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Revenue Model dimension to populate this block',
  },
  // 7. Cost Structure — from Founder Execution
  {
    number: 7,
    title: 'Cost Structure',
    sourceDimension: 'execution',
    extractV2: (d) => {
      const th = d.team_hiring;
      if (!th) return null;
      const parts: string[] = [];
      if (th.monthly_burn) parts.push(`Monthly burn: $${th.monthly_burn.toLocaleString()}`);
      if (th.mvp_roles?.length > 0) {
        parts.push(`Key roles:\n${prefixBullets(th.mvp_roles.map(r => `${r.role}: $${(r.monthly_cost || 0).toLocaleString()}/mo`))}`);
      }
      if (th.current_gaps?.length > 0) {
        parts.push(`Gaps: ${th.current_gaps.join(', ')}`);
      }
      return parts.length > 0 ? parts.join('\n') : null;
    },
    extractV3: (dims) => {
      const dim = dims.execution;
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.summary) parts.push(dim.summary);
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Founder Execution dimension to populate this block',
  },
  // 8. Key Metrics — from Revenue Model + Traction
  {
    number: 8,
    title: 'Key Metrics',
    sourceDimension: 'revenue',
    secondaryDimension: 'traction',
    extractV2: (d) => {
      const parts: string[] = [];
      const ue = d.revenue_model?.unit_economics;
      if (ue) {
        if (ue.ltv_cac_ratio) parts.push(`LTV:CAC Ratio: ${ue.ltv_cac_ratio.toFixed(1)}x`);
        if (ue.payback_months) parts.push(`Payback period: ${ue.payback_months} months`);
      }
      if (d.financial_projections?.break_even?.months) {
        parts.push(`Break-even: ${d.financial_projections.break_even.months} months`);
      }
      return parts.length > 0 ? parts.join('\n') : null;
    },
    extractV3: (dims) => {
      const parts: string[] = [];
      if (dims.revenue?.headline) parts.push(dims.revenue.headline);
      if (dims.traction?.headline) parts.push(dims.traction.headline);
      if (dims.traction?.diagram?.type === 'evidence-funnel') {
        const tier = dims.traction.diagram.data.tiers?.[0];
        if (tier?.items?.length > 0) {
          parts.push(tier.items.map(i => `${i.claim}: ${i.evidence}`).slice(0, 3).join('\n'));
        }
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete Revenue Model and Traction dimensions to populate this block',
  },
  // 9. Distribution & GTM — from Market Opportunity
  {
    number: 9,
    title: 'Distribution & GTM',
    sourceDimension: 'market',
    extractV2: (d) => {
      const parts: string[] = [];
      if (d.market_sizing) {
        const ms = d.market_sizing;
        const metrics: string[] = [];
        if (ms.tam) metrics.push(`TAM: $${formatCompact(ms.tam)}`);
        if (ms.sam) metrics.push(`SAM: $${formatCompact(ms.sam)}`);
        if (ms.som) metrics.push(`SOM: $${formatCompact(ms.som)}`);
        if (metrics.length > 0) parts.push(metrics.join(' | '));
      }
      // Next steps often contain GTM insights
      if (d.next_steps?.length > 0) {
        const steps = Array.isArray(d.next_steps)
          ? d.next_steps.slice(0, 2).map((s: string | { action: string }) => typeof s === 'string' ? s : s.action)
          : [];
        if (steps.filter(Boolean).length > 0) {
          parts.push(`Next steps:\n${prefixBullets(steps.filter(Boolean))}`);
        }
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    extractV3: (dims) => {
      const dim = dims.market;
      if (!dim) return null;
      const parts: string[] = [];
      if (dim.headline) parts.push(dim.headline);
      if (dim.diagram?.type === 'tam-pyramid') {
        const p = dim.diagram.data;
        const metrics: string[] = [];
        if (p.tam) metrics.push(`TAM: ${p.tam.label}`);
        if (p.sam) metrics.push(`SAM: ${p.sam.label}`);
        if (p.som) metrics.push(`SOM: ${p.som.label}`);
        if (metrics.length > 0) parts.push(metrics.join(' | '));
      }
      return parts.length > 0 ? parts.join('\n\n') : null;
    },
    placeholder: 'Complete the Market Opportunity dimension to populate this block',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCompact(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

function getConfidence(content: string | null, isPrimary: boolean): CanvasConfidence {
  if (!content) return 'low';
  if (isPrimary && content.length > 40) return 'high';
  if (content.length > 20) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useReportLeanCanvas(details: ReportDetailsV2 | null | undefined): ReportLeanCanvasResult {
  return useMemo(() => {
    if (!details) {
      return {
        hasData: false,
        hasV3Dimensions: false,
        blocks: BLOCK_CONFIG.map(cfg => ({
          number: cfg.number,
          title: cfg.title,
          content: '',
          sourceDimension: cfg.sourceDimension,
          secondaryDimension: cfg.secondaryDimension,
          confidence: 'low' as CanvasConfidence,
        })),
      };
    }

    // Check for V3 dimensions
    const dims = (details as V3ReportDetails).dimensions as Partial<Record<DimensionId, DimensionPageData>> | undefined;
    const hasV3 = !!(dims && typeof dims === 'object' && Object.keys(dims).length > 0);

    const blocks: CanvasBlockData[] = BLOCK_CONFIG.map(cfg => {
      // Try V3 extraction first, fall back to V2
      let content: string | null = null;
      let isPrimarySource = true;

      if (hasV3 && dims) {
        content = cfg.extractV3(dims);
        isPrimarySource = !!dims[cfg.sourceDimension];
      }

      if (!content) {
        content = cfg.extractV2(details);
        // V2 extraction is less direct, so confidence drops
        isPrimarySource = false;
      }

      return {
        number: cfg.number,
        title: cfg.title,
        content: content || '',
        sourceDimension: cfg.sourceDimension,
        secondaryDimension: cfg.secondaryDimension,
        confidence: getConfidence(content, isPrimarySource),
      };
    });

    const hasData = blocks.some(b => b.content.length > 0);

    return { hasData, hasV3Dimensions: hasV3, blocks };
  }, [details]);
}
