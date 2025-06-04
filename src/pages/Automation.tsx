import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bot, Clock, Mail, CheckCircle, Settings, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddAutomationDialog } from '@/components/automation/AddAutomationDialog';

const Automation = () => {
  const automations = [
    {
      id: 1,
      nom: 'Relance automatique',
      description: 'Envoie des relances 7 jours après candidature',
      statut: 'Actif',
      prochaine: '2024-01-20 10:00',
      executions: 15
    },
    {
      id: 2,
      nom: 'Veille offres LinkedIn',
      description: 'Scanne LinkedIn pour nouvelles opportunités',
      statut: 'Actif',
      prochaine: '2024-01-19 09:00',
      executions: 42
    },
    {
      id: 3,
      nom: 'Rapport hebdomadaire',
      description: 'Génère un rapport de performance chaque lundi',
      statut: 'Pausé',
      prochaine: '2024-01-22 08:00',
      executions: 8
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automatisation</h1>
            <p className="text-gray-600 mt-2">Configurez et gérez vos processus automatisés</p>
          </div>
          <AddAutomationDialog />
        </div>

        {/* Stats d'automatisation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Automatisations actives</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emails envoyés</p>
                  <p className="text-2xl font-bold text-gray-900">147</p>
                </div>
                <Mail className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps économisé</p>
                  <p className="text-2xl font-bold text-gray-900">24h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de succès</p>
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflows actifs */}
        <Card>
          <CardHeader>
            <CardTitle>Workflows configurés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automations.map((automation) => (
                <div key={automation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${automation.statut === 'Actif' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{automation.nom}</h3>
                      <p className="text-sm text-gray-600">{automation.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {automation.executions} exécutions
                      </p>
                      <p className="text-xs text-gray-600">
                        Prochaine: {automation.prochaine}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        automation.statut === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {automation.statut}
                      </span>
                      
                      <Button variant="ghost" size="sm">
                        {automation.statut === 'Actif' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Templates d'automatisation */}
        <Card>
          <CardHeader>
            <CardTitle>Templates d'automatisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer">
                <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Relance Email</h3>
                <p className="text-sm text-gray-600">Automatise les relances de candidature</p>
              </div>
              
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer">
                <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Veille Emploi</h3>
                <p className="text-sm text-gray-600">Surveille les nouvelles offres</p>
              </div>
              
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer">
                <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Rapport Auto</h3>
                <p className="text-sm text-gray-600">Génère des rapports périodiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Automation;
