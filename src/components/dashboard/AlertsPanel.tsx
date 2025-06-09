
import React, { useState, useEffect } from 'react';
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
  X,
  Target,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  action?: string;
  time: string;
  icon: React.ReactNode;
}

const getAlertConfig = (type: string) => {
  const configs = {
    urgent: { 
      color: 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100', 
      badgeColor: 'bg-red-100 text-red-800',
      iconColor: 'text-red-500' 
    },
    warning: { 
      color: 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100', 
      badgeColor: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-500' 
    },
    info: { 
      color: 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100', 
      badgeColor: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-500' 
    },
    success: { 
      color: 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100', 
      badgeColor: 'bg-green-100 text-green-800',
      iconColor: 'text-green-500' 
    }
  };
  return configs[type as keyof typeof configs] || configs.info;
};

export const AlertsPanel: React.FC = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertsData();
  }, []);

  const fetchAlertsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Récupérer les candidatures
      const { data: candidatures, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (candidaturesError) throw candidaturesError;

      const generatedAlerts: Alert[] = [];
      const totalCandidatures = candidatures?.length || 0;
      const entretiens = candidatures?.filter(c => c.statut === 'Entretien')?.length || 0;
      const enCours = candidatures?.filter(c => c.statut === 'En cours')?.length || 0;

      // Vérifier s'il y a des entretiens prévus bientôt
      const prochainEntretien = candidatures?.find(c => c.statut === 'Entretien');
      if (prochainEntretien) {
        generatedAlerts.push({
          id: '1',
          type: 'urgent',
          title: 'Entretien prévu',
          message: `Entretien avec ${prochainEntretien.entreprise} pour le poste ${prochainEntretien.poste}`,
          action: 'Préparer',
          time: '2h',
          icon: <Calendar className="h-4 w-4" />
        });
      }

      // Alertes pour candidatures sans réponse
      const candidaturesSansReponse = candidatures?.filter(c => {
        const dateEnvoi = new Date(c.date_envoi || c.created_at);
        const maintenant = new Date();
        const joursEcoules = Math.floor((maintenant.getTime() - dateEnvoi.getTime()) / (1000 * 60 * 60 * 24));
        return c.statut === 'En cours' && joursEcoules > 14;
      })?.length || 0;

      if (candidaturesSansReponse > 0) {
        generatedAlerts.push({
          id: '2',
          type: 'warning',
          title: 'Relance recommandée',
          message: `${candidaturesSansReponse} candidature(s) sans réponse depuis plus de 2 semaines`,
          action: 'Relancer',
          time: '4h',
          icon: <Mail className="h-4 w-4" />
        });
      }

      // Alertes de motivation
      if (totalCandidatures === 0) {
        generatedAlerts.push({
          id: '3',
          type: 'info',
          title: 'Commencer vos candidatures',
          message: 'Ajoutez votre première candidature pour commencer le suivi',
          action: 'Ajouter',
          time: 'maintenant',
          icon: <Target className="h-4 w-4" />
        });
      } else if (totalCandidatures < 5) {
        generatedAlerts.push({
          id: '4',
          type: 'info',
          title: 'Accélérer le rythme',
          message: 'Vous avez un bon début, continuez à ajouter des candidatures',
          action: 'Voir objectifs',
          time: '1h',
          icon: <TrendingUp className="h-4 w-4" />
        });
      }

      // Alertes de succès
      if (entretiens > 0) {
        generatedAlerts.push({
          id: '5',
          type: 'success',
          title: 'Excellent travail!',
          message: `Vous avez ${entretiens} entretien(s) programmé(s)`,
          time: '30min',
          icon: <CheckCircle className="h-4 w-4" />
        });
      }

      // Alerte objectifs mensuels
      const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const candidaturesThisMonth = candidatures?.filter(c => {
        const candidatureMonth = new Date(c.date_envoi || c.created_at).toISOString().slice(0, 7);
        return candidatureMonth === thisMonth;
      })?.length || 0;

      if (candidaturesThisMonth >= 10) {
        generatedAlerts.push({
          id: '6',
          type: 'success',
          title: 'Objectif mensuel atteint',
          message: `${candidaturesThisMonth} candidatures ce mois-ci - Excellent rythme!`,
          time: '1j',
          icon: <CheckCircle className="h-4 w-4" />
        });
      }

      setAlerts(generatedAlerts);

    } catch (error) {
      console.error('Error fetching alerts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleViewAllNotifications = () => {
    toast({
      title: "Notifications complètes",
      description: "Affichage de toutes les notifications dans le panneau principal",
    });
    // You can add navigation logic here if needed
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const urgentAlerts = alerts.filter(a => a.type === 'urgent').length;

  return (
    <Card className="animate-fade-in shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertes & Notifications
          </CardTitle>
          {urgentAlerts > 0 && (
            <Badge className="bg-red-50 text-red-700 font-medium px-2 py-1 text-xs border border-red-200">
              {urgentAlerts} urgent{urgentAlerts > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {alerts.length > 0 ? alerts.map((alert, index) => {
          const config = getAlertConfig(alert.type);
          return (
            <div
              key={alert.id}
              className={cn(
                "relative p-3 border-l-3 rounded-r-lg transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 animate-fade-in",
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
                      <Badge className={cn("text-xs font-medium", config.badgeColor)}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
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
                          className="text-xs h-6 px-2 text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300"
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
                  onClick={() => removeAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 h-auto hover:bg-gray-50 rounded-md"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium text-gray-500 mb-1">Tout est sous contrôle!</p>
            <p className="text-sm text-gray-400">Aucune alerte pour le moment</p>
          </div>
        )}
        
        {alerts.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <Button 
              variant="ghost" 
              className="w-full font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group" 
              size="sm"
              onClick={handleViewAllNotifications}
            >
              Voir toutes les notifications
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
