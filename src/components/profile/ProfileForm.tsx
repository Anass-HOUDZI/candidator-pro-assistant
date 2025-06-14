
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Briefcase } from 'lucide-react';

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

interface ProfileFormProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onProfileChange }) => {
  const updateProfile = (field: keyof ProfileData, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  return (
    <>
      {/* General Information Card */}
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
                  onChange={(e) => updateProfile('first_name', e.target.value)}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Nom</Label>
                <Input
                  id="lastName"
                  value={profile.last_name}
                  onChange={(e) => updateProfile('last_name', e.target.value)}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
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
                onChange={(e) => updateProfile('position_recherchee', e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium">Années d'expérience</Label>
              <Input
                id="experience"
                value={profile.experience_years}
                onChange={(e) => updateProfile('experience_years', e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Localisation</Label>
              <Input
                id="location"
                value={profile.localisation}
                onChange={(e) => updateProfile('localisation', e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">Salaire souhaité</Label>
              <Input
                id="salary"
                value={profile.salaire_souhaite}
                onChange={(e) => updateProfile('salaire_souhaite', e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
