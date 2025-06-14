
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ReflectionsHeaderProps {
  onAddReflection: () => void;
}

export const ReflectionsHeader: React.FC<ReflectionsHeaderProps> = ({ onAddReflection }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
          Réflexions
        </h1>
        <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
          Gérez vos notes, analyses et stratégies de recherche d'emploi
        </p>
      </div>
      <Button 
        onClick={onAddReflection} 
        className="gap-2 w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Nouvelle Réflexion
      </Button>
    </div>
  );
};
