import { useState } from 'react';
import { Plus, User, Linkedin, Trash2, Pencil, Loader2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
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
import { Founder } from '@/hooks/useWizardSession';

const FOUNDER_ROLES = [
  'CEO', 'CTO', 'COO', 'CFO', 'CPO',
  'Co-founder', 'Technical Co-founder', 'Other'
];

interface FounderCardProps {
  founders: Founder[];
  onAdd: (founder: Founder) => void;
  onUpdate: (id: string, updates: Partial<Founder>) => void;
  onRemove: (id: string) => void;
  onEnrichLinkedIn?: (id: string, linkedinUrl: string) => void;
  isEnriching?: boolean;
}

export function FounderCards({
  founders,
  onAdd,
  onUpdate,
  onRemove,
  onEnrichLinkedIn,
  isEnriching = false,
}: FounderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', linkedin_url: '' });

  const handleOpenAdd = () => {
    setEditingFounder(null);
    setFormData({ name: '', role: '', linkedin_url: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (founder: Founder) => {
    setEditingFounder(founder);
    setFormData({
      name: founder.name,
      role: founder.role,
      linkedin_url: founder.linkedin_url || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.role) return;

    if (editingFounder) {
      onUpdate(editingFounder.id, {
        name: formData.name,
        role: formData.role,
        linkedin_url: formData.linkedin_url || undefined,
      });
    } else {
      onAdd({
        id: `founder_${Date.now()}`,
        name: formData.name,
        role: formData.role,
        linkedin_url: formData.linkedin_url || undefined,
        enriched: false,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3">
      <Label>Founding Team (at least 1 required) *</Label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Add Founder Card */}
        <Card
          className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
          onClick={handleOpenAdd}
        >
          <CardContent className="flex items-center justify-center gap-2 p-6">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Add Founder</span>
          </CardContent>
        </Card>

        {/* Founder Cards */}
        {founders.map((founder) => (
          <Card key={founder.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{founder.name}</p>
                  <p className="text-xs text-muted-foreground">{founder.role}</p>
                  {founder.linkedin_url && (
                    <div className="flex items-center gap-1 mt-1">
                      <Linkedin className="h-3 w-3 text-primary" />
                      {founder.enriched ? (
                        <span className="text-xs text-primary flex items-center gap-1">
                          <Check className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">LinkedIn added</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(founder);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(founder.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFounder ? 'Edit Founder' : 'Add Founder'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="founder_name">Name *</Label>
              <Input
                id="founder_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founder_role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {FOUNDER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="founder_linkedin">LinkedIn URL (optional)</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="founder_linkedin"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Adding LinkedIn will enable AI profile enrichment
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.role}>
              {editingFounder ? 'Update' : 'Add'} Founder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FounderCards;
