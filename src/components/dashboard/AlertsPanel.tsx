
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Mail,
  CheckCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  action?: string;
  time: string;
  icon: React.ReactNode;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Entretien demain',
    message: 'Entretien avec TechCorp prévu demain à 14h - Préparer questions techniques',
    action: 'Réviser',
    time: '2h',
    icon: <Calendar className="h-4 w-4" />
  },
  {
    id: '2',
    type: 'warning',
    title: 'Relance recommandée',
    message: '3 candidatures sans réponse depuis plus de 2 semaines',
    action: 'Relancer',
    time: '4h',
    icon: <Mail className="h-4 w-4" />
  },
  {
    id: '3',
    type: 'info',
    title: 'Opportunité détectée',
    message: 'Nouvelle offre chez CloudCompany correspond à 94% à votre profil',
    action: 'Voir offre',
    time: '6h',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    id: '4',
    type: 'success',
    title: 'Score amélioré',
    message: 'Votre score moyen a augmenté de 8 points ce mois-ci',
    time: '1j',
    icon: <CheckCircle className="h-4 w-4" />
  }
];

const getAlertConfig = (type: string) => {
  const configs = {
    urgent: { 
      color: 'border-l-red-500 bg-red-50', 
      badgeColor: 'bg-red-100 text-red-800',
      iconColor: 'text-red-500' 
    },
    warning: { 
      color: 'border-l-yellow-500 bg-yellow-50', 
      badgeColor: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-500' 
    },
    info: { 
      color: 'border-l-blue-500 bg-blue-50', 
      badgeColor: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-500' 
    },
    success: { 
      color: 'border-l-green-500 bg-green-50', 
      badgeColor: 'bg-green-100 text-green-800',
      iconColor: 'text-green-500' 
    }
  };
  return configs[type as keyof typeof configs] || configs.info;
};

export const AlertsPanel: React.FC = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Alertes & Notifications
          </CardTitle>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {alerts.filter(a => a.type === 'urgent').length} urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => {
          const config = getAlertConfig(alert.type);
          return (
            <div
              key={alert.id}
              className={cn(
                "relative p-4 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md",
                config.color
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={cn("mt-0.5", config.iconColor)}>
                    {alert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      <Badge className={cn("text-xs", config.badgeColor)}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Il y a {alert.time}
                      </span>
                      {alert.action && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7"
                        >
                          {alert.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full" size="sm">
            Voir toutes les notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
