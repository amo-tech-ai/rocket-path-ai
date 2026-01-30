/**
 * CSV Import Dialog for CRM
 * Bulk contact import with preview and column mapping
 */

import { useState, useCallback } from 'react';
import { Upload, FileText, Check, AlertCircle, X, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CSVRow {
  [key: string]: string;
}

interface ColumnMapping {
  csvColumn: string;
  targetField: string;
}

const TARGET_FIELDS = [
  { value: 'name', label: 'Name', required: true },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'title', label: 'Job Title' },
  { value: 'type', label: 'Contact Type' },
  { value: 'linkedin_url', label: 'LinkedIn URL' },
  { value: 'notes', label: 'Notes' },
  { value: 'skip', label: '-- Skip --' },
];

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (contacts: Array<Record<string, string>>) => Promise<void>;
}

export function CSVImportDialog({ open, onOpenChange, onImport }: CSVImportDialogProps) {
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'importing'>('upload');
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const parseCSV = (text: string): { headers: string[]; rows: CSVRow[] } => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new Error('Empty CSV file');

    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: CSVRow = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }

    return { headers, rows };
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { headers, rows } = parseCSV(text);
        
        setHeaders(headers);
        setCsvData(rows);
        
        // Auto-map columns
        const autoMappings: ColumnMapping[] = headers.map(header => {
          const lowerHeader = header.toLowerCase();
          let targetField = 'skip';
          
          if (lowerHeader.includes('name') || lowerHeader === 'full name') {
            targetField = 'name';
          } else if (lowerHeader.includes('email')) {
            targetField = 'email';
          } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
            targetField = 'phone';
          } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
            targetField = 'company';
          } else if (lowerHeader.includes('title') || lowerHeader.includes('position')) {
            targetField = 'title';
          } else if (lowerHeader.includes('linkedin')) {
            targetField = 'linkedin_url';
          } else if (lowerHeader.includes('type')) {
            targetField = 'type';
          }
          
          return { csvColumn: header, targetField };
        });
        
        setMappings(autoMappings);
        setStep('map');
        toast.success(`Found ${rows.length} contacts to import`);
      } catch (error) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleMappingChange = (csvColumn: string, targetField: string) => {
    setMappings(prev => 
      prev.map(m => 
        m.csvColumn === csvColumn ? { ...m, targetField } : m
      )
    );
  };

  const validateMappings = (): boolean => {
    const hasName = mappings.some(m => m.targetField === 'name');
    if (!hasName) {
      setErrors(['Name field is required']);
      return false;
    }
    setErrors([]);
    return true;
  };

  const handlePreview = () => {
    if (validateMappings()) {
      setStep('preview');
    }
  };

  const transformData = (): Array<Record<string, string>> => {
    return csvData.map(row => {
      const contact: Record<string, string> = {};
      mappings.forEach(mapping => {
        if (mapping.targetField !== 'skip' && row[mapping.csvColumn]) {
          contact[mapping.targetField] = row[mapping.csvColumn];
        }
      });
      return contact;
    }).filter(c => c.name); // Only include rows with names
  };

  const handleImport = async () => {
    setStep('importing');
    setImportProgress(0);

    try {
      const contacts = transformData();
      
      // Simulate progress
      const interval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onImport(contacts);
      
      clearInterval(interval);
      setImportProgress(100);
      
      setTimeout(() => {
        toast.success(`Successfully imported ${contacts.length} contacts`);
        handleClose();
      }, 500);
    } catch (error) {
      toast.error('Failed to import contacts');
      setStep('preview');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setCsvData([]);
    setHeaders([]);
    setMappings([]);
    setImportProgress(0);
    setErrors([]);
    onOpenChange(false);
  };

  const previewData = transformData().slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Contacts from CSV
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Upload a CSV file with your contacts'}
            {step === 'map' && 'Map CSV columns to contact fields'}
            {step === 'preview' && 'Review contacts before importing'}
            {step === 'importing' && 'Importing contacts...'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8"
            >
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV files only</p>
                </div>
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </motion.div>
          )}

          {step === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {mappings.map((mapping, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1 p-2 bg-muted rounded text-sm truncate">
                        {mapping.csvColumn}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <Select
                        value={mapping.targetField}
                        onValueChange={(value) => handleMappingChange(mapping.csvColumn, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TARGET_FIELDS.map(field => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  {errors.map((error, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {transformData().length} contacts ready to import
                </span>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {previewData.map((contact, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email && <span>{contact.email}</span>}
                        {contact.company && <span> · {contact.company}</span>}
                      </div>
                      {contact.type && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {contact.type}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {transformData().length > 5 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      ...and {transformData().length - 5} more contacts
                    </p>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {step === 'importing' && (
            <motion.div
              key="importing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {importProgress === 100 ? (
                    <Check className="w-8 h-8 text-sage" />
                  ) : (
                    <Upload className="w-8 h-8 text-primary animate-pulse" />
                  )}
                </div>
                <p className="text-sm font-medium mb-2">
                  {importProgress === 100 ? 'Import Complete!' : 'Importing contacts...'}
                </p>
                <Progress value={importProgress} className="w-48 mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter>
          {step === 'map' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handlePreview}>
                Preview Import
              </Button>
            </>
          )}
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('map')}>
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {transformData().length} Contacts
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
