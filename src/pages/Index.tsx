import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { CandidaturesChart } from '@/components/dashboard/CandidaturesChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const Index = () => {
  const {
    toast
  } = useToast();
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
  const [filters, setFilters] = useState({});
  useEffect(() => {
    fetchDashboardData();
  }, [filters]);
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Récupérer les candidatures
      const {
        data: candidatures
      } = await supabase.from('candidatures').select('*').eq('user_id', user.id);

      // Récupérer les objectifs de l'utilisateur
      const {
        data: objectifs
      } = await supabase.from('user_objectives').select('*').eq('user_id', user.id).eq('mois_objectif', new Date().toISOString().slice(0, 7) + '-01').maybeSingle();
      const totalCandidatures = candidatures?.length || 0;
      const entretiens = candidatures?.filter(c => c.statut === 'Entretien')?.length || 0;
      const offres = candidatures?.filter(c => c.statut === 'Offre reçue')?.length || 0;
      const tauxReponse = totalCandidatures > 0 ? Math.round(entretiens / totalCandidatures * 100) : 0;
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
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Votre rapport est en cours de génération..."
    });
    // Logique d'export à implémenter
  };

  // Calculer les pourcentages de progression
  const progressionCandidatures = dashboardData.objectifs.candidatures > 0 ? Math.round(dashboardData.candidatures / dashboardData.objectifs.candidatures * 100) : 0;
  const progressionEntretiens = dashboardData.objectifs.entretiens > 0 ? Math.round(dashboardData.entretiens / dashboardData.objectifs.entretiens * 100) : 0;
  const progressionTauxReponse = dashboardData.objectifs.tauxReponse > 0 ? Math.round(dashboardData.tauxReponse / dashboardData.objectifs.tauxReponse * 100) : 0;
  return <AppLayout>
      <div className="space-y-8 min-h-screen">
        {/* Background avec dégradé moderne */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-25 via-blue-25/30 to-purple-25/20 -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 -z-10" />

        {/* Header amélioré avec logo animé */}
        

        {/* Filtres et options d'export */}
        <div className="animate-fade-in" style={{
        animationDelay: '50ms'
      }}>
          <DashboardFilters onFilterChange={handleFilterChange} onExport={handleExport} />
        </div>

        {/* Métriques principales avec cartes 3D améliorées */}
        <div className="animate-fade-in" style={{
        animationDelay: '100ms'
      }}>
          <MetricsCards candidatures={dashboardData.candidatures} entretiens={dashboardData.entretiens} offres={dashboardData.offres} tauxReponse={dashboardData.tauxReponse} isLoading={isLoading} />
        </div>

        {/* Graphiques avec design amélioré */}
        <div className="animate-fade-in" style={{
        animationDelay: '200ms'
      }}>
          <CandidaturesChart />
        </div>

        {/* Grille principale avec espacement amélioré */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{
        animationDelay: '300ms'
      }}>
          <div className="lg:col-span-2">
            <RecentApplications />
          </div>
          
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Cards d'objectifs, performance et progression avec effet 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 animate-fade-in" style={{
        animationDelay: '400ms'
      }}>
          {/* Objectifs avec design moderne et effet 3D */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-large border border-gray-100/50 hover:shadow-xl transition-all duration-500 card-hover transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Objectifs</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
                  <span className="text-sm font-medium text-gray-600">Candidatures:</span>
                  <span className="font-bold text-gray-900">{dashboardData.objectifs.candidatures}/mois</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
                  <span className="text-sm font-medium text-gray-600">Taux de réponse:</span>
                  <span className="font-bold text-gray-900">{dashboardData.objectifs.tauxReponse}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
                  <span className="text-sm font-medium text-gray-600">Entretiens:</span>
                  <span className="font-bold text-gray-900">{dashboardData.objectifs.entretiens}/mois</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance avec design moderne et effet 3D */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-large border border-gray-100/50 hover:shadow-xl transition-all duration-500 card-hover transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
                  <span className="text-sm font-medium text-gray-600">Candidatures:</span>
                  <span className="font-bold text-gray-900">{dashboardData.candidatures}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
                  <span className="text-sm font-medium text-gray-600">Taux de réponse:</span>
                  <span className="font-bold text-gray-900">{dashboardData.tauxReponse}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
                  <span className="text-sm font-medium text-gray-600">Entretiens:</span>
                  <span className="font-bold text-gray-900">{dashboardData.entretiens}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progression avec design moderne et effet 3D */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-large border border-gray-100/50 hover:shadow-xl transition-all duration-500 card-hover transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out transform-gpu" style={{
                    width: `${Math.min(progressionCandidatures, 100)}%`
                  }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Objectif entretiens:</span>
                    <span className="font-bold text-gray-900">{progressionEntretiens}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out transform-gpu" style={{
                    width: `${Math.min(progressionEntretiens, 100)}%`
                  }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-100/80">
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
    </AppLayout>;
};
export default Index;