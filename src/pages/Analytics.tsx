
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const tendanceData = [
    { mois: 'Oct', candidatures: 12, entretiens: 3, offres: 1 },
    { mois: 'Nov', candidatures: 18, entretiens: 5, offres: 2 },
    { mois: 'Déc', candidatures: 24, entretiens: 8, offres: 3 },
    { mois: 'Jan', candidatures: 31, entretiens: 11, offres: 4 }
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
                <Calendar className="h-8 w-8 text-green-500" />
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
                  <p className="text-sm text-gray-600">ROI candidatures</p>
                  <p className="text-2xl font-bold text-gray-900">245%</p>
                  <p className="text-xs text-green-600">+15% vs mois dernier</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendance temporelle */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des candidatures</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="candidatures" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="entretiens" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="offres" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition par secteur */}
          <Card>
            <CardHeader>
              <CardTitle>Candidatures par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={secteurData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="candidatures"
                    label={({ secteur, percent }) => `${secteur} ${(percent * 100).toFixed(0)}%`}
                  >
                    {secteurData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.couleur} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Métriques de performance */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {performanceData.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                    <span className="text-sm text-gray-600">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights IA */}
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
              <CardTitle>Prédictions</CardTitle>
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
                  <h4 className="font-medium text-gray-900">Salaire cible</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Fourchette optimale: <span className="font-medium text-purple-600">52-58k€</span> (+8% marché)
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
