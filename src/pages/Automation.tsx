
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Search, 
  FileText, 
  Calendar,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  Plus,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AddAutomationDialog } from '@/components/automation/AddAutomationDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Automation {
  id: string;
  nom: string;
  type: string;
  description: string | null;
  actif: boolean | null;
  frequence: string | null;
}

const automationTemplates = [
  {
    id: 'relance-email',
    nom: 'Relance Email',
    description: 'Envoie automatiquement des emails de relance après X jours sans réponse',
    icon: Mail,
    color: 'bg-blue-500',
    type: 'email'
  },
  {
    id: 'veille-emploi',
    nom: 'Veille Emploi',
    description: 'Surveille les nouvelles offres correspondant à votre profil',
    icon: Search,
    color: 'bg-green-500',
    type: 'veille'
  },
  {
    id: 'rapport-auto',
    nom: 'Rapport Auto',
    description: 'Génère automatiquement un rapport hebdomadaire de vos candidatures',
    icon: FileText,
    color: 'bg-purple-500',
    type: 'rapport'
  },
  {
    id: 'rappel-entretien',
    nom: 'Rappel Entretien',
    description: 'Envoie des rappels avant vos entretiens programmés',
    icon: Calendar,
    color: 'bg-orange-500',
    type: 'rappel'
  }
];

const Automation = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Information",
          description: "Connectez-vous pour voir vos automatisations",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('automatisations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les automatisations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('automatisations')
        .update({ actif: !currentState })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAutomations(prev => 
        prev.map(auto => 
          auto.id === id ? { ...auto, actif: !currentState } : auto
        )
      );

      toast({
        title: "Automatisation mise à jour",
        description: `L'automatisation a été ${!currentState ? 'activée' : 'désactivée'}`,
      });
    } catch (error) {
      console.error('Error toggling automation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'automatisation",
        variant: "destructive"
      });
    }
  };

  const createFromTemplate = async (template: typeof automationTemplates[0]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('automatisations')
        .insert({
          nom: template.nom,
          type: template.type,
          description: template.description,
          user_id: user.id,
          actif: true,
          frequence: 'quotidien'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAutomations(prev => [data, ...prev]);

      toast({
        title: "Automatisation créée",
        description: `${template.nom} a été ajoutée et activée`,
      });
    } catch (error) {
      console.error('Error creating automation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'automatisation",
        variant: "destructive"
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'veille': return Search;
      case 'rapport': return FileText;
      case 'rappel': return Calendar;
      default: return Settings;
    }
  };

  const getStatusColor = (actif: boolean | null) => {
    return actif ? 'text-green-600' : 'text-red-600';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automatisations</h1>
            <p className="text-gray-600 mt-2">Automatisez vos tâches répétitives</p>
          </div>
          <AddAutomationDialog />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total automatisations</p>
                  <p className="text-2xl font-bold text-gray-900">{automations.length}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actives</p>
                  <p className="text-2xl font-bold text-green-600">
                    {automations.filter(a => a.actif).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En pause</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {automations.filter(a => !a.actif).length}
                  </p>
                </div>
                <Pause className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps économisé</p>
                  <p className="text-2xl font-bold text-purple-600">2.5h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates d'automatisation */}
        <Card>
          <CardHeader>
            <CardTitle>Templates d'automatisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {automationTemplates.map((template) => {
                const IconComponent = template.icon;
                const existingAutomation = automations.find(a => a.type === template.type);
                
                return (
                  <div
                    key={template.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all duration-200",
                      existingAutomation 
                        ? "bg-gray-50 border-gray-200" 
                        : "hover:shadow-md hover:scale-105 border-gray-200 hover:border-primary-300"
                    )}
                    onClick={() => !existingAutomation && createFromTemplate(template)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("p-2 rounded-lg", template.color)}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{template.nom}</h3>
                        {existingAutomation && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Déjà configuré
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    {!existingAutomation && (
                      <Button size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Automatisations existantes */}
        <Card>
          <CardHeader>
            <CardTitle>Mes automatisations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : automations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune automatisation configurée. Utilisez les templates ci-dessus pour commencer !
              </div>
            ) : (
              <div className="space-y-4">
                {automations.map((automation) => {
                  const IconComponent = getTypeIcon(automation.type);
                  return (
                    <div
                      key={automation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{automation.nom}</h3>
                          <p className="text-sm text-gray-600">{automation.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {automation.frequence || 'quotidien'}
                            </Badge>
                            <span className={cn("text-xs font-medium", getStatusColor(automation.actif))}>
                              {automation.actif ? 'Active' : 'En pause'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={automation.actif || false}
                          onCheckedChange={() => toggleAutomation(automation.id, automation.actif || false)}
                        />
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Automation;
