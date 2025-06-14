
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Calendar } from 'lucide-react';

interface StatsData {
  candidatures: number;
  entretiens: number;
  offres: number;
}

interface ProfileStatsProps {
  stats: StatsData;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <Mail className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.candidatures}</p>
              <p className="text-xs md:text-sm text-gray-600">Candidatures envoyées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
              <Phone className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.entretiens}</p>
              <p className="text-xs md:text-sm text-gray-600">Entretiens obtenus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.offres}</p>
              <p className="text-xs md:text-sm text-gray-600">Offres reçues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
