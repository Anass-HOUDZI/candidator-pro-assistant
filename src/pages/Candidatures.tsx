
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CandidaturesHeader } from '@/components/candidatures/CandidaturesHeader';
import { CandidaturesFilters } from '@/components/candidatures/CandidaturesFilters';
import { CandidaturesContent } from '@/components/candidatures/CandidaturesContent';
import { useCandidatures } from '@/hooks/useCandidatures';
import { useIsMobile } from '@/hooks/use-mobile';

const Candidatures = () => {
  const { candidatures, loading, refetch } = useCandidatures();
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <CandidaturesHeader />

        {/* Filtres et recherche */}
        <CandidaturesFilters />

        {/* Liste des candidatures */}
        <CandidaturesContent
          candidatures={candidatures}
          loading={loading}
          isMobile={isMobile}
          onUpdate={refetch}
        />
      </div>
    </AppLayout>
  );
};

export default Candidatures;
