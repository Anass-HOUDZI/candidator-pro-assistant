
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { CandidaturesChart } from '@/components/dashboard/CandidaturesChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';

const Index = () => {
  const [dateRange, setDateRange] = useState('30');
  const [statusFilter, setStatusFilter] = useState('all');

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
          dateRange={dateRange}
          setDateRange={setDateRange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Metrics Cards */}
        <MetricsCards dateRange={dateRange} statusFilter={statusFilter} />

        {/* Charts and Recent Applications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-2">
            <CandidaturesChart dateRange={dateRange} />
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
