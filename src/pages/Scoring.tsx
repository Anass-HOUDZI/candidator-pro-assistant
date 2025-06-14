
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyzeOffersDialog } from '@/components/scoring/AnalyzeOffersDialog';
import { ScoringMetrics } from '@/components/scoring/ScoringMetrics';
import { ScoringTable } from '@/components/scoring/ScoringTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Scoring = () => {
  const { toast } = useToast();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    scoreMoyen: 0,
    meilleurMatch: 0,
    tendance: 0,
    analysesEffectuees: 0
  });

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
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
        .from('offres_scoring')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setScores(data || []);

      // Calculer les métriques
      if (data && data.length > 0) {
        const scoreMoyen = data.reduce((sum, item) => sum + (item.score_global || 0), 0) / data.length;
        const meilleurMatch = Math.max(...data.map(item => item.score_global || 0));
        setMetrics({
          scoreMoyen: Math.round(scoreMoyen * 10) / 10,
          meilleurMatch,
          tendance: 12, // TODO: calculer la vraie tendance
          analysesEffectuees: data.length
        });
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de scoring",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
            Système de Scoring IA
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Analysez et évaluez vos opportunités d'emploi avec l'intelligence artificielle
          </p>
        </div>

        {/* Métriques de scoring */}
        <ScoringMetrics metrics={metrics} />

        {/* Tableau de scoring */}
        <ScoringTable scores={scores} />

        {/* Bouton flottant en bas pour mobile */}
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <AnalyzeOffersDialog />
        </div>
      </div>
    </AppLayout>
  );
};

export default Scoring;
