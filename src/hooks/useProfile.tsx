
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position_recherchee: string;
  experience_years: string;
  localisation: string;
  salaire_souhaite: string;
  avatar_url: string;
}

interface StatsData {
  candidatures: number;
  entretiens: number;
  offres: number;
}

export const useProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position_recherchee: '',
    experience_years: '',
    localisation: '',
    salaire_souhaite: '',
    avatar_url: ''
  });
  const [stats, setStats] = useState<StatsData>({
    candidatures: 0,
    entretiens: 0,
    offres: 0
  });

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: candidatures } = await supabase
        .from('candidatures')
        .select('id')
        .eq('user_id', user.id);

      const { data: entretiens } = await supabase
        .from('candidatures')
        .select('id')
        .eq('user_id', user.id)
        .eq('statut', 'Entretien');

      const { data: offres } = await supabase
        .from('candidatures')
        .select('id')
        .eq('user_id', user.id)
        .eq('statut', 'Offre reçue');

      setStats({
        candidatures: candidatures?.length || 0,
        entretiens: entretiens?.length || 0,
        offres: offres?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  return {
    profile,
    setProfile,
    stats,
    loading,
    saving,
    saveProfile,
    fetchProfile
  };
};
