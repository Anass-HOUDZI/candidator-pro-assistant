
import React from 'react';

export const ProfileHeader = () => {
  return (
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
        Mon Profil
      </h1>
      <p className="text-sm md:text-base text-gray-600 mt-2">Gérez vos informations personnelles et préférences</p>
    </div>
  );
};
