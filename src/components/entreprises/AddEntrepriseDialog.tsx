
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AddEntrepriseDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nom: '',
    secteur: '',
    taille: '',
    localisation: '',
    site_web: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une entreprise",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('entreprises')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Entreprise ajoutée avec succès"
      });

      setFormData({
        nom: '',
        secteur: '',
        taille: '',
        localisation: '',
        site_web: '',
        description: ''
      });
      
      setOpen(false);
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      console.error('Error adding entreprise:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'entreprise",
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
          Ajouter entreprise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle entreprise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'entreprise *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secteur">Secteur d'activité</Label>
            <Input
              id="secteur"
              value={formData.secteur}
              onChange={(e) => setFormData({...formData, secteur: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taille">Taille de l'entreprise</Label>
            <Input
              id="taille"
              placeholder="ex: 50-200 employés"
              value={formData.taille}
              onChange={(e) => setFormData({...formData, taille: e.target.value})}
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
            <Label htmlFor="site_web">Site web</Label>
            <Input
              id="site_web"
              type="url"
              placeholder="https://..."
              value={formData.site_web}
              onChange={(e) => setFormData({...formData, site_web: e.target.value})}
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
