
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CandidaturesLayout } from '@/components/candidatures/CandidaturesLayout';
import { CandidaturesHeader } from '@/components/candidatures/CandidaturesHeader';
import { CandidatureFilters } from '@/components/candidatures/CandidatureFilters';
import { CandidaturesContent } from '@/components/candidatures/CandidaturesContent';
import { useCandidatures } from '@/hooks/useCandidatures';
import { useIsMobile } from '@/hooks/use-mobile';

const Candidatures = () => {
  const { candidatures, loading, refetch } = useCandidatures();
  const isMobile = useIsMobile();

  const handleFilterChange = (filters: any) => {
    console.log('Filters applied:', filters);
    // Here you would implement the actual filtering logic
  };

  const handleSearchChange = (search: string) => {
    console.log('Search term:', search);
    // Here you would implement the actual search logic
  };

  return (
    <AppLayout>
      <CandidaturesLayout>
        <CandidaturesHeader />

        <CandidatureFilters 
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        <CandidaturesContent
          candidatures={candidatures}
          loading={loading}
          isMobile={isMobile}
          onUpdate={refetch}
        />
      </CandidaturesLayout>
    </AppLayout>
  );
};

export default Candidatures;
