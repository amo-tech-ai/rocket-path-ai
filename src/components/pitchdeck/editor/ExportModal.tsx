/**
 * Export Modal
 * Handles PDF, PPTX, and shareable link export
 */

import { useState } from 'react';
import { 
  Download, 
  FileText, 
  Link as LinkIcon, 
  Check, 
  Copy,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Slide } from '@/hooks/usePitchDeckEditor';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
  deckTitle: string;
  slides: Slide[];
}

export function ExportModal({ 
  isOpen, 
  onClose, 
  deckId, 
  deckTitle,
  slides 
}: ExportModalProps) {
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(false);
  const [includeSlideNumbers, setIncludeSlideNumbers] = useState(true);
  const [quality, setQuality] = useState<'standard' | 'high' | 'print'>('high');
  const [linkExpiration, setLinkExpiration] = useState<'1' | '7' | '30' | 'never'>('7');
  const [isExporting, setIsExporting] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      
      // Quality settings
      const qualitySettings = {
        standard: { width: 1280, height: 720 },
        high: { width: 1920, height: 1080 },
        print: { width: 2560, height: 1440 },
      };
      const { width, height } = qualitySettings[quality];
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [width, height],
      });

      // Professional color palette
      const colors = {
        background: { r: 15, g: 23, b: 42 },      // slate-900
        backgroundAlt: { r: 30, g: 41, b: 59 },   // slate-800
        title: { r: 248, g: 250, b: 252 },        // slate-50
        subtitle: { r: 148, g: 163, b: 184 },     // slate-400
        text: { r: 226, g: 232, b: 240 },         // slate-200
        accent: { r: 99, g: 102, b: 241 },        // indigo-500
        muted: { r: 100, g: 116, b: 139 },        // slate-500
      };

      slides.forEach((slide, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Gradient-like background with subtle variation
        doc.setFillColor(colors.background.r, colors.background.g, colors.background.b);
        doc.rect(0, 0, width, height, 'F');
        
        // Subtle top accent bar
        doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
        doc.rect(0, 0, width, 4, 'F');

        // Slide type indicator
        const slideTypeLabels: Record<string, string> = {
          title: 'INTRODUCTION',
          problem: 'THE PROBLEM',
          solution: 'OUR SOLUTION',
          market: 'MARKET OPPORTUNITY',
          product: 'PRODUCT',
          business_model: 'BUSINESS MODEL',
          traction: 'TRACTION',
          team: 'TEAM',
          financials: 'FINANCIALS',
          ask: 'THE ASK',
          closing: 'THANK YOU',
        };
        
        const slideType = slide.slide_type || 'content';
        const slideLabel = slideTypeLabels[slideType] || slideType.toUpperCase();
        doc.setFontSize(12);
        doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
        doc.text(slideLabel, width * 0.05, height * 0.08);

        // Main title - centered, large
        doc.setTextColor(colors.title.r, colors.title.g, colors.title.b);
        doc.setFontSize(width * 0.04); // Responsive font size
        const titleY = slideType === 'title' ? height * 0.4 : height * 0.2;
        doc.text(slide.title || 'Untitled Slide', width / 2, titleY, { align: 'center' });

        // Subtitle
        if (slide.subtitle) {
          doc.setFontSize(width * 0.02);
          doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
          doc.text(slide.subtitle, width / 2, titleY + height * 0.06, { align: 'center' });
        }

        // Bullets with professional styling
        if (slide.content?.bullets?.length) {
          doc.setFontSize(width * 0.018);
          doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
          
          const bulletStartY = titleY + height * 0.15;
          const bulletSpacing = height * 0.06;
          const bulletIndent = width * 0.08;
          const maxBulletWidth = width * 0.7;

          slide.content.bullets.forEach((bullet, bulletIndex) => {
            if (bulletIndex < 6) { // Max 6 bullets per slide
              const bulletY = bulletStartY + bulletIndex * bulletSpacing;
              
              // Bullet point circle
              doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
              doc.circle(bulletIndent - 15, bulletY - 5, 4, 'F');
              
              // Bullet text with wrapping
              const lines = doc.splitTextToSize(bullet, maxBulletWidth);
              doc.text(lines[0], bulletIndent, bulletY);
              if (lines[1]) {
                doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
                doc.text(lines[1], bulletIndent, bulletY + 20);
              }
            }
          });
        }

        // Key metrics display for traction/financials slides
        const hasMetrics = slide.content?.metrics && slide.content.metrics.length > 0;
        if (hasMetrics && (slideType === 'traction' || slideType === 'financials')) {
          const primaryMetric = slide.content.metrics![0];
          doc.setFontSize(width * 0.06);
          doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
          doc.text(`${primaryMetric.value}`, width / 2, height * 0.5, { align: 'center' });
          doc.setFontSize(width * 0.02);
          doc.setTextColor(colors.subtitle.r, colors.subtitle.g, colors.subtitle.b);
          doc.text(primaryMetric.label, width / 2, height * 0.55, { align: 'center' });
        }

        // Slide number with modern styling
        if (includeSlideNumbers) {
          doc.setFontSize(14);
          doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
          doc.text(`${index + 1}`, width - 50, height - 30, { align: 'right' });
          doc.setFontSize(10);
          doc.text(`of ${slides.length}`, width - 30, height - 30);
        }

        // Company logo placeholder area
        doc.setDrawColor(colors.muted.r, colors.muted.g, colors.muted.b);
        doc.setLineWidth(0.5);

        // Speaker notes on separate page (if enabled)
        if (includeSpeakerNotes && slide.content?.speaker_notes) {
          doc.addPage();
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, width, height, 'F');
          
          // Header
          doc.setFillColor(colors.background.r, colors.background.g, colors.background.b);
          doc.rect(0, 0, width, 80, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(24);
          doc.text(`Speaker Notes — Slide ${index + 1}: ${slide.title || 'Untitled'}`, 40, 50);
          
          // Notes content
          doc.setTextColor(30, 30, 30);
          doc.setFontSize(16);
          const noteLines = doc.splitTextToSize(slide.content.speaker_notes, width - 80);
          doc.text(noteLines, 40, 120);
        }
      });

      doc.save(`${deckTitle.replace(/\s+/g, '-').toLowerCase()}-pitch-deck.pdf`);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = async () => {
    setIsExporting(true);
    try {
      // For PPTX, we'd need pptxgenjs but keeping it simple for now
      // This creates a JSON that could be processed by a backend
      const exportData = {
        title: deckTitle,
        slides: slides.map((slide, index) => ({
          number: index + 1,
          title: slide.title,
          subtitle: slide.subtitle,
          bullets: slide.content?.bullets || [],
          speakerNotes: includeSpeakerNotes ? slide.content?.speaker_notes : undefined,
          imageUrl: slide.image_url,
        })),
        options: {
          includeSlideNumbers,
          quality,
        },
      };

      // Download as JSON (in production, this would call an edge function)
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deckTitle.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.info('PPTX export coming soon. Downloaded as JSON for now.');
    } catch (error) {
      console.error('PPTX export error:', error);
      toast.error('Failed to export PPTX');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateLink = async () => {
    setIsExporting(true);
    try {
      // In production, this would create a shareable link in the database
      const expirationDays = linkExpiration === 'never' ? null : parseInt(linkExpiration);
      const mockLink = `https://rocket-path-ai.lovable.app/share/${deckId}?expires=${expirationDays || 'never'}`;
      
      setShareableLink(mockLink);
      toast.success('Shareable link generated');
    } catch (error) {
      console.error('Generate link error:', error);
      toast.error('Failed to generate link');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Deck</DialogTitle>
          <DialogDescription>
            Download your pitch deck or create a shareable link
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pdf" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="pptx">PPTX</TabsTrigger>
            <TabsTrigger value="link">Share Link</TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pdf-notes" 
                  checked={includeSpeakerNotes}
                  onCheckedChange={(checked) => setIncludeSpeakerNotes(!!checked)}
                />
                <Label htmlFor="pdf-notes">Include speaker notes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pdf-numbers" 
                  checked={includeSlideNumbers}
                  onCheckedChange={(checked) => setIncludeSlideNumbers(!!checked)}
                />
                <Label htmlFor="pdf-numbers">Include slide numbers</Label>
              </div>
              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={quality} onValueChange={(v) => setQuality(v as typeof quality)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (faster)</SelectItem>
                    <SelectItem value="high">High Quality</SelectItem>
                    <SelectItem value="print">Print Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleExportPDF} disabled={isExporting} className="w-full">
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Export PDF
            </Button>
          </TabsContent>

          <TabsContent value="pptx" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pptx-notes" 
                  checked={includeSpeakerNotes}
                  onCheckedChange={(checked) => setIncludeSpeakerNotes(!!checked)}
                />
                <Label htmlFor="pptx-notes">Include speaker notes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pptx-numbers" 
                  checked={includeSlideNumbers}
                  onCheckedChange={(checked) => setIncludeSlideNumbers(!!checked)}
                />
                <Label htmlFor="pptx-numbers">Include slide numbers</Label>
              </div>
            </div>
            <Button onClick={handleExportPPTX} disabled={isExporting} className="w-full">
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export PowerPoint
            </Button>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Link Expiration</Label>
              <Select value={linkExpiration} onValueChange={(v) => setLinkExpiration(v as typeof linkExpiration)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="never">Never expires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {shareableLink ? (
              <div className="space-y-2">
                <Label>Shareable Link</Label>
                <div className="flex gap-2">
                  <Input value={shareableLink} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleGenerateLink} disabled={isExporting} className="w-full">
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LinkIcon className="w-4 h-4 mr-2" />
                )}
                Generate Link
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
