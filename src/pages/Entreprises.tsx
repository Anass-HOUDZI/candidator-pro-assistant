
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, Building2, MapPin, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Entreprises = () => {
  const entreprises = [
    {
      id: 1,
      nom: 'TechCorp',
      secteur: 'Technologie',
      taille: '200-500',
      localisation: 'Paris',
      score: 4.5,
      candidatures: 3,
      description: 'Leader français de la transformation digitale'
    },
    {
      id: 2,
      nom: 'StartupIA',
      secteur: 'Intelligence Artificielle',
      taille: '50-200',
      localisation: 'Lyon',
      score: 4.8,
      candidatures: 2,
      description: 'Startup innovante spécialisée en IA'
    },
    {
      id: 3,
      nom: 'DigitalFlow',
      secteur: 'E-commerce',
      taille: '100-200',
      localisation: 'Toulouse',
      score: 4.2,
      candidatures: 1,
      description: 'Plateforme e-commerce nouvelle génération'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Base Entreprises</h1>
            <p className="text-gray-600 mt-2">Découvrez et analysez les entreprises cibles</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter entreprise
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total entreprises</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entreprises ciblées</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidatures envoyées</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de succès</p>
                  <p className="text-2xl font-bold text-gray-900">33%</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des entreprises */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entreprises.map((entreprise) => (
            <Card key={entreprise.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{entreprise.nom}</CardTitle>
                    <p className="text-sm text-gray-600">{entreprise.secteur}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{entreprise.score}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{entreprise.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {entreprise.taille}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {entreprise.localisation}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">
                      {entreprise.candidatures} candidature(s)
                    </span>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Entreprises;
