
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnalyzeOffersDialog } from '@/components/scoring/AnalyzeOffersDialog';
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Système de Scoring IA</h1>
            <p className="text-gray-600 mt-2">Évaluez intelligemment vos opportunités de carrière</p>
          </div>
          <AnalyzeOffersDialog />
        </div>

        {/* Métriques de scoring */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.scoreMoyen}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Meilleur match</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.meilleurMatch}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tendance</p>
                  <p className="text-2xl font-bold text-green-600">+{metrics.tendance}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Analyses effectuées</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.analysesEffectuees}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau de scoring */}
        <Card>
          <CardHeader>
            <CardTitle>Analyse détaillée des opportunités</CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune analyse d'offre disponible.</p>
                <p className="text-sm text-gray-400 mt-2">Utilisez le bouton "Analyser offres" pour commencer.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Entreprise / Poste</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Score Global</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Compétences</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Culture</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Localisation</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Recommandation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{score.entreprise}</div>
                            <div className="text-sm text-gray-600">{score.poste}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(score.score_global || 0)}`}>
                            {score.score_global || 0}/100
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.score_competences || 0)}`}>
                            {score.score_competences || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.score_culture || 0)}`}>
                            {score.score_culture || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.score_localisation || 0)}`}>
                            {score.score_localisation || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">{score.recommandation || 'N/A'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Scoring;
