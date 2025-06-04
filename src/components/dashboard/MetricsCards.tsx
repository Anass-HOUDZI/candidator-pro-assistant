
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
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon, color }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className={cn("absolute top-0 left-0 w-full h-1", color)} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-3 rounded-xl", `${color.replace('bg-', 'bg-').replace('-500', '-100')}`)}>
              <div className={cn("text-current", color.replace('bg-', 'text-'))}>{icon}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {Math.abs(change)}%
              </span>
            </div>
            <span className="text-xs text-gray-500 mt-1">vs mois dernier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricsCards: React.FC = () => {
  const metrics = [
    {
      title: 'Candidatures Envoyées',
      value: 24,
      change: 12,
      trend: 'up' as const,
      icon: <Briefcase className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Entretiens Planifiés',
      value: 8,
      change: 25,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      title: 'Taux de Réponse',
      value: '33%',
      change: 8,
      trend: 'up' as const,
      icon: <Target className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Offres Reçues',
      value: 3,
      change: -5,
      trend: 'down' as const,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={metric.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  );
};
