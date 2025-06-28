
import { useState, useCallback } from 'react';

interface FilterState {
  searchTerm: string;
  statut: string;
  dateRange: string;
  priority: string;
  sortBy: string;
  sortOrder: string;
}

const initialFilters: FilterState = {
  searchTerm: '',
  statut: '',
  dateRange: '',
  priority: '',
  sortBy: 'date',
  sortOrder: 'desc'
};

export const useCandidaturesFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'sortBy' && key !== 'sortOrder' && key !== 'searchTerm'
  ).length;

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    activeFiltersCount
  };
};
