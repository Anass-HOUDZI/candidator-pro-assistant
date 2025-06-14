
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Entreprise {
  id: string;
  nom: string;
  secteur: string | null;
  taille: string | null;
  localisation: string | null;
  description: string | null;
  site_web: string | null;
}

interface Candidature {
  id: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
}

interface EntrepriseOverviewProps {
  entreprise: Entreprise;
  candidatures: Candidature[];
}

export const EntrepriseOverview: React.FC<EntrepriseOverviewProps> = ({ 
  entreprise, 
  candidatures 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Description */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>À propos de l'entreprise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {entreprise.description || 'Aucune description disponible pour cette entreprise.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques rapides */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{candidatures.length}</div>
              <div className="text-sm text-gray-600">Candidatures</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {candidatures.filter(c => c.statut === 'Entretien planifié').length}
              </div>
              <div className="text-sm text-gray-600">Entretiens</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">32%</div>
              <div className="text-sm text-gray-600">Taux de réponse</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
