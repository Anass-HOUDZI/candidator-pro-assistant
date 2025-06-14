
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Score {
  entreprise: string;
  poste: string;
  score_global: number;
  score_competences: number;
  score_culture: number;
  score_localisation: number;
  recommandation: string;
}

interface ScoringTableProps {
  scores: Score[];
}

export const ScoringTable: React.FC<ScoringTableProps> = ({ scores }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Analyse détaillée des opportunités</CardTitle>
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
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">Entreprise / Poste</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">Score Global</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">Compétences</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">Culture</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">Localisation</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">Recommandation</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2 md:px-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm md:text-base">{score.entreprise}</div>
                        <div className="text-xs md:text-sm text-gray-600">{score.poste}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-4">
                      <span className={`inline-flex px-2 md:px-3 py-1 text-xs md:text-sm font-semibold rounded-full ${getScoreColor(score.score_global || 0)}`}>
                        {score.score_global || 0}/100
                      </span>
                    </td>
                    <td className="py-4 px-2 md:px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.score_competences || 0)}`}>
                        {score.score_competences || 0}
                      </span>
                    </td>
                    <td className="py-4 px-2 md:px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.score_culture || 0)}`}>
                        {score.score_culture || 0}
                      </span>
                    </td>
                    <td className="py-4 px-2 md:px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getScoreColor(score.score_localisation || 0)}`}>
                        {score.score_localisation || 0}
                      </span>
                    </td>
                    <td className="py-4 px-2 md:px-4">
                      <span className="text-xs md:text-sm font-medium text-gray-900">{score.recommandation || 'N/A'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
