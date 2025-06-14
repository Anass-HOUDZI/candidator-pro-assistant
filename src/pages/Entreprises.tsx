
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddEntrepriseDialog } from '@/components/entreprises/AddEntrepriseDialog';
import { EntrepriseCard } from '@/components/entreprises/EntrepriseCard';
import { EntreprisesStats } from '@/components/entreprises/EntreprisesStats';
import { EntreprisesFilters } from '@/components/entreprises/EntreprisesFilters';
import { useEntreprises } from '@/hooks/useEntreprises';

const Entreprises = () => {
  const navigate = useNavigate();
  const { entreprises, loading, getCandidaturesCount, getStats } = useEntreprises();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSecteur, setFilterSecteur] = useState('');

  const handleCardClick = (entrepriseId: string) => {
    navigate(`/entreprises/${entrepriseId}`);
  };

  const stats = getStats();

  // Filtrer les entreprises
  const filteredEntreprises = entreprises.filter(entreprise => {
    const matchesSearch = entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (entreprise.secteur && entreprise.secteur.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSecteur = filterSecteur === '' || entreprise.secteur === filterSecteur;
    return matchesSearch && matchesSecteur;
  });

  // Obtenir la liste unique des secteurs
  const secteurs = [...new Set(entreprises.map(e => e.secteur).filter(Boolean))];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
              Base Entreprises
            </h1>
          </div>
          <AddEntrepriseDialog />
        </div>

        {/* Statistiques */}
        <EntreprisesStats stats={stats} />

        {/* Filtres et recherche */}
        <EntreprisesFilters
          searchTerm={searchTerm}
          filterSecteur={filterSecteur}
          secteurs={secteurs}
          onSearchChange={setSearchTerm}
          onSecteurChange={setFilterSecteur}
        />

        {/* Liste des entreprises */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredEntreprises.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center text-gray-500">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {searchTerm || filterSecteur ? 'Aucune entreprise trouvée avec ces filtres' : 'Aucune entreprise trouvée'}
              </p>
              <p className="text-sm">
                {searchTerm || filterSecteur ? 'Essayez de modifier vos critères de recherche' : 'Ajoutez votre première entreprise pour commencer !'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntreprises.map((entreprise, index) => {
              const candidaturesCount = getCandidaturesCount(entreprise.nom);
              return (
                <EntrepriseCard
                  key={entreprise.id}
                  entreprise={entreprise}
                  candidaturesCount={candidaturesCount}
                  onCardClick={handleCardClick}
                  priority={candidaturesCount > 2 ? 'Haute' : candidaturesCount > 0 ? 'Moyenne' : 'Faible'}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Entreprises;
