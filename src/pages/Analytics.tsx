
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrendingUp, Calendar, Target, Award, Users, Building2, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';

const Analytics = () => {
  const tendanceData = [
    { mois: 'Oct', candidatures: 12, entretiens: 3, offres: 1, rejets: 8 },
    { mois: 'Nov', candidatures: 18, entretiens: 5, offres: 2, rejets: 11 },
    { mois: 'Déc', candidatures: 24, entretiens: 8, offres: 3, rejets: 13 },
    { mois: 'Jan', candidatures: 31, entretiens: 11, offres: 4, rejets: 16 }
  ];

  const secteurData = [
    { secteur: 'Tech', candidatures: 35, couleur: '#3B82F6' },
    { secteur: 'Fintech', candidatures: 22, couleur: '#10B981' },
    { secteur: 'E-commerce', candidatures: 18, couleur: '#F59E0B' },
    { secteur: 'Conseil', candidatures: 15, couleur: '#EF4444' },
    { secteur: 'Autres', candidatures: 10, couleur: '#8B5CF6' }
  ];

  const performanceData = [
    { name: 'Taux de réponse', value: 33, max: 100 },
    { name: 'Conversion entretien', value: 45, max: 100 },
    { name: 'Taux d\'acceptation', value: 78, max: 100 }
  ];

  const radarData = [
    { skill: 'React', niveau: 95, demande: 85 },
    { skill: 'Node.js', niveau: 80, demande: 90 },
    { skill: 'Python', niveau: 70, demande: 75 },
    { skill: 'TypeScript', niveau: 90, demande: 80 },
    { skill: 'AWS', niveau: 65, demande: 95 },
    { skill: 'Docker', niveau: 75, demande: 70 }
  ];

  const tempsReponseData = [
    { jour: 'Lun', reponse: 2.3, ouverture: 65 },
    { jour: 'Mar', reponse: 1.8, ouverture: 78 },
    { jour: 'Mer', reponse: 2.1, ouverture: 72 },
    { jour: 'Jeu', reponse: 1.5, ouverture: 85 },
    { jour: 'Ven', reponse: 2.8, ouverture: 45 },
    { jour: 'Sam', reponse: 4.2, ouverture: 25 },
    { jour: 'Dim', reponse: 3.9, ouverture: 20 }
  ];

  const salaireData = [
    { experience: '0-2 ans', salaire: 35000, candidatures: 12 },
    { experience: '2-5 ans', salaire: 45000, candidatures: 28 },
    { experience: '5-8 ans', salaire: 55000, candidatures: 35 },
    { experience: '8+ ans', salaire: 70000, candidatures: 15 }
  ];

  const conversionFunnelData = [
    { etape: 'Candidatures', valeur: 100, couleur: '#3B82F6' },
    { etape: 'Réponses', valeur: 33, couleur: '#10B981' },
    { etape: 'Entretiens', valeur: 15, couleur: '#F59E0B' },
    { etape: 'Finaux', valeur: 8, couleur: '#EF4444' },
    { etape: 'Offres', valeur: 4, couleur: '#8B5CF6' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-2">Analysez vos performances et optimisez votre stratégie</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Derniers 30 jours
            </Button>
          </div>
        </div>

        {/* KPIs Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion globale</p>
                  <p className="text-2xl font-bold text-gray-900">12.5%</p>
                  <p className="text-xs text-green-600">+2.3% vs mois dernier</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps moyen réponse</p>
                  <p className="text-2xl font-bold text-gray-900">5.2j</p>
                  <p className="text-xs text-green-600">-0.8j vs mois dernier</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score moyen profil</p>
                  <p className="text-2xl font-bold text-gray-900">87/100</p>
                  <p className="text-xs text-blue-600">+5 pts vs mois dernier</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux d'ouverture</p>
                  <p className="text-2xl font-bold text-gray-900">68%</p>
                  <p className="text-xs text-green-600">+12% vs mois dernier</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendance temporelle avec zones */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution détaillée des candidatures</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={tendanceData}>
                  <defs>
                    <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="candidatures" stackId="1" stroke="#3B82F6" fill="url(#colorCandidatures)" />
                  <Area type="monotone" dataKey="rejets" stackId="1" stroke="#EF4444" fill="#FEE2E2" />
                  <Line type="monotone" dataKey="entretiens" stroke="#10B981" strokeWidth={3} />
                  <Line type="monotone" dataKey="offres" stroke="#F59E0B" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar des compétences */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse des compétences</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Votre niveau" dataKey="niveau" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Radar name="Demande marché" dataKey="demande" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Analyses avancées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel de conversion */}
          <Card>
            <CardHeader>
              <CardTitle>Funnel de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((etape, index) => (
                  <div key={etape.etape} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{etape.etape}</span>
                      <span className="text-sm text-gray-600">{etape.valeur}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${etape.valeur}%`,
                          backgroundColor: etape.couleur
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Temps de réponse par jour */}
          <Card>
            <CardHeader>
              <CardTitle>Performance par jour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={tempsReponseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="reponse" fill="#3B82F6" name="Temps réponse (jours)" />
                  <Line yAxisId="right" type="monotone" dataKey="ouverture" stroke="#10B981" strokeWidth={2} name="Taux ouverture %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition par secteur (Donut) */}
          <Card>
            <CardHeader>
              <CardTitle>Candidatures par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={secteurData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="candidatures"
                  >
                    {secteurData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.couleur} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {secteurData.map((entry) => (
                  <div key={entry.secteur} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.couleur }} />
                    <span className="text-sm">{entry.secteur}: {entry.candidatures}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analyse salaire/expérience */}
        <Card>
          <CardHeader>
            <CardTitle>Analyse Salaire vs Expérience</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={salaireData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="experience" />
                <YAxis dataKey="salaire" />
                <ZAxis dataKey="candidatures" range={[100, 1000]} />
                <Tooltip formatter={(value, name) => {
                  if (name === 'salaire') return [`${value}€`, 'Salaire'];
                  if (name === 'candidatures') return [value, 'Candidatures'];
                  return [value, name];
                }} />
                <Scatter dataKey="salaire" fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métriques de performance améliorées */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance détaillés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {performanceData.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${metric.value}, 100`}
                        strokeLinecap="round"
                        fill="transparent"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{metric.value}%</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights IA et Prédictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Optimisation temporelle</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Envoyez vos candidatures le mardi entre 9h-11h pour +23% de taux d'ouverture
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Secteur prometteur</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Le secteur Fintech montre +45% de taux de réponse par rapport à la moyenne
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Amélioration profil</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Ajoutez "API REST" et "Docker" pour +15% de matching avec vos cibles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prédictions & Objectifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">Objectif mensuel</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Probabilité d'atteindre 30 candidatures: <span className="font-medium text-green-600">87%</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">Prochaine offre</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Estimation: <span className="font-medium text-blue-600">12-18 jours</span> basé sur votre performance
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">Salaire cible optimisé</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Fourchette recommandée: <span className="font-medium text-purple-600">52-58k€</span> (+8% marché)
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
