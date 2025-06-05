
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bot, Clock, Mail, CheckCircle, Settings, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddAutomationDialog } from '@/components/automation/AddAutomationDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Automatisation {
  id: string;
  nom: string;
  type: string;
  description: string | null;
  frequence: string | null;
  actif: boolean | null;
  created_at: string;
}

const Automation = () => {
  const [automatisations, setAutomatisations] = useState<Automatisation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAutomatisations();
  }, []);

  const fetchAutomatisations = async () => {
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
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAutomatisations(data || []);
    } catch (error) {
      console.error('Error fetching automatisations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les automatisations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomatisation = async (id: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('automatisations')
        .update({ actif: !currentStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh the list
      fetchAutomatisations();
      
      toast({
        title: "Succès",
        description: `Automatisation ${!currentStatus ? 'activée' : 'désactivée'}`
      });
    } catch (error) {
      console.error('Error toggling automatisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'automatisation",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automatisation</h1>
            <p className="text-gray-600 mt-2">Configurez et gérez vos processus automatisés</p>
          </div>
          <AddAutomationDialog />
        </div>

        {/* Stats d'automatisation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Automatisations actives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {automatisations.filter(a => a.actif).length}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total automatisations</p>
                  <p className="text-2xl font-bold text-gray-900">{automatisations.length}</p>
                </div>
                <Mail className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps économisé</p>
                  <p className="text-2xl font-bold text-gray-900">24h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de succès</p>
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflows actifs */}
        <Card>
          <CardHeader>
            <CardTitle>Workflows configurés</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : automatisations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune automatisation trouvée. Créez votre première automatisation !
              </div>
            ) : (
              <div className="space-y-4">
                {automatisations.map((automatisation) => (
                  <div key={automatisation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${automatisation.actif ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{automatisation.nom}</h3>
                        <p className="text-sm text-gray-600">
                          {automatisation.description || `Automatisation de type ${automatisation.type}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fréquence: {automatisation.frequence || 'Non définie'} • 
                          Créé le {new Date(automatisation.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Type: {automatisation.type}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          automatisation.actif 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {automatisation.actif ? 'Actif' : 'Inactif'}
                        </span>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleAutomatisation(automatisation.id, automatisation.actif)}
                        >
                          {automatisation.actif ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Templates d'automatisation */}
        <Card>
          <CardHeader>
            <CardTitle>Templates d'automatisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer">
                <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Relance Email</h3>
                <p className="text-sm text-gray-600">Automatise les relances de candidature</p>
              </div>
              
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer">
                <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Veille Emploi</h3>
                <p className="text-sm text-gray-600">Surveille les nouvelles offres</p>
              </div>
              
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer">
                <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Rapport Auto</h3>
                <p className="text-sm text-gray-600">Génère des rapports périodiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Automation;
