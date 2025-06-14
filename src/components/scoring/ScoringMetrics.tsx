
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';

interface ScoringMetricsProps {
  metrics: {
    scoreMoyen: number;
    meilleurMatch: number;
    tendance: number;
    analysesEffectuees: number;
  };
}

export const ScoringMetrics: React.FC<ScoringMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Score moyen</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{metrics.scoreMoyen}</p>
            </div>
            <Target className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Meilleur match</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{metrics.meilleurMatch}</p>
            </div>
            <Award className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Tendance</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">+{metrics.tendance}%</p>
            </div>
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Analyses effectuées</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{metrics.analysesEffectuees}</p>
            </div>
            <Zap className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
