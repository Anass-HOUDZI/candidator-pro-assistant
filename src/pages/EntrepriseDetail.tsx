
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { EntrepriseHeader } from '@/components/entreprises/EntrepriseHeader';
import { EntrepriseOverview } from '@/components/entreprises/EntrepriseOverview';
import { CandidaturesList } from '@/components/entreprises/CandidaturesList';
import { EntrepriseAnalytics } from '@/components/entreprises/EntrepriseAnalytics';
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
        <EntrepriseHeader entreprise={entreprise} />

        {/* Contenu détaillé */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="candidatures">Candidatures ({candidatures.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EntrepriseOverview entreprise={entreprise} candidatures={candidatures} />
          </TabsContent>

          <TabsContent value="candidatures" className="space-y-6">
            <CandidaturesList candidatures={candidatures} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EntrepriseAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EntrepriseDetail;
