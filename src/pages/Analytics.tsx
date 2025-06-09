import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Building, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
interface MonthlyData {
  mois: string;
  candidatures: number;
  entretiens: number;
  offres: number;
}
interface SecteurData {
  name: string;
  candidatures: number;
  entreprises: number;
}
interface RecentApplication {
  id: string;
  entreprise: string;
  poste: string;
  statut: string;
  date_envoi?: string;
  created_at: string;
}
interface AlertItem {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}
const Analytics = () => {
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    candidatures: 0,
    entretiens: 0,
    offres: 0,
    tauxReponse: 0,
    entreprisesCiblees: 0,
    tauxSucces: 0
  });
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [secteurData, setSecteurData] = useState<SecteurData[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  useEffect(() => {
    fetchAnalytics();
  }, []);
  const fetchAnalytics = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      // Récupérer les candidatures
      const {
        data: candidatures,
        error: candidaturesError
      } = await supabase.from('candidatures').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (candidaturesError) throw candidaturesError;

      // Récupérer les entreprises
      const {
        data: entreprises,
        error: entreprisesError
      } = await supabase.from('entreprises').select('*').eq('user_id', user.id);
      if (entreprisesError) throw entreprisesError;
      const totalCandidatures = candidatures?.length || 0;
      const entretiens = candidatures?.filter(c => c.statut === 'Entretien')?.length || 0;
      const offres = candidatures?.filter(c => c.statut === 'Offre reçue')?.length || 0;
      const tauxReponse = totalCandidatures > 0 ? Math.round(entretiens / totalCandidatures * 100) : 0;
      const entreprisesCiblees = entreprises?.length || 0;
      const tauxSucces = totalCandidatures > 0 ? Math.round(offres / totalCandidatures * 100) : 0;
      setMetrics({
        candidatures: totalCandidatures,
        entretiens,
        offres,
        tauxReponse,
        entreprisesCiblees,
        tauxSucces
      });

      // Données pour l'évolution des candidatures (par mois)
      const candidaturesByMonth: Record<string, MonthlyData> = {};
      candidatures?.forEach(candidature => {
        const date = new Date(candidature.date_envoi || candidature.created_at);
        const monthKey = date.toLocaleDateString('fr-FR', {
          month: 'short',
          year: 'numeric'
        });
        if (!candidaturesByMonth[monthKey]) {
          candidaturesByMonth[monthKey] = {
            mois: monthKey,
            candidatures: 0,
            entretiens: 0,
            offres: 0
          };
        }
        candidaturesByMonth[monthKey].candidatures++;
        if (candidature.statut === 'Entretien') candidaturesByMonth[monthKey].entretiens++;
        if (candidature.statut === 'Offre reçue') candidaturesByMonth[monthKey].offres++;
      });
      const monthlyData = Object.values(candidaturesByMonth).sort((a, b) => new Date(a.mois).getTime() - new Date(b.mois).getTime());
      setChartData(monthlyData);

      // Données par secteur (basé sur les entreprises et candidatures)
      const secteurs: Record<string, SecteurData> = {};
      entreprises?.forEach(entreprise => {
        const secteur = entreprise.secteur || 'Non spécifié';
        const candidaturesEntreprise = candidatures?.filter(c => c.entreprise === entreprise.nom)?.length || 0;
        if (!secteurs[secteur]) {
          secteurs[secteur] = {
            name: secteur,
            candidatures: 0,
            entreprises: 0
          };
        }
        secteurs[secteur].candidatures += candidaturesEntreprise;
        secteurs[secteur].entreprises++;
      });
      const secteurChartData = Object.values(secteurs).filter(secteurItem => secteurItem.candidatures > 0);
      setSecteurData(secteurChartData);

      // Candidatures récentes (5 dernières)
      setRecentApplications(candidatures?.slice(0, 5) || []);

      // Générer des alertes basées sur les données
      const generatedAlerts: AlertItem[] = [];
      if (totalCandidatures === 0) {
        generatedAlerts.push({
          id: '1',
          type: 'warning',
          title: 'Aucune candidature',
          message: 'Commencez à ajouter vos candidatures pour voir vos statistiques',
          time: 'maintenant'
        });
      }
      if (entretiens === 0 && totalCandidatures > 5) {
        generatedAlerts.push({
          id: '2',
          type: 'urgent',
          title: 'Aucun entretien obtenu',
          message: `${totalCandidatures} candidatures sans entretien - optimisez votre approche`,
          time: '1h'
        });
      }
      if (entreprisesCiblees < 10) {
        generatedAlerts.push({
          id: '3',
          type: 'info',
          title: 'Élargir la recherche',
          message: 'Ajoutez plus d\'entreprises cibles pour augmenter vos opportunités',
          time: '2h'
        });
      }
      setAlerts(generatedAlerts);
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
  const getStatusColor = (statut: string) => {
    const colors: Record<string, string> = {
      'En cours': 'bg-blue-100 text-blue-800',
      'Entretien': 'bg-purple-100 text-purple-800',
      'Offre reçue': 'bg-green-100 text-green-800',
      'Refusée': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  if (loading) {
    return <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </AppLayout>;
  }
  return <AppLayout>
      <div className="space-y-8">
        {/* Header avec animation */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          
        </div>

        {/* Métriques principales avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{
          title: 'Candidatures Envoyées',
          value: metrics.candidatures,
          icon: Calendar,
          color: 'from-blue-500 to-blue-600',
          delay: '0ms'
        }, {
          title: 'Entretiens Planifiés',
          value: metrics.entretiens,
          icon: Target,
          color: 'from-green-500 to-green-600',
          delay: '100ms'
        }, {
          title: 'Offres Reçues',
          value: metrics.offres,
          icon: Award,
          color: 'from-purple-500 to-purple-600',
          delay: '200ms'
        }, {
          title: 'Entreprises Ciblées',
          value: metrics.entreprisesCiblees,
          icon: Building,
          color: 'from-orange-500 to-orange-600',
          delay: '300ms'
        }, {
          title: 'Taux de Réponse',
          value: `${metrics.tauxReponse}%`,
          icon: TrendingUp,
          color: 'from-pink-500 to-pink-600',
          delay: '400ms'
        }, {
          title: 'Taux de Succès',
          value: `${metrics.tauxSucces}%`,
          icon: CheckCircle,
          color: 'from-teal-500 to-teal-600',
          delay: '500ms'
        }].map((metric, index) => <Card key={metric.title} className="animate-fade-in hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg" style={{
          animationDelay: metric.delay
        }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${metric.color} shadow-lg`}>
                    <metric.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Évolution des candidatures */}
          <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30" style={{
          animationDelay: '600ms'
        }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                Évolution des Candidatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="mois" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} />
                  <Area type="monotone" dataKey="candidatures" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCandidatures)" strokeWidth={3} />
                  <Area type="monotone" dataKey="entretiens" stroke="#10B981" fillOpacity={1} fill="url(#colorEntretiens)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition par secteur */}
          <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30" style={{
          animationDelay: '700ms'
        }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-6 w-6 text-purple-500" />
                Répartition par Secteur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {secteurData.length > 0 ? <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={secteurData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={120} fill="#8884d8" dataKey="candidatures">
                      {secteurData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} />
                  </PieChart>
                </ResponsiveContainer> : <div className="flex items-center justify-center h-80 text-gray-500">
                  <div className="text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Aucune donnée de secteur disponible</p>
                  </div>
                </div>}
            </CardContent>
          </Card>
        </div>

        {/* Section inférieure avec 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alertes & Notifications */}
          <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-red-50/30" style={{
          animationDelay: '800ms'
        }}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertes & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.length > 0 ? alerts.map((alert, index) => <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.type === 'urgent' ? 'border-l-red-500 bg-red-50' : alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'} animate-fade-in`} style={{
              animationDelay: `${800 + index * 100}ms`
            }}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      <span className="text-xs text-gray-500 mt-2 block">Il y a {alert.time}</span>
                    </div>
                  </div>
                </div>) : <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Aucune alerte pour le moment</p>
                </div>}
            </CardContent>
          </Card>

          {/* Candidatures Récentes */}
          <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-green-50/30" style={{
          animationDelay: '900ms'
        }}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Candidatures Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentApplications.length > 0 ? recentApplications.map((app, index) => <div key={app.id} className="p-3 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-all duration-200 animate-fade-in" style={{
              animationDelay: `${900 + index * 100}ms`
            }}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{app.entreprise}</h4>
                    <Badge className={`text-xs ${getStatusColor(app.statut)}`}>
                      {app.statut}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{app.poste}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(app.date_envoi || app.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>) : <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Aucune candidature récente</p>
                </div>}
            </CardContent>
          </Card>

          {/* Performance par Secteur */}
          <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/30" style={{
          animationDelay: '1000ms'
        }}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-500" />
                Performance par Secteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {secteurData.length > 0 ? secteurData.map((item, index) => <div key={item.name} className="animate-fade-in" style={{
              animationDelay: `${1000 + index * 100}ms`
            }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                    <span className="text-xs text-gray-600">{item.candidatures} candidatures</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{
                  width: `${Math.min(item.candidatures / Math.max(...secteurData.map(s => s.candidatures), 1) * 100, 100)}%`
                }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{item.entreprises} entreprises</span>
                  </div>
                </div>) : <div className="text-center py-8 text-gray-500">
                  <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Aucune donnée de performance disponible</p>
                </div>}
            </CardContent>
          </Card>
        </div>

        {/* Insights améliorés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 text-white animate-fade-in shadow-xl border-0" style={{
          animationDelay: '1100ms'
        }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                📊 Performance Globale
              </h3>
              <div className="space-y-2 text-sm">
                <p>Candidatures totales: {metrics.candidatures}</p>
                <p>Taux de conversion: {metrics.tauxReponse}%</p>
                <p>Statut: {metrics.candidatures > 0 ? '✅ Actif' : '⚠️ Commencer'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white animate-fade-in shadow-xl border-0" style={{
          animationDelay: '1200ms'
        }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🎯 Ciblage Stratégique
              </h3>
              <div className="space-y-2 text-sm">
                <p>Entreprises ciblées: {metrics.entreprisesCiblees}</p>
                <p>Secteurs explorés: {secteurData.length}</p>
                <p>Focus: {secteurData.length > 0 ? '✅ Diversifié' : '⚠️ À développer'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 via-pink-600 to-red-700 text-white animate-fade-in shadow-xl border-0" style={{
          animationDelay: '1300ms'
        }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🚀 Recommandations
              </h3>
              <div className="space-y-2 text-sm">
                <p>• {metrics.candidatures === 0 ? 'Commencer les candidatures' : 'Maintenir le rythme'}</p>
                <p>• {metrics.entreprisesCiblees < 10 ? 'Élargir le réseau' : 'Optimiser le ciblage'}</p>
                <p>• {metrics.tauxReponse < 20 ? 'Améliorer les candidatures' : 'Excellent taux!'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>;
};
export default Analytics;