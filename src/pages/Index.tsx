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
      <div className="space-y-8 bg-gradient-to-br from-gray-25 to-blue-25 min-h-screen">
        {/* Header avec gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 p-8 text-white animate-fade-in">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Bonjour ! 👋</h1>
            <p className="text-lg opacity-90">Voici un aperçu de vos activités de recherche d'emploi</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Métriques principales avec cards améliorées */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <MetricsCards 
            candidatures={dashboardData.candidatures} 
            entretiens={dashboardData.entretiens} 
            offres={dashboardData.offres} 
            tauxReponse={dashboardData.tauxReponse} 
            isLoading={isLoading} 
          />
        </div>

        {/* Graphiques avec design amélioré */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CandidaturesChart />
        </div>

        {/* Grille principale avec espacement amélioré */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="lg:col-span-2">
            <RecentApplications />
          </div>
          
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Footer insights avec design moderne */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {/* Objectifs avec design moderne */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 card-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Objectifs</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Candidatures:</span>
                  <span className="font-bold text-gray-900">{dashboardData.objectifs.candidatures}/mois</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Taux de réponse:</span>
                  <span className="font-bold text-gray-900">{dashboardData.objectifs.tauxReponse}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Entretiens:</span>
                  <span className="font-bold text-gray-900">{dashboardData.objectifs.entretiens}/mois</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance avec design moderne */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 card-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Candidatures:</span>
                  <span className="font-bold text-gray-900">{dashboardData.candidatures}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Taux de réponse:</span>
                  <span className="font-bold text-gray-900">{dashboardData.tauxReponse}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Entretiens:</span>
                  <span className="font-bold text-gray-900">{dashboardData.entretiens}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progression avec design moderne */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 card-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Progression</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Objectif candidatures:</span>
                    <span className="font-bold text-gray-900">{progressionCandidatures}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(progressionCandidatures, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Objectif entretiens:</span>
                    <span className="font-bold text-gray-900">{progressionEntretiens}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(progressionEntretiens, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Statut:</span>
                  <span className="font-bold text-gray-900">
                    {dashboardData.candidatures > 0 ? '📈 Actif' : '📋 Inactif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
