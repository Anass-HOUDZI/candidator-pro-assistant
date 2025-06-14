
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { EntrepriseCard } from '@/components/entreprises/EntrepriseCard';

interface EntreprisesGridProps {
  entreprises: any[];
  loading: boolean;
  getCandidaturesCount: (nom: string) => number;
  onCardClick: (id: string) => void;
}

export const EntreprisesGrid: React.FC<EntreprisesGridProps> = ({
  entreprises,
  loading,
  getCandidaturesCount,
  onCardClick
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (entreprises.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-8 text-center text-gray-500">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Aucune entreprise trouvée</p>
          <p className="text-sm">Ajoutez votre première entreprise pour commencer !</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entreprises.map((entreprise) => {
        const candidaturesCount = getCandidaturesCount(entreprise.nom);
        return (
          <EntrepriseCard
            key={entreprise.id}
            entreprise={entreprise}
            candidaturesCount={candidaturesCount}
            onCardClick={onCardClick}
            priority={candidaturesCount > 2 ? 'Haute' : candidaturesCount > 0 ? 'Moyenne' : 'Faible'}
          />
        );
      })}
    </div>
  );
};
