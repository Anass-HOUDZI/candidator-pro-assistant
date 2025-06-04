
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddCandidatureDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    entreprise: '',
    poste: '',
    salaire: '',
    localisation: '',
    description: '',
    priorite: 'Moyenne'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouvelle candidature:', formData);
    
    toast({
      title: "Candidature ajoutée",
      description: `Candidature pour ${formData.poste} chez ${formData.entreprise} créée avec succès.`,
    });
    
    setOpen(false);
    setFormData({
      entreprise: '',
      poste: '',
      salaire: '',
      localisation: '',
      description: '',
      priorite: 'Moyenne'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle candidature
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle candidature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entreprise">Entreprise</Label>
            <Input
              id="entreprise"
              value={formData.entreprise}
              onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
              placeholder="Nom de l'entreprise"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poste">Poste</Label>
            <Input
              id="poste"
              value={formData.poste}
              onChange={(e) => setFormData({...formData, poste: e.target.value})}
              placeholder="Intitulé du poste"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salaire">Salaire</Label>
            <Input
              id="salaire"
              value={formData.salaire}
              onChange={(e) => setFormData({...formData, salaire: e.target.value})}
              placeholder="ex: 45-55k€"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="localisation">Localisation</Label>
            <Input
              id="localisation"
              value={formData.localisation}
              onChange={(e) => setFormData({...formData, localisation: e.target.value})}
              placeholder="Ville ou région"
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
            <Label htmlFor="description">Description / Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Détails sur l'offre, notes personnelles..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Ajouter la candidature
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
