
import React from 'react';
import { AddCandidatureDialog } from '@/components/candidatures/AddCandidatureDialog';

export const CandidaturesHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mes Candidatures</h1>
      </div>
      <AddCandidatureDialog />
    </div>
  );
};
