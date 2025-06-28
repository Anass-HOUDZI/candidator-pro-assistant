import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { CandidaturesSearchBar } from './CandidaturesSearchBar';
import { StatusFilterButtons } from './StatusFilterButtons';
import { useCandidaturesFilters } from '@/hooks/useCandidaturesFilters';

interface CandidatureFiltersProps {
  onFilterChange: (filters: any) => void;
  onSearchChange: (search: string) => void;
}

const statusOptions = [
  { value: 'En cours', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  { value: 'Entretien', label: 'Entretien', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Offre reçue', label: 'Offre reçue', color: 'bg-green-100 text-green-800' },
  { value: 'Rejeté', label: 'Rejeté', color: 'bg-red-100 text-red-800' }
];

export const CandidatureFilters: React.FC<CandidatureFiltersProps> = ({ 
  onFilterChange, 
  onSearchChange 
}) => {
  const {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    activeFiltersCount
  } = useCandidaturesFilters();
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    updateFilter('searchTerm', value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    updateFilters({ [key]: value });
    onFilterChange(newFilters);
  };

  const handleStatusChange = (status: string) => {
    updateFilter('statut', status);
    onFilterChange({ ...filters, statut: status });
  };

  const handleClearFilters = () => {
    clearFilters();
    onFilterChange({
      statut: '',
      dateRange: '',
      priority: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    onSearchChange('');
  };

  return (
    <Card className="mb-6 shadow-soft border border-gray-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary-600" />
            Recherche et Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showAdvanced ? 'Masquer' : 'Filtres avancés'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CandidaturesSearchBar
          searchTerm={filters.searchTerm}
          onSearchChange={handleSearchChange}
        />

        <StatusFilterButtons
          statusOptions={statusOptions}
          selectedStatus={filters.statut}
          onStatusChange={handleStatusChange}
        />

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Période</label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Priorité</label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les priorités</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trier par</label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date de candidature</SelectItem>
                  <SelectItem value="company">Entreprise</SelectItem>
                  <SelectItem value="position">Poste</SelectItem>
                  <SelectItem value="status">Statut</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ordre</label>
              <Button
                variant="outline"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-start"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                {filters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              </Button>
            </div>
          </div>
        )}

        {activeFiltersCount > 0 && (
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Effacer les filtres
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
