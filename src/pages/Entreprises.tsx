
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2, MapPin, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddEntrepriseDialog } from '@/components/entreprises/AddEntrepriseDialog';
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
          description: "Connectez-vous pour voir vos entreprises",
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
  const entreprisesCiblees = Math.floor(totalEntreprises * 0.8); // 80% des entreprises sont considérées comme ciblées
  const candidaturesEnvoyees = candidatures.length;
  const entretiens = candidatures.filter(c => c.statut === 'Entretien').length;
  const tauxSucces = candidaturesEnvoyees > 0 ? Math.round((entretiens / candidaturesEnvoyees) * 100) : 0;

  // Compter les candidatures par entreprise
  const getCandidaturesCount = (nomEntreprise: string) => {
    return candidatures.filter(c => c.entreprise === nomEntreprise).length;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Base Entreprises</h1>
            <p className="text-gray-600 mt-2">Découvrez et analysez les entreprises cibles</p>
          </div>
          <AddEntrepriseDialog />
        </div>

        {/* Statistiques mises à jour */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          
          <Card className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entreprises ciblées</p>
                  <p className="text-2xl font-bold text-gray-900">{entreprisesCiblees}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
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

        {/* Liste des entreprises */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        ) : entreprises.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center text-gray-500">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucune entreprise trouvée</p>
              <p className="text-sm">Ajoutez votre première entreprise pour commencer !</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entreprises.map((entreprise, index) => {
              const candidaturesCount = getCandidaturesCount(entreprise.nom);
              
              return (
                <Card 
                  key={entreprise.id} 
                  className="animate-fade-in hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCardClick(entreprise.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{entreprise.nom}</CardTitle>
                        <p className="text-sm text-gray-600">{entreprise.secteur || 'Secteur non défini'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {entreprise.description || 'Aucune description disponible'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {entreprise.taille && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {entreprise.taille}
                          </div>
                        )}
                        {entreprise.localisation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {entreprise.localisation}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-gray-600">
                          {candidaturesCount} candidature(s)
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(entreprise.id);
                          }}
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Entreprises;
