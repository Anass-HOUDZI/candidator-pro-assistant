
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddCandidatureDialog } from '@/components/candidatures/AddCandidatureDialog';
import { CandidatureTable } from '@/components/candidatures/CandidatureTable';
import { CandidatureCards } from '@/components/candidatures/CandidatureCards';
import { useCandidatures } from '@/hooks/useCandidatures';
import { useIsMobile } from '@/hooks/use-mobile';

const Candidatures = () => {
  const { candidatures, loading, refetch } = useCandidatures();
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mes Candidatures</h1>
          </div>
          <AddCandidatureDialog />
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par entreprise ou poste..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des candidatures */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Candidatures récentes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : candidatures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Aucune candidature trouvée.</p>
                <p className="text-sm">Ajoutez votre première candidature !</p>
              </div>
            ) : isMobile ? (
              <CandidatureCards candidatures={candidatures} onUpdate={refetch} />
            ) : (
              <CandidatureTable candidatures={candidatures} onUpdate={refetch} />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Candidatures;
