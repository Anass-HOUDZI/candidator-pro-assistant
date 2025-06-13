
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Calendar, Target, Activity, Download, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  candidatures: any[];
  entretiens: any[];
  reponses: any[];
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    candidatures: [],
    entretiens: [],
    reponses: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Information",
          description: "Connectez-vous pour voir vos statistiques"
        });
        setLoading(false);
        return;
      }

      // Calculer la date de début basée sur dateRange
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateRange));

      // Récupérer les candidatures
      const { data: candidaturesData, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (candidaturesError) throw candidaturesError;

      setData({
        candidatures: candidaturesData || [],
        entretiens: candidaturesData?.filter(c => c.statut === 'Entretien') || [],
        reponses: candidaturesData?.filter(c => c.statut !== 'En attente') || []
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Données pour les graphiques
  const candidaturesParMois = data.candidatures.reduce((acc, candidature) => {
    const month = new Date(candidature.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(candidaturesParMois).map(([month, count]) => ({
    mois: month,
    candidatures: count
  }));

  const statutData = data.candidatures.reduce((acc, candidature) => {
    const statut = candidature.statut || 'En attente';
    acc[statut] = (acc[statut] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statutData).map(([statut, count]) => ({
    name: statut,
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const metriques = {
    totalCandidatures: data.candidatures.length,
    tauxReponse: data.candidatures.length > 0 ? Math.round((data.reponses.length / data.candidatures.length) * 100) : 0,
    entretiens: data.entretiens.length,
    tauxConversion: data.candidatures.length > 0 ? Math.round((data.entretiens.length / data.candidatures.length) * 100) : 0
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 mt-2">
              Analysez vos performances et optimisez votre recherche d'emploi
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">3 derniers mois</option>
              <option value="365">12 derniers mois</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total candidatures</p>
                  <p className="text-2xl font-bold text-gray-900">{metriques.totalCandidatures}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de réponse</p>
                  <p className="text-2xl font-bold text-green-600">{metriques.tauxReponse}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entretiens obtenus</p>
                  <p className="text-2xl font-bold text-purple-600">{metriques.entretiens}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de conversion</p>
                  <p className="text-2xl font-bold text-orange-600">{metriques.tauxConversion}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <Tabs defaultValue="candidatures" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
            <TabsTrigger value="statuts">Statuts</TabsTrigger>
            <TabsTrigger value="tendances">Tendances</TabsTrigger>
          </TabsList>

          <TabsContent value="candidatures" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des candidatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="candidatures" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statuts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tendances" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances de performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="candidatures" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights et recommandations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Performance du mois</h4>
                  <p className="text-sm text-blue-700">
                    Vous avez envoyé {data.candidatures.filter(c => {
                      const candidatureDate = new Date(c.created_at);
                      const currentMonth = new Date().getMonth();
                      return candidatureDate.getMonth() === currentMonth;
                    }).length} candidatures ce mois-ci.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Taux de réponse</h4>
                  <p className="text-sm text-green-700">
                    Votre taux de réponse est de {metriques.tauxReponse}%, 
                    {metriques.tauxReponse > 20 ? ' excellent !' : ' continuez vos efforts !'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Optimisation</h4>
                  <p className="text-sm text-purple-700">
                    Personnalisez davantage vos candidatures pour améliorer le taux de réponse.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Suivi</h4>
                  <p className="text-sm text-orange-700">
                    Pensez à faire des relances 1-2 semaines après vos candidatures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
