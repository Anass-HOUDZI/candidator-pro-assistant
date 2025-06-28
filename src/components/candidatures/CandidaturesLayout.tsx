
import React from 'react';

interface CandidaturesLayoutProps {
  children: React.ReactNode;
}

export const CandidaturesLayout: React.FC<CandidaturesLayoutProps> = ({ children }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {children}
    </div>
  );
};
