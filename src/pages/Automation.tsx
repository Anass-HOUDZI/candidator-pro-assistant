
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AddAutomationDialog } from '@/components/automation/AddAutomationDialog';
import { ConfigureAutomationDialog } from '@/components/automation/ConfigureAutomationDialog';
import { AutomationStats } from '@/components/automation/AutomationStats';
import { AutomationTemplates } from '@/components/automation/AutomationTemplates';
import { AutomationsList } from '@/components/automation/AutomationsList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Automation {
  id: string;
  nom: string;
  type: string;
  description: string | null;
  actif: boolean | null;
  frequence: string | null;
}

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

  const createFromTemplate = async (template: any) => {
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
      <div className="space-y-4 md:space-y-6 pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
              Automatisations
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Automatisez vos tâches répétitives et gagnez du temps
            </p>
          </div>
          <AddAutomationDialog />
        </div>

        {/* Statistiques */}
        <AutomationStats automations={automations} />

        {/* Templates d'automatisation */}
        <AutomationTemplates 
          automations={automations} 
          onCreateFromTemplate={createFromTemplate} 
        />

        {/* Automatisations existantes */}
        <AutomationsList
          automations={automations}
          loading={loading}
          onToggle={toggleAutomation}
          onDelete={handleDeleteAutomation}
          onConfigure={handleConfigureAutomation}
        />

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
