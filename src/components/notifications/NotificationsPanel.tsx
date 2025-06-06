
import React, { useState } from 'react';
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
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Entretien demain',
    message: 'Entretien avec TechCorp prévu demain à 14h',
    time: '2h',
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Relance recommandée',
    message: '3 candidatures sans réponse depuis plus de 2 semaines',
    time: '4h',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Nouvelle offre détectée',
    message: 'Offre chez CloudCompany correspond à 94% à votre profil',
    time: '6h',
    read: true
  },
  {
    id: '4',
    type: 'success',
    title: 'Score amélioré',
    message: 'Votre score moyen a augmenté de 8 points',
    time: '1j',
    read: true
  }
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

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
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl lg:absolute lg:right-0 lg:top-16 lg:h-auto lg:max-h-96 lg:rounded-lg lg:border">
        <Card className="h-full lg:h-auto border-0 lg:border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
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
                    className="text-xs"
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
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    notification.read 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  )}
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
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
