
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
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
        .single();

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
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard de Candidatures
              </h1>
              <p className="text-gray-600 mt-2">
                Suivez vos performances et optimisez votre recherche d'emploi
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <MetricsCards />

        {/* Graphiques */}
        <CandidaturesChart />

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidatures récentes - 2/3 de la largeur */}
          <div className="lg:col-span-2">
            <RecentApplications />
          </div>
          
          {/* Panel d'alertes - 1/3 de la largeur */}
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Footer insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">Prochains Objectifs</h3>
            <ul className="space-y-2 text-sm">
              <li>• Atteindre {dashboardData.objectifs.candidatures} candidatures ce mois</li>
              <li>• Améliorer le taux de réponse à {dashboardData.objectifs.tauxReponse}%</li>
              <li>• Planifier {dashboardData.objectifs.entretiens} entretiens</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold mb-2">Performance Actuelle</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Candidatures:</span>
                <span className="font-semibold">{dashboardData.candidatures}</span>
              </div>
              <div className="flex justify-between">
                <span>Taux de réponse:</span>
                <span className="font-semibold">{dashboardData.tauxReponse}%</span>
              </div>
              <div className="flex justify-between">
                <span>Entretiens:</span>
                <span className="font-semibold">{dashboardData.entretiens}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-6 text-white animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-semibold mb-2">Progression</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Objectif candidatures:</span>
                <span className="font-semibold">{Math.round((dashboardData.candidatures / dashboardData.objectifs.candidatures) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Objectif entretiens:</span>
                <span className="font-semibold">{Math.round((dashboardData.entretiens / dashboardData.objectifs.entretiens) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Tendance:</span>
                <span className="font-semibold">📈 En cours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
