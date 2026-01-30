/**
 * Enhanced PDF Export Utilities
 * Professional, polished PDF generation for documents
 */

import jsPDF from 'jspdf';

export interface EnhancedPDFOptions {
  title?: string;
  subtitle?: string;
  companyName?: string;
  logoUrl?: string;
  includeDate?: boolean;
  includePageNumbers?: boolean;
  quality?: 'standard' | 'high' | 'print';
  theme?: 'dark' | 'light' | 'brand';
  orientation?: 'portrait' | 'landscape';
}

export interface PDFColors {
  background: { r: number; g: number; b: number };
  backgroundAlt: { r: number; g: number; b: number };
  title: { r: number; g: number; b: number };
  subtitle: { r: number; g: number; b: number };
  text: { r: number; g: number; b: number };
  accent: { r: number; g: number; b: number };
  muted: { r: number; g: number; b: number };
  border: { r: number; g: number; b: number };
}

const THEMES: Record<string, PDFColors> = {
  dark: {
    background: { r: 15, g: 23, b: 42 },      // slate-900
    backgroundAlt: { r: 30, g: 41, b: 59 },   // slate-800
    title: { r: 248, g: 250, b: 252 },        // slate-50
    subtitle: { r: 148, g: 163, b: 184 },     // slate-400
    text: { r: 226, g: 232, b: 240 },         // slate-200
    accent: { r: 99, g: 102, b: 241 },        // indigo-500
    muted: { r: 100, g: 116, b: 139 },        // slate-500
    border: { r: 51, g: 65, b: 85 },          // slate-700
  },
  light: {
    background: { r: 255, g: 255, b: 255 },
    backgroundAlt: { r: 248, g: 250, b: 252 },
    title: { r: 15, g: 23, b: 42 },
    subtitle: { r: 71, g: 85, b: 105 },
    text: { r: 51, g: 65, b: 85 },
    accent: { r: 99, g: 102, b: 241 },
    muted: { r: 148, g: 163, b: 184 },
    border: { r: 226, g: 232, b: 240 },
  },
  brand: {
    background: { r: 15, g: 23, b: 42 },
    backgroundAlt: { r: 22, g: 78, b: 99 },   // teal accent
    title: { r: 248, g: 250, b: 252 },
    subtitle: { r: 148, g: 163, b: 184 },
    text: { r: 226, g: 232, b: 240 },
    accent: { r: 45, g: 212, b: 191 },        // teal-400
    muted: { r: 100, g: 116, b: 139 },
    border: { r: 51, g: 65, b: 85 },
  },
};

const QUALITY_SETTINGS = {
  standard: { width: 1280, height: 720 },
  high: { width: 1920, height: 1080 },
  print: { width: 2560, height: 1440 },
};

/**
 * Creates a professionally styled PDF document
 */
export function createEnhancedPDF(options: EnhancedPDFOptions = {}): {
  doc: jsPDF;
  colors: PDFColors;
  dimensions: { width: number; height: number };
  addCoverPage: (title: string, subtitle?: string) => void;
  addContentPage: () => void;
  addHeader: (text: string) => void;
  addSubheader: (text: string) => void;
  addParagraph: (text: string, x: number, y: number) => number;
  addBulletList: (items: string[], x: number, startY: number) => number;
  addMetricsCard: (label: string, value: string, x: number, y: number, width: number) => void;
  addFooter: (pageNum?: number, totalPages?: number) => void;
  addDivider: (y: number) => void;
  getCurrentY: () => number;
  setCurrentY: (y: number) => void;
} {
  const {
    quality = 'high',
    theme = 'dark',
    orientation = 'landscape',
  } = options;

  const { width, height } = QUALITY_SETTINGS[quality];
  const colors = THEMES[theme];
  
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: [width, height],
  });

  let currentY = 80;
  const margin = width * 0.05;

  const setCurrentY = (y: number) => { currentY = y; };
  const getCurrentY = () => currentY;

  const addCoverPage = (title: string, subtitle?: string) => {
    // Background
    doc.setFillColor(colors.background.r, colors.background.g, colors.background.b);
    doc.rect(0, 0, width, height, 'F');

    // Accent gradient bar at top
    doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.rect(0, 0, width, 6, 'F');

    // Decorative circle (primary)
    doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.circle(width * 0.85, height * 0.3, width * 0.15, 'F');
    
    // Secondary decorative circle with muted color
    doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
    doc.circle(width * 0.15, height * 0.7, width * 0.2, 'F');

    // Title
    doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
    doc.setFontSize(width * 0.06);
    doc.text(title, width / 2, height * 0.4, { align: 'center' });

    // Subtitle
    if (subtitle) {
      doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
      doc.setFontSize(width * 0.025);
      doc.text(subtitle, width / 2, height * 0.48, { align: 'center' });
    }

    // Company name
    if (options.companyName) {
      doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
      doc.setFontSize(width * 0.018);
      doc.text(options.companyName.toUpperCase(), width / 2, height * 0.55, { align: 'center' });
    }

    // Date
    if (options.includeDate) {
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
      doc.setFontSize(14);
      doc.text(dateStr, width / 2, height * 0.92, { align: 'center' });
    }

    currentY = 80;
  };

  const addContentPage = () => {
    doc.addPage();
    
    // Background
    doc.setFillColor(colors.background.r, colors.background.g, colors.background.b);
    doc.rect(0, 0, width, height, 'F');

    // Subtle accent bar
    doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.rect(0, 0, width, 4, 'F');

    currentY = 60;
  };

  const addHeader = (text: string) => {
    doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
    doc.setFontSize(width * 0.032);
    doc.text(text, margin, currentY);
    currentY += 50;
  };

  const addSubheader = (text: string) => {
    doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
    doc.setFontSize(width * 0.018);
    doc.text(text.toUpperCase(), margin, currentY);
    currentY += 35;
  };

  const addParagraph = (text: string, x: number, y: number): number => {
    doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
    doc.setFontSize(width * 0.014);
    const maxWidth = width - x - margin;
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * 22;
  };

  const addBulletList = (items: string[], x: number, startY: number): number => {
    doc.setFontSize(width * 0.014);
    const bulletSpacing = height * 0.045;
    const maxBulletWidth = width * 0.7;
    let y = startY;

    items.slice(0, 8).forEach((item, index) => {
      // Bullet point
      doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
      doc.circle(x - 12, y - 5, 4, 'F');

      // Text
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const lines = doc.splitTextToSize(item, maxBulletWidth);
      doc.text(lines[0], x, y);
      
      if (lines[1]) {
        doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
        doc.text(lines[1], x, y + 18);
        y += 18;
      }

      y += bulletSpacing;
    });

    return y;
  };

  const addMetricsCard = (label: string, value: string, x: number, y: number, cardWidth: number) => {
    const cardHeight = 80;
    
    // Card background
    doc.setFillColor(colors.backgroundAlt.r, colors.backgroundAlt.g, colors.backgroundAlt.b);
    doc.roundedRect(x, y, cardWidth, cardHeight, 8, 8, 'F');

    // Value
    doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.setFontSize(width * 0.035);
    doc.text(value, x + cardWidth / 2, y + 35, { align: 'center' });

    // Label
    doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
    doc.setFontSize(width * 0.012);
    doc.text(label, x + cardWidth / 2, y + 60, { align: 'center' });
  };

  const addFooter = (pageNum?: number, totalPages?: number) => {
    // Border line
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.setLineWidth(0.5);
    doc.line(margin, height - 40, width - margin, height - 40);

    // Company name
    if (options.companyName) {
      doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
      doc.setFontSize(10);
      doc.text(options.companyName, margin, height - 20);
    }

    // Page number
    if (pageNum !== undefined && totalPages !== undefined) {
      doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
      doc.setFontSize(10);
      doc.text(`${pageNum} of ${totalPages}`, width - margin, height - 20, { align: 'right' });
    }
  };

  const addDivider = (y: number) => {
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.setLineWidth(0.5);
    doc.line(margin, y, width - margin, y);
  };

  return {
    doc,
    colors,
    dimensions: { width, height },
    addCoverPage,
    addContentPage,
    addHeader,
    addSubheader,
    addParagraph,
    addBulletList,
    addMetricsCard,
    addFooter,
    addDivider,
    getCurrentY,
    setCurrentY,
  };
}

/**
 * Export Lean Canvas to enhanced PDF
 */
export async function exportLeanCanvasPDF(
  canvasData: Record<string, { items: string[] }>,
  options: EnhancedPDFOptions = {}
): Promise<void> {
  const pdf = createEnhancedPDF({
    ...options,
    title: options.title || 'Lean Canvas',
    orientation: 'landscape',
  });

  // Cover page
  pdf.addCoverPage(
    options.title || 'Lean Canvas',
    options.subtitle || 'Business Model Overview'
  );
  pdf.addFooter();

  // Content page
  pdf.addContentPage();
  pdf.addHeader('Lean Canvas Summary');

  const boxLabels: Record<string, string> = {
    problem: 'Problem',
    solution: 'Solution',
    uniqueValueProposition: 'Unique Value Proposition',
    unfairAdvantage: 'Unfair Advantage',
    customerSegments: 'Customer Segments',
    channels: 'Channels',
    revenueStreams: 'Revenue Streams',
    costStructure: 'Cost Structure',
    keyMetrics: 'Key Metrics',
  };

  let y = pdf.getCurrentY();
  const boxesPerRow = 3;
  const boxWidth = (pdf.dimensions.width * 0.9 - 40) / boxesPerRow;
  const boxHeight = 180;
  const margin = pdf.dimensions.width * 0.05;
  let col = 0;

  Object.entries(canvasData).forEach(([key, box]) => {
    if (!box.items?.length) return;

    const x = margin + (col % boxesPerRow) * (boxWidth + 20);
    
    if (col > 0 && col % boxesPerRow === 0) {
      y += boxHeight + 20;
    }
    
    if (y + boxHeight > pdf.dimensions.height - 60) {
      pdf.addContentPage();
      y = 60;
      col = 0;
    }

    // Box background
    pdf.doc.setFillColor(pdf.colors.backgroundAlt.r, pdf.colors.backgroundAlt.g, pdf.colors.backgroundAlt.b);
    pdf.doc.roundedRect(x, y, boxWidth, boxHeight, 8, 8, 'F');

    // Box title
    pdf.doc.setTextColor(pdf.colors.accent.r, pdf.colors.accent.g, pdf.colors.accent.b);
    pdf.doc.setFontSize(12);
    pdf.doc.text(boxLabels[key] || key, x + 12, y + 20);

    // Box items
    pdf.doc.setTextColor(pdf.colors.text.r, pdf.colors.text.g, pdf.colors.text.b);
    pdf.doc.setFontSize(10);
    box.items.slice(0, 5).forEach((item, i) => {
      const itemY = y + 40 + i * 24;
      pdf.doc.text(`• ${item}`, x + 12, itemY);
    });

    col++;
  });

  pdf.addFooter(2, 2);
  pdf.doc.save(`${(options.companyName || 'lean-canvas').toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export default { createEnhancedPDF, exportLeanCanvasPDF };
