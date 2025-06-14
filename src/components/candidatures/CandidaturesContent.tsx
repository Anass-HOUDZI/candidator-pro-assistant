
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidatureTable } from '@/components/candidatures/CandidatureTable';
import { CandidatureCards } from '@/components/candidatures/CandidatureCards';

interface CandidaturesContentProps {
  candidatures: any[];
  loading: boolean;
  isMobile: boolean;
  onUpdate: () => void;
}

export const CandidaturesContent: React.FC<CandidaturesContentProps> = ({
  candidatures,
  loading,
  isMobile,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Candidatures récentes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : candidatures.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">Aucune candidature trouvée.</p>
            <p className="text-sm">Ajoutez votre première candidature !</p>
          </div>
        ) : isMobile ? (
          <CandidatureCards candidatures={candidatures} onUpdate={onUpdate} />
        ) : (
          <CandidatureTable candidatures={candidatures} onUpdate={onUpdate} />
        )}
      </CardContent>
    </Card>
  );
};
