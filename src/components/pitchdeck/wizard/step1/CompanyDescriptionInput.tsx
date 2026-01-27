/**
 * Company Description Input Component
 * Rich text input with file upload capability
 */

import { useState, useRef, useEffect } from 'react';
import { Check, Sparkles, Loader2, Upload, FileText, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content?: string;
}

interface CompanyDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (file: UploadedFile) => void;
  uploadedFile?: UploadedFile | null;
  onRemoveFile?: () => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  minWords?: number;
  error?: string;
}

export function CompanyDescriptionInput({
  value,
  onChange,
  onFileUpload,
  uploadedFile,
  onRemoveFile,
  onAnalyze,
  isAnalyzing = false,
  minWords = 20,
  error,
}: CompanyDescriptionInputProps) {
  const [wordCount, setWordCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [value]);

  const isValid = wordCount >= minWords;
  const maxWords = 1000;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return; // Could show error toast
    }

    // Read file content for text files
    let content: string | undefined;
    if (file.type === 'text/plain') {
      content = await file.text();
    }

    const uploadedFile: UploadedFile = {
      name: file.name,
      type: file.type,
      size: file.size,
      content,
    };

    onFileUpload?.(uploadedFile);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="description" className="flex items-center gap-2">
          Company Description
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-2">
          {onAnalyze && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAnalyze}
              disabled={!isValid || isAnalyzing}
              className="h-7 text-xs gap-1"
            >
              {isAnalyzing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              Analyze
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Describe your company, product, and vision in detail. AI will help refine this later.
      </p>
      
      <Textarea
        id="description"
        placeholder="What does your company do? What problem are you solving? Who are your customers? What's your unique approach? Share your vision and any traction you have..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn('min-h-[160px] resize-none', error && 'border-destructive')}
      />
      
      <div className="flex items-center justify-between">
        <p
          className={cn(
            'text-xs flex items-center gap-1',
            isValid ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {wordCount}/{minWords}+ words
          {isValid && <Check className="h-3 w-3" />}
        </p>
        {!isValid && !error && (
          <p className="text-xs text-muted-foreground">
            Add at least {minWords} words for AI analysis
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="pt-2 border-t border-border">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!uploadedFile ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-4 w-4" />
            Upload existing pitch, doc, or notes (optional)
          </Button>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveFile}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          PDF, DOC, or TXT • AI will extract relevant information
        </p>
      </div>
    </div>
  );
}
