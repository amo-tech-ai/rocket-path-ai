import { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DocumentsAIPanel } from '@/components/documents/DocumentsAIPanel';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentDialog } from '@/components/documents/DocumentDialog';
import { 
  useDocuments, 
  useCreateDocument, 
  useUpdateDocument, 
  useDeleteDocument,
  Document,
  DOCUMENT_TYPES 
} from '@/hooks/useDocuments';
import { useStartup } from '@/hooks/useDashboardData';
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Documents = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(startup?.id);
  
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isLoading = startupLoading || documentsLoading;

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateDocument = async (data: any) => {
    if (!startup?.id) {
      toast.error('No startup found. Please set up your startup profile first.');
      return;
    }
    
    try {
      await createDocument.mutateAsync({
        ...data,
        startup_id: startup.id,
      });
      toast.success('Document created');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create document');
    }
  };

  const handleUpdateDocument = async (data: any) => {
    if (!editingDocument) return;
    
    try {
      await updateDocument.mutateAsync({
        id: editingDocument.id,
        updates: data,
      });
      toast.success('Document updated');
      setEditingDocument(null);
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument.mutateAsync(documentToDelete.id);
      toast.success('Document deleted');
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const openEditDialog = (doc: Document) => {
    setEditingDocument(doc);
    setDialogOpen(true);
  };

  const openDeleteConfirm = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteConfirmOpen(true);
  };

  const handleOpenDocument = (doc: Document) => {
    // For now, open edit dialog. Later: navigate to document editor
    openEditDialog(doc);
  };

  // Empty state
  if (!isLoading && documents.length === 0) {
    return (
      <DashboardLayout aiPanel={<DocumentsAIPanel documentsCount={0} draftCount={0} publishedCount={0} startupId={startup?.id} />}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Documents & Decks</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create, store, and collaborate on pitch decks, memos, and strategic 
            documents—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Document
            </Button>
            <Button variant="outline" disabled>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate with AI
            </Button>
          </div>
        </motion.div>

        <DocumentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleCreateDocument}
          isLoading={createDocument.isPending}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout aiPanel={<DocumentsAIPanel documentsCount={documents.length} draftCount={documents.filter(d => d.status === 'draft').length} publishedCount={documents.filter(d => d.status === 'approved').length} startupId={startup?.id} />}>
      <div className="max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-semibold mb-1">Documents</h1>
            <p className="text-muted-foreground">
              {documents.length} document{documents.length !== 1 ? 's' : ''} in total
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <span className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    {type.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Documents Grid/List */}
        {isLoading ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No documents match your filters</p>
            <Button 
              variant="link" 
              onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}
            >
              Clear filters
            </Button>
          </motion.div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredDocuments.map((doc, index) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onEdit={() => openEditDialog(doc)}
                onDelete={() => openDeleteConfirm(doc)}
                onOpen={() => handleOpenDocument(doc)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <DocumentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingDocument(null);
        }}
        onSubmit={editingDocument ? handleUpdateDocument : handleCreateDocument}
        document={editingDocument}
        isLoading={createDocument.isPending || updateDocument.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Documents;
