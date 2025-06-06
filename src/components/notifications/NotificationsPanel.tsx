
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Calendar,
  Mail,
  TrendingUp,
  CheckCircle,
  X,
  MoreHorizontal,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      generateNotifications();
    }
  }, [isOpen]);

  const generateNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Récupérer les candidatures
      const { data: candidatures, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (candidaturesError) throw candidaturesError;

      // Récupérer les entreprises
      const { data: entreprises, error: entreprisesError } = await supabase
        .from('entreprises')
        .select('*')
        .eq('user_id', user.id);

      if (entreprisesError) throw entreprisesError;

      const generatedNotifications: Notification[] = [];
      const totalCandidatures = candidatures?.length || 0;
      const entretiens = candidatures?.filter(c => c.statut === 'Entretien')?.length || 0;

      // Notifications pour entretiens
      if (entretiens > 0) {
        const prochainEntretien = candidatures?.find(c => c.statut === 'Entretien');
        if (prochainEntretien) {
          generatedNotifications.push({
            id: '1',
            type: 'urgent',
            title: 'Entretien prévu',
            message: `Entretien avec ${prochainEntretien.entreprise} pour le poste ${prochainEntretien.poste}`,
            time: '2h',
            read: false
          });
        }
      }

      // Notifications pour candidatures sans réponse
      const candidaturesSansReponse = candidatures?.filter(c => {
        const dateEnvoi = new Date(c.date_envoi || c.created_at);
        const maintenant = new Date();
        const joursEcoules = Math.floor((maintenant.getTime() - dateEnvoi.getTime()) / (1000 * 60 * 60 * 24));
        return c.statut === 'En cours' && joursEcoules > 14;
      })?.length || 0;

      if (candidaturesSansReponse > 0) {
        generatedNotifications.push({
          id: '2',
          type: 'warning',
          title: 'Relance recommandée',
          message: `${candidaturesSansReponse} candidature(s) sans réponse depuis plus de 2 semaines`,
          time: '4h',
          read: false
        });
      }

      // Notifications motivationnelles
      if (totalCandidatures === 0) {
        generatedNotifications.push({
          id: '3',
          type: 'info',
          title: 'Commencer vos candidatures',
          message: 'Ajoutez votre première candidature pour commencer le suivi',
          time: 'maintenant',
          read: false
        });
      } else if (totalCandidatures >= 10) {
        generatedNotifications.push({
          id: '4',
          type: 'success',
          title: 'Excellent rythme !',
          message: `Vous avez envoyé ${totalCandidatures} candidatures. Continuez comme ça !`,
          time: '1h',
          read: false
        });
      }

      // Notifications sur les nouvelles entreprises
      const entreprisesRecentes = entreprises?.filter(e => {
        const dateCreation = new Date(e.created_at);
        const maintenant = new Date();
        const joursEcoules = Math.floor((maintenant.getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24));
        return joursEcoules <= 7;
      })?.length || 0;

      if (entreprisesRecentes > 0) {
        generatedNotifications.push({
          id: '5',
          type: 'info',
          title: 'Nouvelles entreprises ajoutées',
          message: `${entreprisesRecentes} nouvelle(s) entreprise(s) ajoutée(s) cette semaine`,
          time: '6h',
          read: true
        });
      }

      // Notifications de succès pour offres reçues
      const offresRecues = candidatures?.filter(c => c.statut === 'Offre reçue')?.length || 0;
      if (offresRecues > 0) {
        generatedNotifications.push({
          id: '6',
          type: 'success',
          title: 'Offres reçues !',
          message: `Félicitations ! Vous avez ${offresRecues} offre(s) en attente`,
          time: '30min',
          read: false
        });
      }

      setNotifications(generatedNotifications);

    } catch (error) {
      console.error('Error generating notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <Calendar className="h-4 w-4 text-red-500" />;
      case 'warning': return <Mail className="h-4 w-4 text-yellow-500" />;
      case 'info': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay pour mobile */}
      <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl lg:absolute lg:right-0 lg:top-16 lg:h-auto lg:max-h-96 lg:rounded-lg lg:border animate-slide-in-right">
        <Card className="h-full lg:h-auto border-0 lg:border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs hover:bg-blue-50"
                  >
                    Tout marquer lu
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-sm">Tout est à jour !</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-md animate-fade-in",
                    notification.read 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={cn(
                            "text-sm font-medium",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          Il y a {notification.time}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 h-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
