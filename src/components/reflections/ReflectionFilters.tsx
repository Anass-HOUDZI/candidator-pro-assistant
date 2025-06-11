
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ReflectionFiltersProps {
  filters: {
    type: string;
    status: string;
    priority: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const ReflectionFilters = ({ filters, onFiltersChange }: ReflectionFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Type</Label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="note_candidature">Notes sur candidature</SelectItem>
                <SelectItem value="analyse_performance">Analyses de performance</SelectItem>
                <SelectItem value="strategie_recherche">Stratégies de recherche</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Statut</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="archive">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priorité</Label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="basse">Basse</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
