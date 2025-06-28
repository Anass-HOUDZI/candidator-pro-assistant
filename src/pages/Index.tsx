
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardChartsSection } from '@/components/dashboard/DashboardChartsSection';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';

const Index = () => {
  const { handleFilterChange, handleExport } = useDashboardFilters();

  return (
    <AppLayout>
      <DashboardLayout>
        <DashboardHeader />
        
        <DashboardFilters
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />

        <DashboardMetrics />

        <DashboardChartsSection />

        <AlertsPanel />
      </DashboardLayout>
    </AppLayout>
  );
};

export default Index;
