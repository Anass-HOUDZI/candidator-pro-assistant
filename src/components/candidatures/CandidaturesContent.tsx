
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidatureTable } from '@/components/candidatures/CandidatureTable';
import { CandidatureCards } from '@/components/candidatures/CandidatureCards';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';

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
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (candidatures.length === 0) {
      return (
        <EmptyState
          icon={<FileText className="h-16 w-16 mx-auto text-gray-300" />}
          title="Aucune candidature trouvée"
          description="Ajoutez votre première candidature !"
        />
      );
    }

    return isMobile ? (
      <CandidatureCards candidatures={candidatures} onUpdate={onUpdate} />
    ) : (
      <CandidatureTable candidatures={candidatures} onUpdate={onUpdate} />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Candidatures récentes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
