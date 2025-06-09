import React from 'react';
import { TrendingUp, TrendingDown, Minus, Briefcase, Users, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon, color, isLoading = false }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border border-gray-100 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group border border-gray-100 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105",
              color === 'bg-blue-500' ? 'bg-blue-50 border border-blue-100' :
              color === 'bg-green-500' ? 'bg-emerald-50 border border-emerald-100' :
              color === 'bg-purple-500' ? 'bg-purple-50 border border-purple-100' :
              'bg-orange-50 border border-orange-100'
            )}>
              <div className={cn(
                "transition-colors duration-300",
                color === 'bg-blue-500' ? 'text-blue-600' :
                color === 'bg-green-500' ? 'text-emerald-600' :
                color === 'bg-purple-500' ? 'text-purple-600' :
                'text-orange-600'
              )}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 mb-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-semibold", getTrendColor())}>
                {Math.abs(change)}%
              </span>
            </div>
            <span className="text-xs text-gray-500">vs période précédente</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsCardsProps {
  candidatures: number;
  entretiens: number;
  offres: number;
  tauxReponse: number;
  isLoading?: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ 
  candidatures, 
  entretiens, 
  offres, 
  tauxReponse,
  isLoading = false 
}) => {
  // Calcul des changements (simulation basée sur les données actuelles)
  const getChangePercentage = (current: number) => {
    if (current === 0) return 0;
    // Simulation d'une variation basée sur la valeur actuelle
    return Math.floor(Math.random() * 20) - 10; // Entre -10% et +10%
  };

  const getTrend = (change: number): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  const metrics = [
    {
      title: 'Candidatures Envoyées',
      value: candidatures,
      change: getChangePercentage(candidatures),
      trend: getTrend(getChangePercentage(candidatures)),
      icon: <Briefcase className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Entretiens Planifiés',
      value: entretiens,
      change: getChangePercentage(entretiens),
      trend: getTrend(getChangePercentage(entretiens)),
      icon: <Users className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      title: 'Taux de Réponse',
      value: `${tauxReponse}%`,
      change: getChangePercentage(tauxReponse),
      trend: getTrend(getChangePercentage(tauxReponse)),
      icon: <Target className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Offres Reçues',
      value: offres,
      change: getChangePercentage(offres),
      trend: getTrend(getChangePercentage(offres)),
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={metric.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <MetricCard {...metric} isLoading={isLoading} />
        </div>
      ))}
    </div>
  );
};
