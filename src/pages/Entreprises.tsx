
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

const Entreprises = () => {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
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

      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEntreprises(data || []);
    } catch (error) {
      console.error('Error fetching entreprises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (entrepriseId: string) => {
    navigate(`/entreprises/${entrepriseId}`);
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total entreprises</p>
                  <p className="text-2xl font-bold text-gray-900">{entreprises.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(entreprises.length * 0.7)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(entreprises.length * 0.5)}</p>
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
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : entreprises.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              Aucune entreprise trouvée. Ajoutez votre première entreprise !
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entreprises.map((entreprise) => (
              <Card 
                key={entreprise.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform duration-200"
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
                        0 candidature(s)
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
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Entreprises;
