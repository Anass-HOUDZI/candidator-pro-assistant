
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { CandidatureActions } from '@/components/candidatures/CandidatureActions';

interface Candidature {
  id: string;
  entreprise: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
  priorite: string | null;
}

interface CandidatureCardsProps {
  candidatures: Candidature[];
  onUpdate: () => void;
}

const getStatutColor = (statut: string | null) => {
  switch (statut) {
    case 'En cours':
      return 'bg-blue-100 text-blue-800';
    case 'Entretien':
      return 'bg-purple-100 text-purple-800';
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'Refusée':
      return 'bg-red-100 text-red-800';
    case 'Accepté':
      return 'bg-emerald-100 text-emerald-800';
    case 'Offre reçue':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const CandidatureCards: React.FC<CandidatureCardsProps> = ({ candidatures, onUpdate }) => {
  return (
    <div className="grid gap-4">
      {candidatures.map((candidature) => (
        <Card key={candidature.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{candidature.entreprise}</h3>
                  <p className="text-sm text-gray-600 truncate">{candidature.poste}</p>
                </div>
                <CandidatureActions candidature={candidature} onUpdate={onUpdate} />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(candidature.statut)}`}>
                  {candidature.statut || 'En cours'}
                </span>
                
                {candidature.priorite && (
                  <div className="flex items-center gap-1">
                    <Star className={`h-3 w-3 ${
                      candidature.priorite === 'Haute' ? 'text-yellow-500 fill-current' :
                      candidature.priorite === 'Moyenne' ? 'text-gray-400' : 'text-gray-300'
                    }`} />
                    <span className="text-xs text-gray-600">{candidature.priorite}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {candidature.date_envoi ? 
                    new Date(candidature.date_envoi).toLocaleDateString('fr-FR') : 
                    'Date non définie'
                  }
                </span>
                <span>{candidature.salaire || 'Salaire non défini'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
