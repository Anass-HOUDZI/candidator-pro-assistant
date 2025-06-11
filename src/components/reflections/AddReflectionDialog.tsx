
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReflectionAdded: () => void;
}

export const AddReflectionDialog = ({ open, onOpenChange, onReflectionAdded }: AddReflectionDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidatures, setCandidatures] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note_candidature',
    status: 'en_cours',
    priority: 'moyenne',
    candidature_id: 'none',
    due_date: null as Date | null,
    tags: ''
  });

  useEffect(() => {
    if (open) {
      fetchCandidatures();
    }
  }, [open]);

  const fetchCandidatures = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('candidatures')
        .select('id, poste, entreprise')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching candidatures:', error);
      } else {
        setCandidatures(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une réflexion",
          variant: "destructive"
        });
        return;
      }

      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const { error } = await supabase
        .from('reflections')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          status: formData.status,
          priority: formData.priority,
          candidature_id: formData.candidature_id === 'none' ? null : formData.candidature_id,
          due_date: formData.due_date ? formData.due_date.toISOString() : null,
          tags: tagsArray.length > 0 ? tagsArray : null
        });

      if (error) {
        console.error('Error creating reflection:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la réflexion",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Succès",
          description: "Réflexion créée avec succès"
        });
        onReflectionAdded();
        onOpenChange(false);
        setFormData({
          title: '',
          content: '',
          type: 'note_candidature',
          status: 'en_cours',
          priority: 'moyenne',
          candidature_id: 'none',
          due_date: null,
          tags: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Réflexion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de la réflexion"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note_candidature">Note sur candidature</SelectItem>
                  <SelectItem value="analyse_performance">Analyse de performance</SelectItem>
                  <SelectItem value="strategie_recherche">Stratégie de recherche</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Décrivez votre réflexion..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="archive">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basse">Basse</SelectItem>
                  <SelectItem value="moyenne">Moyenne</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date d'échéance</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "dd MMM yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {candidatures.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="candidature">Candidature liée (optionnel)</Label>
              <Select value={formData.candidature_id} onValueChange={(value) => setFormData({ ...formData, candidature_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une candidature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune candidature</SelectItem>
                  {candidatures.map((candidature: any) => (
                    <SelectItem key={candidature.id} value={candidature.id}>
                      {candidature.poste} - {candidature.entreprise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="recherche, entretien, négociation..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
