
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AddCandidatureDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    entreprise: '',
    poste: '',
    salaire: '',
    localisation: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'En cours',
    date_envoi: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une candidature",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('candidatures')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Candidature ajoutée avec succès"
      });

      setFormData({
        entreprise: '',
        poste: '',
        salaire: '',
        localisation: '',
        description: '',
        priorite: 'Moyenne',
        statut: 'En cours',
        date_envoi: new Date().toISOString().split('T')[0]
      });
      
      setOpen(false);
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      console.error('Error adding candidature:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la candidature",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle candidature
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle candidature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entreprise">Entreprise *</Label>
            <Input
              id="entreprise"
              value={formData.entreprise}
              onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poste">Poste *</Label>
            <Input
              id="poste"
              value={formData.poste}
              onChange={(e) => setFormData({...formData, poste: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salaire">Salaire</Label>
            <Input
              id="salaire"
              placeholder="ex: 45-55k€"
              value={formData.salaire}
              onChange={(e) => setFormData({...formData, salaire: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="localisation">Localisation</Label>
            <Input
              id="localisation"
              value={formData.localisation}
              onChange={(e) => setFormData({...formData, localisation: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priorite">Priorité</Label>
            <Select value={formData.priorite} onValueChange={(value) => setFormData({...formData, priorite: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basse">Basse</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Haute">Haute</SelectItem>
                <SelectItem value="Très haute">Très haute</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={formData.statut} onValueChange={(value) => setFormData({...formData, statut: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Entretien planifié">Entretien planifié</SelectItem>
                <SelectItem value="Refusé">Refusé</SelectItem>
                <SelectItem value="Accepté">Accepté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_envoi">Date d'envoi</Label>
            <Input
              id="date_envoi"
              type="date"
              value={formData.date_envoi}
              onChange={(e) => setFormData({...formData, date_envoi: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
