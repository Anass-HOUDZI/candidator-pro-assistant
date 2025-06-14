
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { CandidaturesChart } from '@/components/dashboard/CandidaturesChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState({
    candidatures: 0,
    entretiens: 0,
    offres: 0,
    tauxReponse: 0
  });

  useEffect(() => {
    // Simulate loading metrics data
    const timer = setTimeout(() => {
      setMetricsData({
        candidatures: 45,
        entretiens: 12,
        offres: 3,
        tauxReponse: 27
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Here you would typically update your data based on the filters
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
    // Here you would implement the export functionality
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Filters */}
        <DashboardFilters
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />

        {/* Metrics Cards */}
        <MetricsCards
          candidatures={metricsData.candidatures}
          entretiens={metricsData.entretiens}
          offres={metricsData.offres}
          tauxReponse={metricsData.tauxReponse}
          isLoading={isLoading}
        />

        {/* Charts and Recent Applications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-2">
            <CandidaturesChart />
          </div>
          <div className="xl:col-span-1">
            <RecentApplications />
          </div>
        </div>

        {/* Alerts Panel */}
        <AlertsPanel />
      </div>
    </AppLayout>
  );
};

export default Index;
