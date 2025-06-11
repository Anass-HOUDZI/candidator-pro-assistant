
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Calendar, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const NotificationsPanel = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('reflection_reminders')
        .select(`
          *,
          reflections(title, type)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('scheduled_at', { ascending: true });

      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const typeIcons = {
    notification: Bell,
    email: Mail,
    push: Bell
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notifications et Rappels</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Rappel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un Rappel</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Fonctionnalité en développement</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((reminder) => {
          const IconComponent = typeIcons[reminder.reminder_type] || Bell;
          return (
            <Card key={reminder.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <CardTitle className="text-base">{reminder.reflections?.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{reminder.reminder_type}</Badge>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reminder.scheduled_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </span>
                  </div>
                  {reminder.message && (
                    <p className="text-sm text-gray-600">{reminder.message}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(reminder.scheduled_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {reminders.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rappel</h3>
            <p className="text-gray-600">Créez des rappels pour ne rien oublier</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
