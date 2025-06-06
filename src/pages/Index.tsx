
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

  return (
    <AppLayout>
      <div className="space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        {/* Header amélioré */}
        <div className="animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Dashboard de Candidatures
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                Suivez vos performances et optimisez votre recherche d'emploi
              </p>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
          </div>
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
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CandidaturesChart />
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '450ms' }}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                🎯 Prochains Objectifs
              </h3>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Atteindre {dashboardData.objectifs.candidatures} candidatures ce mois
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Améliorer le taux de réponse à {dashboardData.objectifs.tauxReponse}%
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Planifier {dashboardData.objectifs.entretiens} entretiens
                </li>
              </ul>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                📊 Performance Actuelle
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Candidatures:</span>
                  <span className="text-lg font-bold bg-white/20 px-2 py-1 rounded-lg">
                    {dashboardData.candidatures}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Taux de réponse:</span>
                  <span className="text-lg font-bold bg-white/20 px-2 py-1 rounded-lg">
                    {dashboardData.tauxReponse}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Entretiens:</span>
                  <span className="text-lg font-bold bg-white/20 px-2 py-1 rounded-lg">
                    {dashboardData.entretiens}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-pink-600 to-rose-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                🚀 Progression
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Objectif candidatures:</span>
                  <span className="text-lg font-bold bg-white/20 px-2 py-1 rounded-lg">
                    {Math.round((dashboardData.candidatures / dashboardData.objectifs.candidatures) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Objectif entretiens:</span>
                  <span className="text-lg font-bold bg-white/20 px-2 py-1 rounded-lg">
                    {Math.round((dashboardData.entretiens / dashboardData.objectifs.entretiens) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tendance:</span>
                  <span className="text-lg font-bold bg-white/20 px-2 py-1 rounded-lg">
                    {dashboardData.candidatures > 0 ? '📈 En progression' : '📋 Démarrer'}
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
