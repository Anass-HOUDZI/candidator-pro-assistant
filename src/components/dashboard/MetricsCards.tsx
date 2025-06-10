
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Users, Calendar, Award, Target } from 'lucide-react';

interface MetricsCardsProps {
  candidatures: number;
  entretiens: number;
  offres: number;
  tauxReponse: number;
  isLoading: boolean;
}

export const MetricsCards = ({ candidatures, entretiens, offres, tauxReponse, isLoading }: MetricsCardsProps) => {
  const metrics = [
    {
      title: "Candidatures",
      value: candidatures,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50/50 to-blue-100/30",
      change: "+12% vs mois dernier",
      isPositive: true
    },
    {
      title: "Entretiens",
      value: entretiens,
      icon: Calendar,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50/50 to-emerald-100/30",
      change: "+8% vs mois dernier",
      isPositive: true
    },
    {
      title: "Offres reçues",
      value: offres,
      icon: Award,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50/50 to-purple-100/30",
      change: "+15% vs mois dernier",
      isPositive: true
    },
    {
      title: "Taux de réponse",
      value: `${tauxReponse}%`,
      icon: Target,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50/50 to-orange-100/30",
      change: "-2% vs mois dernier",
      isPositive: false
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-4" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card 
            key={metric.title} 
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-large hover:shadow-xl transition-all duration-500 card-hover transform-gpu animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">
                {metric.value}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                {metric.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metric.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
            
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
