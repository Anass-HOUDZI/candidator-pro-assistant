
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

export const CandidaturesFilters = () => {
  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher par entreprise ou poste..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
