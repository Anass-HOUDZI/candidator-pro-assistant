
import React from 'react';
import { CandidaturesChart } from './CandidaturesChart';
import { RecentApplications } from './RecentApplications';

export const DashboardChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      <div className="xl:col-span-2">
        <CandidaturesChart />
      </div>
      <div className="xl:col-span-1">
        <RecentApplications />
      </div>
    </div>
  );
};
