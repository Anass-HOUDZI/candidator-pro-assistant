
import { useState, useCallback } from 'react';

interface FilterState {
  period: string;
  dateRange?: { from?: Date; to?: Date };
}

export const useDashboardFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    period: 'month'
  });

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleFilterChange = useCallback((filterData: any) => {
    console.log('Filters changed:', filterData);
    updateFilters(filterData);
  }, [updateFilters]);

  const handleExport = useCallback(() => {
    console.log('Exporting dashboard data...');
    // Implementation for export functionality
  }, []);

  return {
    filters,
    handleFilterChange,
    handleExport
  };
};
