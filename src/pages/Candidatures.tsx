
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, Filter, Search, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Candidatures = () => {
  const candidatures = [
    {
      id: 1,
      entreprise: 'TechCorp',
      poste: 'Développeur Full Stack',
      statut: 'En cours',
      dateEnvoi: '2024-01-15',
      salaire: '45-55k€',
      priorite: 'Haute'
    },
    {
      id: 2,
      entreprise: 'StartupIA',
      poste: 'Lead Developer',
      statut: 'Entretien planifié',
      dateEnvoi: '2024-01-12',
      salaire: '50-65k€',
      priorite: 'Très haute'
    },
    {
      id: 3,
      entreprise: 'DigitalFlow',
      poste: 'Frontend Developer',
      statut: 'En attente',
      dateEnvoi: '2024-01-10',
      salaire: '40-50k€',
      priorite: 'Moyenne'
    }
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Entretien planifié': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
            <p className="text-gray-600 mt-2">Gérez et suivez toutes vos candidatures</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle candidature
          </Button>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par entreprise ou poste..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des candidatures */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Entreprise</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Poste</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date d'envoi</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Salaire</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.map((candidature) => (
                    <tr key={candidature.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{candidature.entreprise}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{candidature.poste}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(candidature.statut)}`}>
                          {candidature.statut}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{candidature.dateEnvoi}</td>
                      <td className="py-4 px-4 text-gray-900">{candidature.salaire}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
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

export default Candidatures;
