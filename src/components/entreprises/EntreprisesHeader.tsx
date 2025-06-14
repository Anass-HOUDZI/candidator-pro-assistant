
import React from 'react';
import { AddEntrepriseDialog } from '@/components/entreprises/AddEntrepriseDialog';

export const EntreprisesHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
          Base Entreprises
        </h1>
      </div>
      <AddEntrepriseDialog />
    </div>
  );
};
