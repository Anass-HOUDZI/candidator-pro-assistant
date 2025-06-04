
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddEntrepriseDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    secteur: '',
    taille: '',
    localisation: '',
    siteWeb: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouvelle entreprise:', formData);
    
    toast({
      title: "Entreprise ajoutée",
      description: `${formData.nom} a été ajoutée à votre base d'entreprises.`,
    });
    
    setOpen(false);
    setFormData({
      nom: '',
      secteur: '',
      taille: '',
      localisation: '',
      siteWeb: '',
      description: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter entreprise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle entreprise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'entreprise</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              placeholder="Nom de l'entreprise"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secteur">Secteur d'activité</Label>
            <Select value={formData.secteur} onValueChange={(value) => setFormData({...formData, secteur: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un secteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technologie">Technologie</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Santé">Santé</SelectItem>
                <SelectItem value="Éducation">Éducation</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taille">Taille de l'entreprise</Label>
            <Select value={formData.taille} onValueChange={(value) => setFormData({...formData, taille: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Nombre d'employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employés</SelectItem>
                <SelectItem value="11-50">11-50 employés</SelectItem>
                <SelectItem value="51-200">51-200 employés</SelectItem>
                <SelectItem value="201-1000">201-1000 employés</SelectItem>
                <SelectItem value="1000+">1000+ employés</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="localisation">Localisation</Label>
            <Input
              id="localisation"
              value={formData.localisation}
              onChange={(e) => setFormData({...formData, localisation: e.target.value})}
              placeholder="Ville, région ou pays"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteWeb">Site web</Label>
            <Input
              id="siteWeb"
              value={formData.siteWeb}
              onChange={(e) => setFormData({...formData, siteWeb: e.target.value})}
              placeholder="https://exemple.com"
              type="url"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description de l'entreprise, notes..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Ajouter l'entreprise
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
