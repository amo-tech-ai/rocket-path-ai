import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  title?: string;
  companyName?: string;
  includeDate?: boolean;
  quality?: number;
}

/**
 * Export a DOM element as PNG image
 */
export async function exportToPNG(
  element: HTMLElement,
  filename: string = 'lean-canvas.png',
  options: ExportOptions = {}
): Promise<void> {
  const { quality = 2 } = options;

  try {
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('PNG export failed:', error);
    throw new Error('Failed to export as PNG');
  }
}

/**
 * Export a DOM element as PDF document
 */
export async function exportToPDF(
  element: HTMLElement,
  filename: string = 'lean-canvas.pdf',
  options: ExportOptions = {}
): Promise<void> {
  const {
    title = 'Lean Canvas',
    companyName,
    includeDate = true,
    quality = 2,
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate PDF dimensions (A4 landscape)
    const pdfWidth = 297; // mm
    const pdfHeight = 210; // mm
    const margin = 15; // mm

    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2 - 20; // Leave space for header

    // Scale image to fit
    const scale = Math.min(
      contentWidth / (imgWidth / (quality * 3.779528)),
      contentHeight / (imgHeight / (quality * 3.779528))
    );

    const scaledWidth = (imgWidth / (quality * 3.779528)) * scale;
    const scaledHeight = (imgHeight / (quality * 3.779528)) * scale;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    pdf.setFontSize(16);
    pdf.setTextColor(60, 60, 60);
    pdf.text(title, margin, margin + 5);

    if (companyName) {
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(companyName, margin, margin + 12);
    }

    if (includeDate) {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      pdf.text(dateStr, pdfWidth - margin - pdf.getTextWidth(dateStr), margin + 5);
    }

    // Add canvas image
    const imageX = margin + (contentWidth - scaledWidth) / 2;
    const imageY = margin + 20;
    pdf.addImage(imgData, 'PNG', imageX, imageY, scaledWidth, scaledHeight);

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export as PDF');
  }
}
