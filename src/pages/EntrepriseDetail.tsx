
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Star, 
  Calendar,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Send,
  Eye
} from 'lucide-react';
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
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
}

const EntrepriseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntrepriseDetail();
  }, [id]);

  const fetchEntrepriseDetail = async () => {
    if (!id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Récupérer les détails de l'entreprise
      const { data: entrepriseData, error: entrepriseError } = await supabase
        .from('entreprises')
        .select('*')
        .eq('id', id)
        .single();

      if (entrepriseError) {
        throw entrepriseError;
      }

      setEntreprise(entrepriseData);

      // Récupérer les candidatures pour cette entreprise
      const { data: candidaturesData, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('entreprise', entrepriseData.nom)
        .eq('user_id', user.id);

      if (candidaturesError) {
        throw candidaturesError;
      }

      setCandidatures(candidaturesData || []);

    } catch (error) {
      console.error('Error fetching entreprise detail:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de l'entreprise",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string | null) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Entretien planifié': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      case 'Accepté': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8">Chargement...</div>
      </AppLayout>
    );
  }

  if (!entreprise) {
    return (
      <AppLayout>
        <div className="text-center py-8">Entreprise non trouvée</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/entreprises')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux entreprises
          </Button>
        </div>

        {/* En-tête de l'entreprise */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{entreprise.nom}</h1>
                  <p className="text-gray-600">{entreprise.secteur || 'Secteur non défini'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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
                    {entreprise.site_web && (
                      <a 
                        href={entreprise.site_web} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-500"
                      >
                        <Globe className="h-4 w-4" />
                        Site web
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
                <Button className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Nouvelle candidature
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenu détaillé */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="candidatures">Candidatures ({candidatures.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Description */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de l'entreprise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {entreprise.description || 'Aucune description disponible pour cette entreprise.'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Statistiques rapides */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{candidatures.length}</div>
                      <div className="text-sm text-gray-600">Candidatures</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {candidatures.filter(c => c.statut === 'Entretien planifié').length}
                      </div>
                      <div className="text-sm text-gray-600">Entretiens</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">32%</div>
                      <div className="text-sm text-gray-600">Taux de réponse</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="candidatures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des candidatures</CardTitle>
              </CardHeader>
              <CardContent>
                {candidatures.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune candidature pour cette entreprise
                  </div>
                ) : (
                  <div className="space-y-4">
                    {candidatures.map((candidature) => (
                      <div key={candidature.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{candidature.poste}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>
                                {candidature.date_envoi 
                                  ? new Date(candidature.date_envoi).toLocaleDateString('fr-FR')
                                  : 'Date non définie'
                                }
                              </span>
                              {candidature.salaire && <span>{candidature.salaire}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatutColor(candidature.statut)}>
                              {candidature.statut || 'En cours'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-1">75%</div>
                  <div className="text-sm text-gray-600">Taux de réponse</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +15% ce mois
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Délai moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-1">7j</div>
                  <div className="text-sm text-gray-600">Temps de réponse</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recommandation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 mb-1">A+</div>
                  <div className="text-sm text-gray-600">Score global</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EntrepriseDetail;
