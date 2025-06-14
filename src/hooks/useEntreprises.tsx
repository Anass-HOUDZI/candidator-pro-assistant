
import { useState, useEffect } from 'react';
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

export const useEntreprises = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const getCandidaturesCount = (nomEntreprise: string) => {
    return candidatures.filter(c => c.entreprise === nomEntreprise).length;
  };

  const getStats = () => {
    const totalEntreprises = entreprises.length;
    const candidaturesEnvoyees = candidatures.length;
    const entretiens = candidatures.filter(c => c.statut === 'Entretien').length;
    const tauxSucces = candidaturesEnvoyees > 0 ? Math.round(entretiens / candidaturesEnvoyees * 100) : 0;

    return {
      totalEntreprises,
      candidaturesEnvoyees,
      entretiens,
      tauxSucces
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    entreprises,
    candidatures,
    loading,
    getCandidaturesCount,
    getStats,
    refetch: fetchData
  };
};
