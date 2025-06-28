
import React, { useState, useEffect } from 'react';
import { MetricsCards } from './MetricsCards';

interface MetricsData {
  candidatures: number;
  entretiens: number;
  offres: number;
  tauxReponse: number;
}

export const DashboardMetrics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<MetricsData>({
    candidatures: 0,
    entretiens: 0,
    offres: 0,
    tauxReponse: 0
  });

  useEffect(() => {
    const loadMetrics = async () => {
      // Simulate loading metrics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetricsData({
        candidatures: 45,
        entretiens: 12,
        offres: 3,
        tauxReponse: 27
      });
      setIsLoading(false);
    };

    loadMetrics();
  }, []);

  return (
    <MetricsCards
      candidatures={metricsData.candidatures}
      entretiens={metricsData.entretiens}
      offres={metricsData.offres}
      tauxReponse={metricsData.tauxReponse}
      isLoading={isLoading}
    />
  );
};
