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
      // Dynamic import of jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [1920, 1080],
      });

      slides.forEach((slide, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Background
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 1920, 1080, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(72);
        doc.text(slide.title || 'Untitled Slide', 960, 400, { align: 'center' });

        // Subtitle
        if (slide.subtitle) {
          doc.setFontSize(36);
          doc.setTextColor(148, 163, 184); // slate-400
          doc.text(slide.subtitle, 960, 480, { align: 'center' });
        }

        // Bullets
        if (slide.content?.bullets?.length) {
          doc.setFontSize(28);
          doc.setTextColor(226, 232, 240); // slate-200
          slide.content.bullets.forEach((bullet, bulletIndex) => {
            doc.text(`• ${bullet}`, 400, 580 + bulletIndex * 50);
          });
        }

        // Slide number
        if (includeSlideNumbers) {
          doc.setFontSize(18);
          doc.setTextColor(100, 116, 139); // slate-500
          doc.text(`${index + 1} / ${slides.length}`, 1880, 1050, { align: 'right' });
        }

        // Speaker notes on separate page
        if (includeSpeakerNotes && slide.content?.speaker_notes) {
          doc.addPage();
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, 1920, 1080, 'F');
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(24);
          doc.text(`Speaker Notes - Slide ${index + 1}`, 100, 100);
          doc.setFontSize(18);
          doc.text(slide.content.speaker_notes, 100, 160, { maxWidth: 1720 });
        }
      });

      doc.save(`${deckTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
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
