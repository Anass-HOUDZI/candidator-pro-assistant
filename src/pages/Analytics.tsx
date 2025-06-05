
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    candidatures: 0,
    entretiens: 0,
    offres: 0,
    tauxReponse: 0
  });
  const [chartData, setChartData] = useState([]);
  const [secteurData, setSecteurData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
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

      // Récupérer les candidatures
      const { data: candidatures, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id);

      if (candidaturesError) {
        throw candidaturesError;
      }

      const totalCandidatures = candidatures?.length || 0;
      const entretiens = candidatures?.filter(c => c.statut === 'Entretien')?.length || 0;
      const offres = candidatures?.filter(c => c.statut === 'Offre reçue')?.length || 0;
      const tauxReponse = totalCandidatures > 0 ? Math.round((entretiens / totalCandidatures) * 100) : 0;

      setMetrics({
        candidatures: totalCandidatures,
        entretiens,
        offres,
        tauxReponse
      });

      // Préparer les données pour le graphique temporel
      const candidaturesByMonth = candidatures?.reduce((acc, candidature) => {
        const date = new Date(candidature.date_envoi || candidature.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
      }, {}) || {};

      const monthlyData = Object.entries(candidaturesByMonth).map(([month, count]) => ({
        mois: month,
        candidatures: count
      })).sort((a, b) => a.mois.localeCompare(b.mois));

      setChartData(monthlyData);

      // Préparer les données par secteur (basé sur les entreprises)
      const entreprises = await supabase
        .from('entreprises')
        .select('secteur')
        .eq('user_id', user.id);

      const secteurs = entreprises.data?.reduce((acc, entreprise) => {
        const secteur = entreprise.secteur || 'Non spécifié';
        acc[secteur] = (acc[secteur] || 0) + 1;
        return acc;
      }, {}) || {};

      const secteurChartData = Object.entries(secteurs).map(([secteur, count]) => ({
        name: secteur,
        value: count
      }));

      setSecteurData(secteurChartData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'analyse",
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
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-2">Analysez vos performances et optimisez votre stratégie de recherche</p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidatures totales</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.candidatures}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entretiens obtenus</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.entretiens}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offres reçues</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.offres}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de réponse</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.tauxReponse}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution des candidatures */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des candidatures</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="candidatures" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition par secteur */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={secteurData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {secteurData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">📊 Performance Globale</h3>
              <div className="space-y-2 text-sm">
                <p>Moyenne mensuelle: {Math.round(metrics.candidatures / Math.max(chartData.length, 1))} candidatures</p>
                <p>Objectif recommandé: 20-30 candidatures/mois</p>
                <p>Statut: {metrics.candidatures > 20 ? '✅ Objectif atteint' : '⚠️ Peut mieux faire'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Taux de Conversion</h3>
              <div className="space-y-2 text-sm">
                <p>Candidatures → Entretiens: {metrics.tauxReponse}%</p>
                <p>Benchmark industrie: 15-25%</p>
                <p>Entretiens → Offres: {metrics.entretiens > 0 ? Math.round((metrics.offres / metrics.entretiens) * 100) : 0}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">🚀 Recommandations</h3>
              <div className="space-y-2 text-sm">
                <p>• Diversifiez vos secteurs cibles</p>
                <p>• Optimisez vos candidatures spontanées</p>
                <p>• Suivez régulièrement vos relances</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
