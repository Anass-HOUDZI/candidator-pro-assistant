
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { CandidaturesChart } from '@/components/dashboard/CandidaturesChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for MetricsCards - in a real app, this would come from your data source
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
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Vue d'ensemble de votre recherche d'emploi
          </p>
        </div>

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
