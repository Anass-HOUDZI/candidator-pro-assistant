
import React from 'react';

export const DashboardHeader = () => {
  return (
    <div className="space-y-2 md:space-y-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
        Dashboard
      </h1>
      <p className="text-sm md:text-base text-gray-600">
        Vue d'ensemble de votre recherche d'emploi
      </p>
    </div>
  );
};
