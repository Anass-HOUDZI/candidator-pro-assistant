
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Scoring = () => {
  const scores = [
    {
      entreprise: 'TechCorp',
      poste: 'Développeur Full Stack',
      scoreGlobal: 87,
      scoreCompetences: 92,
      scoreCulture: 78,
      scoreLocalisation: 95,
      recommandation: 'Très recommandé'
    },
    {
      entreprise: 'StartupIA',
      poste: 'Lead Developer',
      scoreGlobal: 94,
      scoreCompetences: 98,
      scoreCulture: 88,
      scoreLocalisation: 85,
      recommandation: 'Excellent match'
    },
    {
      entreprise: 'DigitalFlow',
      poste: 'Frontend Developer',
      scoreGlobal: 73,
      scoreCompetences: 85,
      scoreCulture: 65,
      scoreLocalisation: 70,
      recommandation: 'Bon potentiel'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Système de Scoring IA</h1>
            <p className="text-gray-600 mt-2">Évaluez intelligemment vos opportunités de carrière</p>
          </div>
          <Button className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Analyser nouvelles offres
          </Button>
        </div>

        {/* Métriques de scoring */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score moyen</p>
                  <p className="text-2xl font-bold text-gray-900">84.7</p>
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
                  <p className="text-2xl font-bold text-gray-900">94</p>
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
                  <p className="text-2xl font-bold text-green-600">+12%</p>
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
                  <p className="text-2xl font-bold text-gray-900">156</p>
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
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(score.scoreGlobal)}`}>
                          {score.scoreGlobal}/100
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.scoreCompetences)}`}>
                          {score.scoreCompetences}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.scoreCulture)}`}>
                          {score.scoreCulture}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.scoreLocalisation)}`}>
                          {score.scoreLocalisation}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">{score.recommandation}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Scoring;
