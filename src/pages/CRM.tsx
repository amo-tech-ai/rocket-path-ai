import { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EnhancedCRMAIPanel } from '@/components/crm/EnhancedCRMAIPanel';
import { ContactCard } from '@/components/crm/ContactCard';
import { DealPipeline } from '@/components/crm/DealPipeline';
import { ContactDialog } from '@/components/crm/ContactDialog';
import { DealDialog } from '@/components/crm/DealDialog';
import { ContactDetailSheet } from '@/components/crm/ContactDetailSheet';
import { CSVImportDialog } from '@/components/crm/CSVImportDialog';
import {
  useContacts, 
  useDeals,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useCreateDeal,
  useUpdateDeal,
  CONTACT_TYPES,
  Contact
} from '@/hooks/useCRM';
import { useStartup } from '@/hooks/useDashboardData';
import { Tables } from '@/integrations/supabase/types';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  UserPlus,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type DealWithContact = Tables<'deals'> & {
  contact: { id: string; name: string; email: string | null; company: string | null } | null;
};

const CRM = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: contacts = [], isLoading: contactsLoading } = useContacts(startup?.id);
  const { data: deals = [], isLoading: dealsLoading } = useDeals(startup?.id);
  
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  
  // Dialog states
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingDeal, setEditingDeal] = useState<DealWithContact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<DealWithContact | null>(null);
  const [csvImportOpen, setCSVImportOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('contacts');

  const isLoading = startupLoading || contactsLoading || dealsLoading;

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateContact = async (data: any) => {
    if (!startup?.id) {
      toast.error('No startup found. Please set up your startup profile first.');
      return;
    }
    
    try {
      await createContact.mutateAsync({
        ...data,
        startup_id: startup.id,
      });
      toast.success('Contact added successfully');
      setContactDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add contact');
    }
  };

  const handleUpdateContact = async (data: any) => {
    if (!editingContact) return;
    
    try {
      await updateContact.mutateAsync({
        id: editingContact.id,
        updates: data,
      });
      toast.success('Contact updated successfully');
      setEditingContact(null);
      setContactDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      await deleteContact.mutateAsync(contactToDelete.id);
      toast.success('Contact deleted');
      setDeleteConfirmOpen(false);
      setContactToDelete(null);
      setDetailSheetOpen(false);
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleCreateDeal = async (data: any) => {
    if (!startup?.id) {
      toast.error('No startup found');
      return;
    }
    
    try {
      await createDeal.mutateAsync({
        ...data,
        startup_id: startup.id,
        contact_id: data.contact_id || selectedContact?.id || null,
      });
      toast.success('Deal created successfully');
      setDealDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast.error('Failed to create deal');
    }
  };

  const handleUpdateDeal = async (data: any) => {
    if (!editingDeal) return;
    
    try {
      await updateDeal.mutateAsync({
        id: editingDeal.id,
        updates: data,
      });
      toast.success('Deal updated successfully');
      setEditingDeal(null);
      setDealDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update deal');
    }
  };

  const openContactDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setDetailSheetOpen(true);
  };

  const openEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactDialogOpen(true);
    setDetailSheetOpen(false);
  };

  const openDeleteConfirm = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteConfirmOpen(true);
  };

  const openAddDealForContact = () => {
    setDealDialogOpen(true);
  };

  const openEditDeal = (deal: DealWithContact) => {
    setEditingDeal(deal);
    setSelectedDeal(deal);
    setDealDialogOpen(true);
  };

  const handleCSVImport = async (contacts: Array<Record<string, string>>) => {
    if (!startup?.id) return;
    
    for (const contact of contacts) {
      if (contact.name) {
        await createContact.mutateAsync({
          name: contact.name,
          email: contact.email || null,
          phone: contact.phone || null,
          company: contact.company || null,
          title: contact.title || null,
          linkedin_url: contact.linkedin_url || null,
          startup_id: startup.id,
          type: contact.type || 'other',
        });
      }
    }
  };

  const handleAddFromMatcher = async (investor: any) => {
    if (!startup?.id) return;
    await createContact.mutateAsync({
      name: investor.name,
      company: investor.firm,
      type: 'investor',
      startup_id: startup.id,
      linkedin_url: investor.linkedinUrl || null,
    });
  };

  // Empty state
  if (!isLoading && contacts.length === 0 && deals.length === 0) {
    return (
      <DashboardLayout aiPanel={<EnhancedCRMAIPanel contactsCount={0} dealsCount={0} startupId={startup?.id} onAddContact={handleAddFromMatcher} />}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Intelligent CRM</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Track relationships, manage deals, and let AI tell you who to reach out to 
            and when.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setContactDialogOpen(true)}>
              <UserPlus className="w-5 h-5 mr-2" />
              Add your first contact
            </Button>
            <Button variant="outline" onClick={() => setDealDialogOpen(true)}>
              <TrendingUp className="w-5 h-5 mr-2" />
              Create a deal
            </Button>
          </div>
        </motion.div>

        <ContactDialog
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          onSubmit={handleCreateContact}
          isLoading={createContact.isPending}
        />
        
        <DealDialog
          open={dealDialogOpen}
          onOpenChange={setDealDialogOpen}
          onSubmit={handleCreateDeal}
          contacts={contacts}
          isLoading={createDeal.isPending}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout aiPanel={<EnhancedCRMAIPanel contactsCount={contacts.length} dealsCount={deals.length} startupId={startup?.id} selectedDeal={selectedDeal} onAddContact={handleAddFromMatcher} />}>
      <div className="max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-semibold mb-1">CRM</h1>
            <p className="text-muted-foreground">
              {contacts.length} contacts · {deals.length} active deals
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCSVImportOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={() => setDealDialogOpen(true)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              New Deal
            </Button>
            <Button onClick={() => setContactDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList>
              <TabsTrigger value="contacts" className="gap-2">
                <Users className="w-4 h-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Pipeline
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CONTACT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Contacts Grid */}
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">No contacts match your filters</p>
                <Button 
                  variant="link" 
                  onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}
                >
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredContacts.map((contact, index) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onClick={() => openContactDetail(contact)}
                    onEdit={() => openEditContact(contact)}
                    onDelete={() => openDeleteConfirm(contact)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline">
            {isLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-64 w-64 flex-shrink-0 rounded-xl" />
                ))}
              </div>
            ) : (
              <DealPipeline 
                deals={deals as DealWithContact[]} 
                onDealClick={openEditDeal}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Dialog */}
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={(open) => {
          setContactDialogOpen(open);
          if (!open) setEditingContact(null);
        }}
        onSubmit={editingContact ? handleUpdateContact : handleCreateContact}
        contact={editingContact}
        isLoading={createContact.isPending || updateContact.isPending}
      />

      {/* Deal Dialog */}
      <DealDialog
        open={dealDialogOpen}
        onOpenChange={(open) => {
          setDealDialogOpen(open);
          if (!open) {
            setEditingDeal(null);
            setSelectedContact(null);
          }
        }}
        onSubmit={editingDeal ? handleUpdateDeal : handleCreateDeal}
        deal={editingDeal}
        contacts={contacts}
        isLoading={createDeal.isPending || updateDeal.isPending}
      />

      {/* Contact Detail Sheet */}
      <ContactDetailSheet
        contact={selectedContact}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={() => selectedContact && openEditContact(selectedContact)}
        onDelete={() => selectedContact && openDeleteConfirm(selectedContact)}
        onAddDeal={openAddDealForContact}
        startupId={startup?.id}
      />

      {/* CSV Import Dialog */}
      <CSVImportDialog
        open={csvImportOpen}
        onOpenChange={setCSVImportOpen}
        onImport={handleCSVImport}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contactToDelete?.name}"? 
              This will also remove them from any associated deals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContact}
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

export default CRM;
