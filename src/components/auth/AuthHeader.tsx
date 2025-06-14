
import React from 'react';
import { Briefcase } from 'lucide-react';

export const AuthHeader = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-large">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
        JobTracker
      </h1>
      <p className="text-gray-600 mt-2 text-sm md:text-base">
        Votre assistant intelligent pour la recherche d'emploi
      </p>
    </div>
  );
};
