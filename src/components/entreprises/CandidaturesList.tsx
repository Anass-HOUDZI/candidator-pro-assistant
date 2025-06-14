
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface Candidature {
  id: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
}

interface CandidaturesListProps {
  candidatures: Candidature[];
}

export const CandidaturesList: React.FC<CandidaturesListProps> = ({ candidatures }) => {
  const getStatutColor = (statut: string | null) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Entretien planifié': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      case 'Accepté': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des candidatures</CardTitle>
      </CardHeader>
      <CardContent>
        {candidatures.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune candidature pour cette entreprise
          </div>
        ) : (
          <div className="space-y-4">
            {candidatures.map((candidature) => (
              <div key={candidature.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{candidature.poste}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>
                        {candidature.date_envoi 
                          ? new Date(candidature.date_envoi).toLocaleDateString('fr-FR')
                          : 'Date non définie'
                        }
                      </span>
                      {candidature.salaire && <span>{candidature.salaire}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatutColor(candidature.statut)}>
                      {candidature.statut || 'En cours'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
