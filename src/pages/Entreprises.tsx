
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2, MapPin, Users, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddEntrepriseDialog } from '@/components/entreprises/AddEntrepriseDialog';
import { EntrepriseCard } from '@/components/entreprises/EntrepriseCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Entreprise {
  id: string;
  nom: string;
  secteur: string | null;
  taille: string | null;
  localisation: string | null;
  description: string | null;
  site_web: string | null;
}

interface Candidature {
  id: string;
  entreprise: string;
  statut: string | null;
}

const Entreprises = () => {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSecteur, setFilterSecteur] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Information",
          description: "Connectez-vous pour voir vos entreprises"
        });
        setLoading(false);
        return;
      }

      // Récupérer les entreprises
      const { data: entreprisesData, error: entreprisesError } = await supabase
        .from('entreprises')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (entreprisesError) throw entreprisesError;

      // Récupérer les candidatures pour calculer les stats
      const { data: candidaturesData, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id);
      
      if (candidaturesError) throw candidaturesError;

      setEntreprises(entreprisesData || []);
      setCandidatures(candidaturesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (entrepriseId: string) => {
    navigate(`/entreprises/${entrepriseId}`);
  };

  // Calculs des statistiques
  const totalEntreprises = entreprises.length;
  const candidaturesEnvoyees = candidatures.length;
  const entretiens = candidatures.filter(c => c.statut === 'Entretien').length;
  const tauxSucces = candidaturesEnvoyees > 0 ? Math.round(entretiens / candidaturesEnvoyees * 100) : 0;

  // Compter les candidatures par entreprise
  const getCandidaturesCount = (nomEntreprise: string) => {
    return candidatures.filter(c => c.entreprise === nomEntreprise).length;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total entreprises</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEntreprises}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidatures envoyées</p>
                  <p className="text-2xl font-bold text-gray-900">{candidaturesEnvoyees}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de succès</p>
                  <p className="text-2xl font-bold text-gray-900">{tauxSucces}%</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom ou secteur..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filterSecteur}
                onChange={(e) => setFilterSecteur(e.target.value)}
              >
                <option value="">Tous les secteurs</option>
                {secteurs.map(secteur => (
                  <option key={secteur} value={secteur}>{secteur}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des entreprises */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
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
