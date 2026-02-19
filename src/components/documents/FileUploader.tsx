import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
  'text/plain': 'TXT',
  'text/csv': 'CSV',
};

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image className="w-8 h-8 text-sage" />;
  if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
  return <File className="w-8 h-8 text-primary" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  progress?: number;
  error?: string | null;
  className?: string;
}

export function FileUploader({ onFileSelect, uploading, progress, error, className }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES[file.type]) {
      return `File type "${file.type || 'unknown'}" is not supported. Accepted: ${Object.values(ACCEPTED_TYPES).join(', ')}`;
    }
    if (file.size > MAX_SIZE) {
      return `File is too large (${formatFileSize(file.size)}). Maximum size is 50 MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) {
      setValidationError(err);
      setSelectedFile(null);
      return;
    }
    setValidationError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const acceptString = Object.keys(ACCEPTED_TYPES).join(',');

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          dragOver && 'border-primary bg-primary/5',
          !dragOver && !validationError && !error && 'border-muted-foreground/25 hover:border-primary/50',
          (validationError || error) && 'border-destructive/50 bg-destructive/5',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile && !validationError ? (
          <div className="flex items-center gap-3 justify-center">
            {getFileIcon(selectedFile.type)}
            <div className="text-left">
              <p className="font-medium text-sm truncate max-w-[240px]">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {ACCEPTED_TYPES[selectedFile.type]} &middot; {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {!uploading && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Drop a file here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, PPTX, XLSX, images &middot; Max 50 MB
            </p>
          </>
        )}
      </div>

      {uploading && progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {(validationError || error) && (
        <p className="text-xs text-destructive">{validationError || error}</p>
      )}
    </div>
  );
}
