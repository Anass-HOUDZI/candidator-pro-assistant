
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { EntreprisesHeader } from '@/components/entreprises/EntreprisesHeader';
import { EntreprisesStats } from '@/components/entreprises/EntreprisesStats';
import { EntreprisesFilters } from '@/components/entreprises/EntreprisesFilters';
import { EntreprisesGrid } from '@/components/entreprises/EntreprisesGrid';
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
        <EntreprisesHeader />

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
        <EntreprisesGrid
          entreprises={filteredEntreprises}
          loading={loading}
          getCandidaturesCount={getCandidaturesCount}
          onCardClick={handleCardClick}
        />
      </div>
    </AppLayout>
  );
};

export default Entreprises;
