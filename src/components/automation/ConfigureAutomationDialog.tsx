
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Automation {
  id: string;
  nom: string;
  type: string;
  description: string | null;
  actif: boolean | null;
  frequence: string | null;
}

interface ConfigureAutomationDialogProps {
  automation: Automation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const ConfigureAutomationDialog: React.FC<ConfigureAutomationDialogProps> = ({
  automation,
  open,
  onOpenChange,
  onUpdate
}) => {
  const [nom, setNom] = useState(automation?.nom || '');
  const [description, setDescription] = useState(automation?.description || '');
  const [frequence, setFrequence] = useState(automation?.frequence || 'quotidien');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (automation) {
      setNom(automation.nom);
      setDescription(automation.description || '');
      setFrequence(automation.frequence || 'quotidien');
    }
  }, [automation]);

  const handleSave = async () => {
    if (!automation) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('automatisations')
        .update({
          nom,
          description,
          frequence,
          updated_at: new Date().toISOString()
        })
        .eq('id', automation.id);

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "L'automatisation a été configurée avec succès",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating automation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurer l'automatisation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de l'automatisation"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'automatisation"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="frequence">Fréquence</Label>
            <Select value={frequence} onValueChange={setFrequence}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quotidien">Quotidien</SelectItem>
                <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                <SelectItem value="mensuel">Mensuel</SelectItem>
                <SelectItem value="manuel">Manuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
