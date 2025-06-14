
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, MapPin } from 'lucide-react';

interface StatsData {
  totalEntreprises: number;
  candidaturesEnvoyees: number;
  tauxSucces: number;
}

interface EntreprisesStatsProps {
  stats: StatsData;
}

export const EntreprisesStats: React.FC<EntreprisesStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total entreprises</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEntreprises}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '200ms' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Candidatures envoyées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.candidaturesEnvoyees}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de succès</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tauxSucces}%</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
