
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EntreprisesFiltersProps {
  searchTerm: string;
  filterSecteur: string;
  secteurs: string[];
  onSearchChange: (value: string) => void;
  onSecteurChange: (value: string) => void;
}

export const EntreprisesFilters: React.FC<EntreprisesFiltersProps> = ({
  searchTerm,
  filterSecteur,
  secteurs,
  onSearchChange,
  onSecteurChange
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou secteur..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filterSecteur}
            onChange={(e) => onSecteurChange(e.target.value)}
          >
            <option value="">Tous les secteurs</option>
            {secteurs.map(secteur => (
              <option key={secteur} value={secteur}>{secteur}</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
