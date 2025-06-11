
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidatures, setCandidatures] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    content: '',
    candidature_id: '',
    priority: 'moyenne',
    due_date: null,
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

      const { data } = await supabase
        .from('candidatures')
        .select('id, entreprise, poste')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setCandidatures(data || []);
    } catch (error) {
      console.error('Error fetching candidatures:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase.from('reflections').insert({
        user_id: user.id,
        type: formData.type,
        title: formData.title,
        content: formData.content,
        candidature_id: formData.candidature_id || null,
        priority: formData.priority,
        due_date: formData.due_date,
        tags: tagsArray.length > 0 ? tagsArray : null
      });

      if (error) throw error;

      onReflectionAdded();
      setFormData({
        type: '',
        title: '',
        content: '',
        candidature_id: '',
        priority: 'moyenne',
        due_date: null,
        tags: ''
      });

    } catch (error) {
      console.error('Error creating reflection:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réflexion",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Réflexion</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type de réflexion *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note_candidature">Note sur candidature</SelectItem>
                  <SelectItem value="analyse_performance">Analyse de performance</SelectItem>
                  <SelectItem value="strategie_recherche">Stratégie de recherche</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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
          </div>

          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Titre de la réflexion"
            />
          </div>

          <div>
            <Label htmlFor="candidature">Candidature associée (optionnel)</Label>
            <Select value={formData.candidature_id} onValueChange={(value) => setFormData({...formData, candidature_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une candidature" />
              </SelectTrigger>
              <SelectContent>
                {candidatures.map((candidature) => (
                  <SelectItem key={candidature.id} value={candidature.id}>
                    {candidature.poste} - {candidature.entreprise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Décrivez votre réflexion..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date d'échéance (optionnel)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({...formData, due_date: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer la réflexion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
