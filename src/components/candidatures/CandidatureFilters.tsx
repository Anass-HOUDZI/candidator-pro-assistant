
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';

interface CandidatureFiltersProps {
  onFilterChange: (filters: any) => void;
  onSearchChange: (search: string) => void;
}

export const CandidatureFilters = ({ onFilterChange, onSearchChange }: CandidatureFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>({
    statut: '',
    dateRange: '',
    priority: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'En cours', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
    { value: 'Entretien', label: 'Entretien', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Offre reçue', label: 'Offre reçue', color: 'bg-green-100 text-green-800' },
    { value: 'Rejeté', label: 'Rejeté', color: 'bg-red-100 text-red-800' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      statut: '',
      dateRange: '',
      priority: '',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setSelectedFilters(clearedFilters);
    setSearchTerm('');
    onFilterChange(clearedFilters);
    onSearchChange('');
  };

  const activeFiltersCount = Object.values(selectedFilters).filter(value => value && value !== 'date' && value !== 'desc').length;

  return (
    <Card className="mb-6 shadow-soft border border-gray-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary-600" />
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
        {/* Barre de recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par entreprise, poste, ou mots-clés..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white/80 backdrop-blur-sm border-gray-200 focus:border-primary-500 focus:ring-primary-500"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearchChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              variant={selectedFilters.statut === status.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('statut', selectedFilters.statut === status.value ? '' : status.value)}
              className="text-xs"
            >
              {status.label}
            </Button>
          ))}
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Période</label>
              <Select value={selectedFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
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
              <Select value={selectedFilters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
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
              <Select value={selectedFilters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
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
                onClick={() => handleFilterChange('sortOrder', selectedFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-start"
              >
                {selectedFilters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                {selectedFilters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        {activeFiltersCount > 0 && (
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Effacer les filtres
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
