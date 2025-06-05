
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

export const AddAutomationDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    description: '',
    frequence: 'quotidien',
    actif: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une automatisation",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('automatisations')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Automatisation ajoutée avec succès"
      });

      setFormData({
        nom: '',
        type: '',
        description: '',
        frequence: 'quotidien',
        actif: true
      });
      
      setOpen(false);
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      console.error('Error adding automatisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'automatisation",
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
          Nouvelle automatisation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle automatisation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'automatisation *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type d'automatisation *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email automatique</SelectItem>
                <SelectItem value="relance">Relance candidature</SelectItem>
                <SelectItem value="veille">Veille emploi</SelectItem>
                <SelectItem value="rapport">Rapport automatique</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequence">Fréquence</Label>
            <Select value={formData.frequence} onValueChange={(value) => setFormData({...formData, frequence: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quotidien">Quotidien</SelectItem>
                <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                <SelectItem value="mensuel">Mensuel</SelectItem>
                <SelectItem value="unique">Une fois</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
