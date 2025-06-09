
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye, Edit, MoreHorizontal, Mail, Calendar, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Candidature {
  id: string;
  entreprise: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
  priorite: string | null;
  description?: string;
  localisation?: string;
}

interface CandidatureActionsProps {
  candidature: Candidature;
  onUpdate: () => void;
}

export const CandidatureActions: React.FC<CandidatureActionsProps> = ({ candidature, onUpdate }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidatures')
        .update({ statut: newStatus, updated_at: new Date().toISOString() })
        .eq('id', candidature.id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `La candidature est maintenant "${newStatus}"`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) return;

    try {
      const { error } = await supabase
        .from('candidatures')
        .delete()
        .eq('id', candidature.id);

      if (error) throw error;

      toast({
        title: "Candidature supprimée",
        description: "La candidature a été supprimée avec succès",
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting candidature:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la candidature",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (statut: string | null) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Entretien': return 'bg-purple-100 text-purple-800';
      case 'Refusée': return 'bg-red-100 text-red-800';
      case 'Offre reçue': return 'bg-green-100 text-green-800';
      case 'Accepté': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priorite: string | null) => {
    switch (priorite) {
      case 'Haute': return <Star className="h-4 w-4 text-yellow-500 fill-current" />;
      case 'Moyenne': return <Star className="h-4 w-4 text-gray-400" />;
      case 'Faible': return <Star className="h-4 w-4 text-gray-300" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bouton Voir détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Entreprise</label>
                <p className="text-lg font-semibold">{candidature.entreprise}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Poste</label>
                <p className="text-lg">{candidature.poste}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Statut</label>
                <Badge className={getStatusColor(candidature.statut)}>
                  {candidature.statut || 'En cours'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Priorité</label>
                <div className="flex items-center gap-2">
                  {getPriorityIcon(candidature.priorite)}
                  <span>{candidature.priorite || 'Non définie'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date d'envoi</label>
                <p>{candidature.date_envoi ? new Date(candidature.date_envoi).toLocaleDateString('fr-FR') : 'Non définie'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Salaire</label>
                <p>{candidature.salaire || 'Non spécifié'}</p>
              </div>
            </div>
            {candidature.localisation && (
              <div>
                <label className="text-sm font-medium text-gray-600">Localisation</label>
                <p>{candidature.localisation}</p>
              </div>
            )}
            {candidature.description && (
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm text-gray-700">{candidature.description}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bouton Éditer */}
      <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>

      {/* Menu actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatusChange('En cours')}>
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            Marquer en cours
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('Entretien')}>
            <Calendar className="h-4 w-4 mr-2" />
            Planifier entretien
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('Offre reçue')}>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Offre reçue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('Refusée')}>
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            Marquer refusée
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Mail className="h-4 w-4 mr-2" />
            Envoyer relance
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
