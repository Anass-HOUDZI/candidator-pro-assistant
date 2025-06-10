
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { CandidaturesChart } from '@/components/dashboard/CandidaturesChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState({
    candidatures: 0,
    entretiens: 0,
    offres: 0,
    tauxReponse: 0,
    objectifs: {
      candidatures: 30,
      entretiens: 10,
      tauxReponse: 40
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Récupérer les candidatures
      const { data: candidatures } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id);

      // Récupérer les objectifs de l'utilisateur
      const { data: objectifs } = await supabase
        .from('user_objectives')
        .select('*')
        .eq('user_id', user.id)
        .eq('mois_objectif', new Date().toISOString().slice(0, 7) + '-01')
        .maybeSingle();

      const totalCandidatures = candidatures?.length || 0;
      const entretiens = candidatures?.filter(c => c.statut === 'Entretien')?.length || 0;
      const offres = candidatures?.filter(c => c.statut === 'Offre reçue')?.length || 0;
      const tauxReponse = totalCandidatures > 0 ? Math.round((entretiens / totalCandidatures) * 100) : 0;

      setDashboardData({
        candidatures: totalCandidatures,
        entretiens,
        offres,
        tauxReponse,
        objectifs: {
          candidatures: objectifs?.objectif_candidatures || 30,
          entretiens: objectifs?.objectif_entretiens || 10,
          tauxReponse: objectifs?.objectif_taux_reponse || 40
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du dashboard",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer les pourcentages de progression
  const progressionCandidatures = dashboardData.objectifs.candidatures > 0 
    ? Math.round((dashboardData.candidatures / dashboardData.objectifs.candidatures) * 100) 
    : 0;
  
  const progressionEntretiens = dashboardData.objectifs.entretiens > 0 
    ? Math.round((dashboardData.entretiens / dashboardData.objectifs.entretiens) * 100) 
    : 0;

  const progressionTauxReponse = dashboardData.objectifs.tauxReponse > 0
    ? Math.round((dashboardData.tauxReponse / dashboardData.objectifs.tauxReponse) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="space-y-8 bg-gray-50 min-h-screen">
        {/* Header simplifié */}
        <div className="animate-fade-in">
          
        </div>

        {/* Métriques principales */}
        <MetricsCards 
          candidatures={dashboardData.candidatures} 
          entretiens={dashboardData.entretiens} 
          offres={dashboardData.offres} 
          tauxReponse={dashboardData.tauxReponse} 
          isLoading={isLoading} 
        />

        {/* Graphiques */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CandidaturesChart />
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {/* Candidatures récentes - 2/3 de la largeur */}
          <div className="lg:col-span-2">
            <RecentApplications />
          </div>
          
          {/* Panel d'alertes - 1/3 de la largeur */}
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Footer insights amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {/* Objectifs */}
          <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Objectifs</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Candidatures:</span>
                <span className="font-semibold text-gray-900">{dashboardData.objectifs.candidatures}/mois</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de réponse:</span>
                <span className="font-semibold text-gray-900">{dashboardData.objectifs.tauxReponse}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entretiens:</span>
                <span className="font-semibold text-gray-900">{dashboardData.objectifs.entretiens}/mois</span>
              </div>
            </div>
          </div>
          
          {/* Performance */}
          <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <span className="text-emerald-600 text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Candidatures:</span>
                <span className="font-semibold text-gray-900">{dashboardData.candidatures}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de réponse:</span>
                <span className="font-semibold text-gray-900">{dashboardData.tauxReponse}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entretiens:</span>
                <span className="font-semibold text-gray-900">{dashboardData.entretiens}</span>
              </div>
            </div>
          </div>
          
          {/* Progression */}
          <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <span className="text-orange-600 text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Progression</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Objectif candidatures:</span>
                <span className="font-semibold text-gray-900">{progressionCandidatures}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Objectif entretiens:</span>
                <span className="font-semibold text-gray-900">{progressionEntretiens}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Objectif taux réponse:</span>
                <span className="font-semibold text-gray-900">{progressionTauxReponse}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Statut:</span>
                <span className="font-semibold text-gray-900">
                  {dashboardData.candidatures > 0 ? '📈 Actif' : '📋 Inactif'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
