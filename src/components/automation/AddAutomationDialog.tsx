
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddAutomationDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    description: '',
    frequence: 'quotidien',
    actif: true
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouvelle automatisation:', formData);
    
    toast({
      title: "Automatisation créée",
      description: `L'automatisation "${formData.nom}" a été configurée avec succès.`,
    });
    
    setOpen(false);
    setFormData({
      nom: '',
      type: '',
      description: '',
      frequence: 'quotidien',
      actif: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Nouvelle automatisation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle automatisation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'automatisation</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              placeholder="Nom de votre automatisation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type d'automatisation</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relance-email">Relance Email</SelectItem>
                <SelectItem value="veille-emploi">Veille Emploi</SelectItem>
                <SelectItem value="rapport-auto">Rapport Automatique</SelectItem>
                <SelectItem value="linkedin-outreach">LinkedIn Outreach</SelectItem>
                <SelectItem value="suivi-candidature">Suivi Candidature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequence">Fréquence d'exécution</Label>
            <Select value={formData.frequence} onValueChange={(value) => setFormData({...formData, frequence: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quotidien">Quotidien</SelectItem>
                <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                <SelectItem value="mensuel">Mensuel</SelectItem>
                <SelectItem value="sur-evenement">Sur événement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Décrivez ce que fait cette automatisation..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Créer l'automatisation
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
