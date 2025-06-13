import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
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
  const [stats, setStats] = useState({
    candidatures: 0,
    entretiens: 0,
    offres: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

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

      // Récupérer les candidatures
      const { data: candidatures } = await supabase
        .from('candidatures')
        .select('id')
        .eq('user_id', user.id);

      // Récupérer les entretiens (candidatures avec statut "Entretien")
      const { data: entretiens } = await supabase
        .from('candidatures')
        .select('id')
        .eq('user_id', user.id)
        .eq('statut', 'Entretien');

      // Récupérer les offres (candidatures avec statut "Offre reçue")
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

  const handleSave = async () => {
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

  const getInitials = () => {
    return `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`.toUpperCase() || 'JC';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
            Mon Profil
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Gérez vos informations personnelles et préférences</p>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
              <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 md:gap-6">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Nom</Label>
                  <Input
                    id="lastName"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="text-sm md:text-base"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
              <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Informations Professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">Poste recherché</Label>
                <Input
                  id="position"
                  value={profile.position_recherchee}
                  onChange={(e) => setProfile({ ...profile, position_recherchee: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">Années d'expérience</Label>
                <Input
                  id="experience"
                  value={profile.experience_years}
                  onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Localisation</Label>
                <Input
                  id="location"
                  value={profile.localisation}
                  onChange={(e) => setProfile({ ...profile, localisation: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">Salaire souhaité</Label>
                <Input
                  id="salary"
                  value={profile.salaire_souhaite}
                  onChange={(e) => setProfile({ ...profile, salaire_souhaite: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                  <Mail className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.candidatures}</p>
                  <p className="text-xs md:text-sm text-gray-600">Candidatures envoyées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                  <Phone className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.entretiens}</p>
                  <p className="text-xs md:text-sm text-gray-600">Entretiens obtenus</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.offres}</p>
                  <p className="text-xs md:text-sm text-gray-600">Offres reçues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons - Repositionnés pour mobile */}
        <div className="flex flex-col-reverse md:flex-row gap-4 pt-6">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => fetchProfile()}
            className="w-full md:w-auto order-2 md:order-1"
          >
            Annuler
          </Button>
          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={saving}
            className="w-full md:w-auto order-1 md:order-2"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
