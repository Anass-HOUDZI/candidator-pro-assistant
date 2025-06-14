
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Candidature {
  id: string;
  entreprise: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
  priorite: string | null;
}

export const useCandidatures = () => {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCandidatures = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Information",
          description: "Connectez-vous pour voir vos candidatures"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('candidatures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCandidatures(data || []);
    } catch (error) {
      console.error('Error fetching candidatures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  return {
    candidatures,
    loading,
    fetchCandidatures,
    refetch: fetchCandidatures
  };
};
