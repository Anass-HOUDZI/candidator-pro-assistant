import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Search, FileText, Calendar, Plus, Zap, Clock, CheckCircle, Pause } from 'lucide-react';
import { AddAutomationDialog } from '@/components/automation/AddAutomationDialog';
import { AutomationCard } from '@/components/automation/AutomationCard';
import { ConfigureAutomationDialog } from '@/components/automation/ConfigureAutomationDialog';
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
  const [configureAutomation, setConfigureAutomation] = useState<Automation | null>(null);
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false);
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
          description: "Connectez-vous pour voir vos automatisations"
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

      setAutomations(prev => prev.map(auto => 
        auto.id === id ? { ...auto, actif: !currentState } : auto
      ));

      toast({
        title: "Automatisation mise à jour",
        description: `L'automatisation a été ${!currentState ? 'activée' : 'désactivée'}`
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
        description: `${template.nom} a été ajoutée et activée`
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

  const handleDeleteAutomation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette automatisation ?')) return;

    try {
      const { error } = await supabase
        .from('automatisations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAutomations(prev => prev.filter(auto => auto.id !== id));
      toast({
        title: "Automatisation supprimée",
        description: "L'automatisation a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting automation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'automatisation",
        variant: "destructive"
      });
    }
  };

  const handleConfigureAutomation = (automation: Automation) => {
    setConfigureAutomation(automation);
    setIsConfigureDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
            Automatisations
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Automatisez vos tâches répétitives et gagnez du temps
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total automatisations</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{automations.length}</p>
                </div>
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Actives</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">
                    {automations.filter(a => a.actif).length}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">En pause</p>
                  <p className="text-lg md:text-2xl font-bold text-yellow-600">
                    {automations.filter(a => !a.actif).length}
                  </p>
                </div>
                <Pause className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Temps économisé</p>
                  <p className="text-lg md:text-2xl font-bold text-purple-600">
                    {Math.round(automations.filter(a => a.actif).length * 2.5)}h
                  </p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates d'automatisation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Templates d'automatisation</CardTitle>
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
                        <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm md:text-base">{template.nom}</h3>
                        {existingAutomation && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Déjà configuré
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-3">{template.description}</p>
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
            <CardTitle className="text-lg md:text-xl">Mes automatisations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : automations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-base md:text-lg font-medium mb-2">Aucune automatisation configurée</p>
                <p className="text-sm">Utilisez les templates ci-dessus pour commencer !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {automations.map((automation) => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggle={toggleAutomation}
                    onDelete={handleDeleteAutomation}
                    onConfigure={handleConfigureAutomation}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bouton flottant en bas pour mobile */}
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <AddAutomationDialog />
        </div>

        <ConfigureAutomationDialog
          automation={configureAutomation}
          open={isConfigureDialogOpen}
          onOpenChange={setIsConfigureDialogOpen}
          onUpdate={fetchAutomations}
        />
      </div>
    </AppLayout>
  );
};

export default Automation;
