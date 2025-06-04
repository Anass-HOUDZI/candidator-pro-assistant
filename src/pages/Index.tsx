
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { CandidaturesChart } from '@/components/dashboard/CandidaturesChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';

const Index = () => {
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
              <li>• Atteindre 30 candidatures ce mois</li>
              <li>• Améliorer le taux de réponse à 40%</li>
              <li>• Planifier 10 entretiens</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold mb-2">Conseils IA</h3>
            <p className="text-sm">
              Vos candidatures dans le secteur Tech ont 23% plus de chances de succès. 
              Concentrez vos efforts sur les startups de 50-200 employés.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-6 text-white animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-semibold mb-2">Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Score moyen:</span>
                <span className="font-semibold">87/100</span>
              </div>
              <div className="flex justify-between">
                <span>Tendance:</span>
                <span className="font-semibold">📈 +12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
