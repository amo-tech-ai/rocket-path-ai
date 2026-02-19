/**
 * Validation Report PDF Export
 * Programmatically builds a full validation report PDF using createEnhancedPDF
 */

import { createEnhancedPDF, type PDFColors } from './pdfExportEnhanced';
import {
  formatMarketSize,
  formatCurrency,
  type TechnologyAssessment,
  type RevenueModelAssessment,
  type TeamAssessment,
  type KeyQuestion,
  type ResourceCategory,
  type ScoresMatrixData,
  type SWOT,
  type FeatureComparison,
  type FinancialProjections,
} from '@/types/validation-report';
import type jsPDF from 'jspdf';

// Mirror the ReportData.details shape from ValidatorReport.tsx
interface ReportDetails {
  highlights?: string[];
  red_flags?: string[];
  summary_verdict: string;
  problem_clarity: string;
  customer_use_case: string;
  market_sizing: { tam: number; sam: number; som: number; citations: string[] };
  competition: {
    competitors: Array<{ name: string; description: string; threat_level: string }>;
    citations: string[];
    swot?: SWOT;
    feature_comparison?: FeatureComparison;
    positioning?: { x_axis: string; y_axis: string; positions: Array<{ name: string; x: number; y: number; is_founder: boolean }> };
  };
  risks_assumptions: string[];
  mvp_scope: string;
  next_steps: string[];
  dimension_scores?: Record<string, number>;
  market_factors?: Array<{ name: string; score: number; description: string; status: string }>;
  execution_factors?: Array<{ name: string; score: number; description: string; status: string }>;
  technology_stack?: TechnologyAssessment;
  revenue_model?: RevenueModelAssessment;
  team_hiring?: TeamAssessment;
  key_questions?: KeyQuestion[];
  resources_links?: ResourceCategory[];
  scores_matrix?: ScoresMatrixData;
  financial_projections?: FinancialProjections;
}

interface ReportInput {
  score: number;
  summary: string;
  verified: boolean;
  details: ReportDetails;
  created_at: string;
}

// ─── Inline helpers ──────────────────────────────────────────

function addTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  x: number,
  y: number,
  colWidths: number[],
  colors: PDFColors,
): number {
  const rowHeight = 28;
  const fontSize = 11;

  // Header row
  doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  doc.rect(x, y, totalWidth, rowHeight, 'F');

  doc.setFontSize(fontSize);
  doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
  let cx = x;
  headers.forEach((h, i) => {
    doc.text(h, cx + 8, y + 18);
    cx += colWidths[i];
  });
  y += rowHeight;

  // Data rows
  doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
  rows.forEach((row, ri) => {
    if (ri % 2 === 1) {
      doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
      doc.rect(x, y, totalWidth, rowHeight, 'F');
    }
    cx = x;
    row.forEach((cell, ci) => {
      const truncated = cell.length > 40 ? cell.slice(0, 37) + '...' : cell;
      doc.text(truncated, cx + 8, y + 18);
      cx += colWidths[ci];
    });
    y += rowHeight;
  });

  return y + 10;
}

function addSwotGrid(
  doc: jsPDF,
  swot: SWOT,
  x: number,
  y: number,
  gridWidth: number,
  colors: PDFColors,
): number {
  const cellW = gridWidth / 2 - 5;
  const cellPad = 12;
  const lineH = 16;
  const fontSize = 10;
  const headerSize = 11;

  const quadrants: { key: keyof SWOT; label: string; color: { r: number; g: number; b: number } }[] = [
    { key: 'strengths', label: 'STRENGTHS', color: { r: 16, g: 185, b: 129 } },
    { key: 'weaknesses', label: 'WEAKNESSES', color: { r: 239, g: 68, b: 68 } },
    { key: 'opportunities', label: 'OPPORTUNITIES', color: { r: 59, g: 130, b: 246 } },
    { key: 'threats', label: 'THREATS', color: { r: 245, g: 158, b: 11 } },
  ];

  let maxRowH = 0;

  for (let row = 0; row < 2; row++) {
    let rowH = 0;
    for (let col = 0; col < 2; col++) {
      const qi = row * 2 + col;
      const q = quadrants[qi];
      const items = (swot[q.key] || []).slice(0, 5);
      const cellH = 35 + items.length * lineH;
      if (cellH > rowH) rowH = cellH;

      const cx = x + col * (cellW + 10);
      const cy = y + maxRowH;

      // Cell background
      doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
      doc.roundedRect(cx, cy, cellW, cellH, 6, 6, 'F');

      // Label
      doc.setFontSize(headerSize);
      doc.setTextColor(q.color.r, q.color.g, q.color.b);
      doc.text(q.label, cx + cellPad, cy + 20);

      // Items
      doc.setFontSize(fontSize);
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      items.forEach((item, i) => {
        const truncated = item.length > 50 ? item.slice(0, 47) + '...' : item;
        doc.text(`• ${truncated}`, cx + cellPad, cy + 35 + i * lineH);
      });
    }
    maxRowH += rowH + 10;
  }

  return y + maxRowH;
}

function addScoreBar(
  doc: jsPDF,
  label: string,
  score: number,
  x: number,
  y: number,
  barWidth: number,
  colors: PDFColors,
  weight?: number,
): number {
  const barH = 12;
  const labelW = 130;

  // Label
  doc.setFontSize(11);
  doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
  doc.text(label, x, y + 10);

  // Background track
  const bx = x + labelW;
  doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
  doc.roundedRect(bx, y, barWidth, barH, 4, 4, 'F');

  // Fill
  const fillW = Math.max((score / 100) * barWidth, 4);
  if (score >= 70) {
    doc.setFillColor(16, 185, 129); // emerald
  } else if (score >= 40) {
    doc.setFillColor(245, 158, 11); // amber
  } else {
    doc.setFillColor(239, 68, 68); // red
  }
  doc.roundedRect(bx, y, fillW, barH, 4, 4, 'F');

  // Score value
  doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
  doc.setFontSize(11);
  doc.text(String(score), bx + barWidth + 10, y + 10);

  // Weight
  if (weight !== undefined) {
    doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
    doc.text(`${weight}%`, bx + barWidth + 40, y + 10);
  }

  return y + barH + 14;
}

// ─── Section number badge ────────────────────────────────────

function addSectionHeader(
  doc: jsPDF,
  num: number,
  title: string,
  x: number,
  y: number,
  colors: PDFColors,
): number {
  // Circle badge
  doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.circle(x + 12, y + 6, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(String(num), x + 12, y + 10, { align: 'center' });

  // Title
  doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
  doc.setFontSize(22);
  doc.text(title, x + 30, y + 12);

  return y + 35;
}

// ─── Main export function ────────────────────────────────────

export async function exportValidationReportPDF(
  report: ReportInput,
  companyName?: string,
): Promise<void> {
  const pdf = createEnhancedPDF({
    theme: 'light',
    orientation: 'portrait',
    quality: 'standard',
    companyName: companyName || 'StartupAI',
    includeDate: true,
  });

  const { doc, colors, dimensions } = pdf;
  const { width, height } = dimensions;
  const margin = width * 0.05;
  const contentWidth = width - margin * 2;
  const details = report.details;

  // Track pages for footer numbering
  let totalPages = 1;

  const verdictLabel = report.score >= 75 ? 'GO' : report.score >= 50 ? 'CAUTION' : 'NO-GO';

  // Helper: check overflow and add new page if needed
  function ensureSpace(neededY: number) {
    if (pdf.getCurrentY() + neededY > height - 80) {
      pdf.addContentPage();
      totalPages++;
      return true;
    }
    return false;
  }

  // ─── Page 1: Cover ───────────────────────────────────────

  pdf.addCoverPage(
    companyName ? `${companyName} — Validation Report` : 'Validation Report',
    `${verdictLabel} — Score: ${report.score}/100`,
  );
  totalPages++;

  // ─── Page 2: Executive Summary ───────────────────────────

  pdf.addContentPage();
  let y = pdf.getCurrentY();

  y = addSectionHeader(doc, 0, 'Executive Summary', margin, y, colors);
  pdf.setCurrentY(y);

  // Score badge
  pdf.addMetricsCard('Overall Score', `${report.score}/100`, margin, y, 180);
  pdf.addMetricsCard('Verdict', verdictLabel, margin + 200, y, 180);
  pdf.addMetricsCard('Verified', report.verified ? 'Yes' : 'No', margin + 400, y, 180);
  y += 100;
  pdf.setCurrentY(y);

  // Summary verdict
  if (details.summary_verdict) {
    y = pdf.addParagraph(details.summary_verdict, margin, y);
    y += 10;
  }

  // Summary text
  if (report.summary) {
    y = pdf.addParagraph(report.summary, margin, y);
    y += 15;
  }

  // Highlights
  if (details.highlights?.length) {
    pdf.setCurrentY(y);
    pdf.addSubheader('Strengths');
    y = pdf.getCurrentY();
    y = pdf.addBulletList(details.highlights, margin + 20, y);
  }

  // Red flags
  if (details.red_flags?.length) {
    ensureSpace(details.red_flags.length * 40 + 40);
    y = pdf.getCurrentY();
    pdf.setCurrentY(y);
    pdf.addSubheader('Concerns');
    y = pdf.getCurrentY();
    y = pdf.addBulletList(details.red_flags, margin + 20, y);
  }

  // Next steps summary
  if (details.next_steps?.length) {
    ensureSpace(details.next_steps.length * 40 + 40);
    y = pdf.getCurrentY();
    pdf.setCurrentY(y);
    pdf.addSubheader('Recommended Next Steps');
    y = pdf.getCurrentY();
    y = pdf.addBulletList(details.next_steps.slice(0, 5), margin + 20, y);
  }

  pdf.setCurrentY(y);
  totalPages++;

  // ─── Section 1: Problem Clarity ──────────────────────────

  pdf.addContentPage();
  y = pdf.getCurrentY();
  y = addSectionHeader(doc, 1, 'Problem Clarity', margin, y, colors);
  pdf.setCurrentY(y);

  if (details.problem_clarity) {
    y = pdf.addParagraph(details.problem_clarity, margin, y);
    pdf.setCurrentY(y + 15);
  }

  // ─── Section 2: Customer Use Case ────────────────────────

  ensureSpace(120);
  y = pdf.getCurrentY();
  y = addSectionHeader(doc, 2, 'Customer Use Case', margin, y, colors);
  pdf.setCurrentY(y);

  if (details.customer_use_case) {
    y = pdf.addParagraph(details.customer_use_case, margin, y);
    pdf.setCurrentY(y + 15);
  }
  totalPages++;

  // ─── Section 3: Market Sizing ────────────────────────────

  ensureSpace(180);
  y = pdf.getCurrentY();
  if (y > height - 250) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
  }
  y = addSectionHeader(doc, 3, 'Market Sizing', margin, y, colors);
  pdf.setCurrentY(y);

  const ms = details.market_sizing;
  if (ms) {
    const cardW = (contentWidth - 40) / 3;
    pdf.addMetricsCard('TAM', formatMarketSize(ms.tam || 0), margin, y, cardW);
    pdf.addMetricsCard('SAM', formatMarketSize(ms.sam || 0), margin + cardW + 20, y, cardW);
    pdf.addMetricsCard('SOM', formatMarketSize(ms.som || 0), margin + (cardW + 20) * 2, y, cardW);
    y += 100;

    if (ms.citations?.length) {
      doc.setFontSize(9);
      doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
      ms.citations.slice(0, 3).forEach((c) => {
        const truncated = c.length > 80 ? c.slice(0, 77) + '...' : c;
        doc.text(`Source: ${truncated}`, margin, y);
        y += 14;
      });
    }
    pdf.setCurrentY(y + 10);
  }

  // ─── Section 4: Competition ──────────────────────────────

  pdf.addContentPage();
  totalPages++;
  y = pdf.getCurrentY();
  y = addSectionHeader(doc, 4, 'Competition Deep Dive', margin, y, colors);
  pdf.setCurrentY(y);

  const comp = details.competition;
  if (comp?.competitors?.length) {
    // Competitors table
    const headers = ['Competitor', 'Description', 'Threat'];
    const rows = comp.competitors.map(c => [c.name, c.description, c.threat_level]);
    const colWidths = [contentWidth * 0.2, contentWidth * 0.6, contentWidth * 0.2];
    y = addTable(doc, headers, rows, margin, y, colWidths, colors);
    pdf.setCurrentY(y);
  }

  // SWOT
  if (comp?.swot) {
    ensureSpace(250);
    y = pdf.getCurrentY();
    pdf.setCurrentY(y);
    pdf.addSubheader('SWOT Analysis');
    y = pdf.getCurrentY();
    y = addSwotGrid(doc, comp.swot, margin, y, contentWidth, colors);
    pdf.setCurrentY(y + 10);
  }

  // Feature comparison
  if (comp?.feature_comparison?.features?.length && comp.feature_comparison.competitors?.length) {
    ensureSpace(200);
    y = pdf.getCurrentY();
    if (y > height - 200) {
      pdf.addContentPage();
      totalPages++;
      y = pdf.getCurrentY();
    }
    pdf.setCurrentY(y);
    pdf.addSubheader('Feature Comparison');
    y = pdf.getCurrentY();

    const fc = comp.feature_comparison;
    const fcHeaders = ['Feature', ...fc.competitors.map(c => c.name)];
    const fcColWidths = [contentWidth * 0.35];
    const compColW = (contentWidth * 0.65) / fc.competitors.length;
    fc.competitors.forEach(() => fcColWidths.push(compColW));

    const fcRows = fc.features.map((feat, fi) => {
      return [feat, ...fc.competitors.map(c => c.has_feature?.[fi] ? 'Yes' : 'No')];
    });
    y = addTable(doc, fcHeaders, fcRows, margin, y, fcColWidths, colors);
    pdf.setCurrentY(y);
  }

  // ─── Section 5: Risks & Assumptions ──────────────────────

  pdf.addContentPage();
  totalPages++;
  y = pdf.getCurrentY();
  y = addSectionHeader(doc, 5, 'Risks & Assumptions', margin, y, colors);
  pdf.setCurrentY(y);

  if (details.risks_assumptions?.length) {
    y = pdf.addBulletList(details.risks_assumptions, margin + 20, y);
    pdf.setCurrentY(y + 10);
  }

  // ─── Section 6: MVP Scope ────────────────────────────────

  ensureSpace(120);
  y = pdf.getCurrentY();
  y = addSectionHeader(doc, 6, 'MVP Scope', margin, y, colors);
  pdf.setCurrentY(y);

  if (details.mvp_scope) {
    y = pdf.addParagraph(details.mvp_scope, margin, y);
    pdf.setCurrentY(y + 15);
  }

  // ─── Section 7: Next Steps ───────────────────────────────

  ensureSpace(details.next_steps?.length ? details.next_steps.length * 40 + 60 : 120);
  y = pdf.getCurrentY();
  y = addSectionHeader(doc, 7, 'Next Steps', margin, y, colors);
  pdf.setCurrentY(y);

  if (details.next_steps?.length) {
    details.next_steps.forEach((step, i) => {
      ensureSpace(35);
      y = pdf.getCurrentY();
      doc.setFontSize(12);
      doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
      doc.text(`${i + 1}.`, margin, y + 5);
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const lines = doc.splitTextToSize(step, contentWidth - 30);
      doc.text(lines, margin + 25, y + 5);
      y += lines.length * 18 + 8;
      pdf.setCurrentY(y);
    });
  }

  // ─── Section 8: Scores Matrix ────────────────────────────

  if (details.scores_matrix || details.dimension_scores || details.market_factors || details.execution_factors) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 8, 'Scores Matrix', margin, y, colors);
    pdf.setCurrentY(y);

    if (details.scores_matrix) {
      // Overall weighted score
      pdf.addMetricsCard('Weighted Score', `${details.scores_matrix.overall_weighted}/100`, margin, y, 220);
      y += 100;
      pdf.setCurrentY(y);

      // Dimension bars
      if (details.scores_matrix.dimensions?.length) {
        const barW = contentWidth - 250;
        details.scores_matrix.dimensions.forEach((dim) => {
          ensureSpace(30);
          y = pdf.getCurrentY();
          y = addScoreBar(doc, dim.name, dim.score, margin, y, barW, colors, dim.weight);
          pdf.setCurrentY(y);
        });
      }
    }

    // Market factors
    if (details.market_factors?.length) {
      ensureSpace(60);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader('Market Factors');
      y = pdf.getCurrentY();

      details.market_factors.forEach((f) => {
        ensureSpace(40);
        y = pdf.getCurrentY();
        doc.setFontSize(11);
        doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
        doc.text(`${f.name}: ${f.score}`, margin, y + 5);
        doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(f.description, contentWidth - 100);
        doc.text(lines, margin + 200, y + 5);
        y += Math.max(lines.length * 16, 20) + 8;
        pdf.setCurrentY(y);
      });
    }

    // Execution factors
    if (details.execution_factors?.length) {
      ensureSpace(60);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader('Execution Factors');
      y = pdf.getCurrentY();

      details.execution_factors.forEach((f) => {
        ensureSpace(40);
        y = pdf.getCurrentY();
        doc.setFontSize(11);
        doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
        doc.text(`${f.name}: ${f.score}`, margin, y + 5);
        doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(f.description, contentWidth - 100);
        doc.text(lines, margin + 200, y + 5);
        y += Math.max(lines.length * 16, 20) + 8;
        pdf.setCurrentY(y);
      });
    }
  }

  // ─── Section 9: Technology Stack ─────────────────────────

  if (details.technology_stack) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 9, 'Technology Stack', margin, y, colors);
    pdf.setCurrentY(y);

    const ts = details.technology_stack;

    // Feasibility badge + timeline
    pdf.addMetricsCard('Feasibility', ts.feasibility.toUpperCase(), margin, y, 200);
    if (ts.mvp_timeline_weeks > 0) {
      pdf.addMetricsCard('MVP Timeline', `~${ts.mvp_timeline_weeks} weeks`, margin + 220, y, 200);
    }
    y += 100;
    pdf.setCurrentY(y);

    if (ts.feasibility_rationale) {
      y = pdf.addParagraph(ts.feasibility_rationale, margin, y);
      y += 10;
      pdf.setCurrentY(y);
    }

    // Stack components table
    if (ts.stack_components?.length) {
      pdf.addSubheader('Stack Components');
      y = pdf.getCurrentY();
      const headers = ['Component', 'Choice', 'Rationale'];
      const rows = ts.stack_components.map(c => [
        c.name,
        c.choice === 'open_source' ? 'Open Source' : c.choice === 'build' ? 'Build' : 'Buy',
        c.rationale,
      ]);
      y = addTable(doc, headers, rows, margin, y, [contentWidth * 0.2, contentWidth * 0.15, contentWidth * 0.65], colors);
      pdf.setCurrentY(y);
    }

    // Technical risks
    if (ts.technical_risks?.length) {
      ensureSpace(100);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader('Technical Risks');
      y = pdf.getCurrentY();
      const headers = ['Risk', 'Likelihood', 'Mitigation'];
      const rows = ts.technical_risks.map(r => [r.risk, r.likelihood, r.mitigation]);
      y = addTable(doc, headers, rows, margin, y, [contentWidth * 0.3, contentWidth * 0.15, contentWidth * 0.55], colors);
      pdf.setCurrentY(y);
    }
  }

  // ─── Section 10: Revenue Model ───────────────────────────

  if (details.revenue_model) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 10, 'Revenue Model', margin, y, colors);
    pdf.setCurrentY(y);

    const rm = details.revenue_model;

    // Recommended model
    doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.roundedRect(margin, y, contentWidth, 50, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`Recommended: ${rm.recommended_model}`, margin + 15, y + 22);
    if (rm.reasoning) {
      doc.setFontSize(10);
      const reasonLines = doc.splitTextToSize(rm.reasoning, contentWidth - 30);
      doc.text(reasonLines[0] || '', margin + 15, y + 40);
    }
    y += 65;
    pdf.setCurrentY(y);

    // Unit economics cards
    if (rm.unit_economics) {
      const ue = rm.unit_economics;
      const cardW = (contentWidth - 30) / 4;
      pdf.addMetricsCard('CAC', formatCurrency(ue.cac), margin, y, cardW);
      pdf.addMetricsCard('LTV', formatCurrency(ue.ltv), margin + cardW + 10, y, cardW);
      pdf.addMetricsCard('LTV/CAC', `${ue.ltv_cac_ratio.toFixed(1)}x`, margin + (cardW + 10) * 2, y, cardW);
      pdf.addMetricsCard('Payback', `${ue.payback_months.toFixed(1)} mo`, margin + (cardW + 10) * 3, y, cardW);
      y += 100;
      pdf.setCurrentY(y);
    }

    // Alternatives
    if (rm.alternatives?.length) {
      pdf.addSubheader('Alternative Models');
      y = pdf.getCurrentY();
      rm.alternatives.forEach((alt) => {
        ensureSpace(80);
        y = pdf.getCurrentY();

        doc.setFontSize(13);
        doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
        doc.text(alt.model, margin, y + 5);
        y += 22;

        if (alt.pros?.length) {
          doc.setFontSize(10);
          doc.setTextColor(16, 185, 129);
          alt.pros.slice(0, 3).forEach(p => {
            doc.text(`+ ${p}`, margin + 10, y);
            y += 16;
          });
        }
        if (alt.cons?.length) {
          doc.setFontSize(10);
          doc.setTextColor(239, 68, 68);
          alt.cons.slice(0, 3).forEach(c => {
            doc.text(`- ${c}`, margin + 10, y);
            y += 16;
          });
        }
        y += 8;
        pdf.setCurrentY(y);
      });
    }
  }

  // ─── Section 11: Team & Hiring ───────────────────────────

  if (details.team_hiring) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 11, 'Team & Hiring', margin, y, colors);
    pdf.setCurrentY(y);

    const th = details.team_hiring;

    // Monthly burn
    if (th.monthly_burn > 0) {
      pdf.addMetricsCard('Monthly Burn', formatCurrency(th.monthly_burn), margin, y, 220);
      y += 100;
      pdf.setCurrentY(y);
    }

    // Current gaps
    if (th.current_gaps?.length) {
      pdf.addSubheader('Current Gaps');
      y = pdf.getCurrentY();
      y = pdf.addBulletList(th.current_gaps, margin + 20, y);
      pdf.setCurrentY(y);
    }

    // MVP roles table
    if (th.mvp_roles?.length) {
      ensureSpace(100);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader('MVP Roles');
      y = pdf.getCurrentY();

      const sorted = [...th.mvp_roles].sort((a, b) => a.priority - b.priority);
      const headers = ['#', 'Role', 'Rationale', 'Monthly Cost'];
      const rows = sorted.map(r => [
        String(r.priority),
        r.role,
        r.rationale,
        formatCurrency(r.monthly_cost) + '/mo',
      ]);
      y = addTable(doc, headers, rows, margin, y,
        [contentWidth * 0.06, contentWidth * 0.2, contentWidth * 0.54, contentWidth * 0.2],
        colors);
      pdf.setCurrentY(y);
    }

    // Advisory needs
    if (th.advisory_needs?.length) {
      ensureSpace(80);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader('Advisory Needs');
      y = pdf.getCurrentY();
      y = pdf.addBulletList(th.advisory_needs, margin + 20, y);
      pdf.setCurrentY(y);
    }
  }

  // ─── Section 12: Key Questions ───────────────────────────

  if (details.key_questions?.length) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 12, 'Key Questions', margin, y, colors);
    pdf.setCurrentY(y);

    const levels: Array<{ level: KeyQuestion['risk_level']; label: string; color: { r: number; g: number; b: number } }> = [
      { level: 'fatal', label: 'FATAL', color: { r: 239, g: 68, b: 68 } },
      { level: 'important', label: 'IMPORTANT', color: { r: 245, g: 158, b: 11 } },
      { level: 'minor', label: 'MINOR', color: { r: 16, g: 185, b: 129 } },
    ];

    levels.forEach(({ level, label, color }) => {
      const questions = details.key_questions!.filter(q => q.risk_level === level);
      if (!questions.length) return;

      ensureSpace(60);
      y = pdf.getCurrentY();

      // Risk level badge
      doc.setFillColor(color.r, color.g, color.b);
      doc.roundedRect(margin, y, 90, 22, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(label, margin + 45, y + 15, { align: 'center' });
      y += 32;

      questions.forEach((q) => {
        ensureSpace(70);
        y = pdf.getCurrentY() > y ? pdf.getCurrentY() : y;

        doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
        doc.roundedRect(margin, y, contentWidth, 60, 6, 6, 'F');

        doc.setFontSize(11);
        doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
        const qLines = doc.splitTextToSize(q.question, contentWidth - 20);
        doc.text(qLines[0] || '', margin + 10, y + 18);

        doc.setFontSize(9);
        doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
        const whyLines = doc.splitTextToSize(q.why_it_matters, contentWidth - 20);
        doc.text(whyLines[0] || '', margin + 10, y + 34);

        doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
        const valLines = doc.splitTextToSize(`Validate: ${q.validation_method}`, contentWidth - 20);
        doc.text(valLines[0] || '', margin + 10, y + 50);

        y += 70;
        pdf.setCurrentY(y);
      });
    });
  }

  // ─── Section 13: Resources & Links ───────────────────────

  if (details.resources_links?.length) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 13, 'Resources & Links', margin, y, colors);
    pdf.setCurrentY(y);

    details.resources_links.forEach((cat) => {
      ensureSpace(50);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader(cat.category);
      y = pdf.getCurrentY();

      cat.links?.forEach((link) => {
        ensureSpace(35);
        y = pdf.getCurrentY();

        doc.setFontSize(11);
        doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
        doc.text(link.title, margin + 10, y + 5);

        if (link.description) {
          doc.setFontSize(9);
          doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
          doc.text(link.description.slice(0, 80), margin + 10, y + 18);
        }

        // URL as text (not clickable in programmatic PDF but visible)
        doc.setFontSize(8);
        doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
        const urlTruncated = link.url.length > 70 ? link.url.slice(0, 67) + '...' : link.url;
        doc.text(urlTruncated, margin + 10, y + 28);

        y += 38;
        pdf.setCurrentY(y);
      });
    });
  }

  // ─── Section 14: Financial Projections ───────────────────

  if (details.financial_projections) {
    pdf.addContentPage();
    totalPages++;
    y = pdf.getCurrentY();
    y = addSectionHeader(doc, 14, 'Financial Projections', margin, y, colors);
    pdf.setCurrentY(y);

    const fp = details.financial_projections;

    // Key assumption
    if (fp.key_assumption) {
      doc.setFillColor(255, 251, 235); // amber-50 ish
      doc.roundedRect(margin, y, contentWidth, 40, 6, 6, 'F');
      doc.setFontSize(9);
      doc.setTextColor(245, 158, 11);
      doc.text('KEY ASSUMPTION', margin + 10, y + 14);
      doc.setFontSize(10);
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const kaLines = doc.splitTextToSize(fp.key_assumption, contentWidth - 20);
      doc.text(kaLines[0] || '', margin + 10, y + 30);
      y += 55;
      pdf.setCurrentY(y);
    }

    // Revenue scenarios table
    if (fp.scenarios?.length) {
      pdf.addSubheader('Revenue Scenarios');
      y = pdf.getCurrentY();

      const headers = ['Scenario', 'Year 1', 'Year 3', 'Year 5'];
      const rows = fp.scenarios.map(s => [
        s.name,
        formatCurrency(s.y1_revenue),
        formatCurrency(s.y3_revenue),
        formatCurrency(s.y5_revenue),
      ]);
      y = addTable(doc, headers, rows, margin, y,
        [contentWidth * 0.3, contentWidth * 0.23, contentWidth * 0.23, contentWidth * 0.24],
        colors);
      pdf.setCurrentY(y);

      // Scenario assumptions
      fp.scenarios.forEach((s) => {
        if (s.assumptions?.length) {
          ensureSpace(s.assumptions.length * 16 + 25);
          y = pdf.getCurrentY();
          doc.setFontSize(9);
          doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
          doc.text(`${s.name} assumptions:`, margin, y + 5);
          y += 18;
          s.assumptions.slice(0, 4).forEach(a => {
            doc.text(`• ${a.slice(0, 70)}`, margin + 10, y);
            y += 14;
          });
          y += 5;
          pdf.setCurrentY(y);
        }
      });
    }

    // Break-even
    if (fp.break_even) {
      ensureSpace(120);
      y = pdf.getCurrentY();
      pdf.setCurrentY(y);
      pdf.addSubheader('Break-Even Analysis');
      y = pdf.getCurrentY();

      const cardW = (contentWidth - 20) / 2;
      pdf.addMetricsCard('Timeline', `${fp.break_even.months} months`, margin, y, cardW);
      pdf.addMetricsCard('Revenue Required', `${formatCurrency(fp.break_even.revenue_required)}/mo`, margin + cardW + 20, y, cardW);
      y += 100;

      if (fp.break_even.assumptions) {
        doc.setFontSize(9);
        doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
        const lines = doc.splitTextToSize(`Assumes: ${fp.break_even.assumptions}`, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 14;
      }
      pdf.setCurrentY(y);
    }
  }

  // ─── Add page numbers on all pages ───────────────────────

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    pdf.addFooter(i, pageCount);
  }

  // ─── Save ────────────────────────────────────────────────

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `${(companyName || 'validation-report').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report-${dateStr}.pdf`;
  doc.save(filename);
}
