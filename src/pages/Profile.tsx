
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit2 } from 'lucide-react';

const Profile = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et préférences</p>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    JC
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Changer photo
                </Button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Job" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Candidat" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="job.candidat@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+33 6 12 34 56 78" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              Informations Professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Poste recherché</Label>
                <Input id="position" defaultValue="Développeur Full Stack" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Années d'expérience</Label>
                <Input id="experience" defaultValue="5 ans" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" defaultValue="Paris, France" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salaire souhaité</Label>
                <Input id="salary" defaultValue="55 000 €" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-600">Candidatures envoyées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                  <p className="text-sm text-gray-600">Entretiens obtenus</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-gray-600">Offres reçues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button size="lg">
            Sauvegarder les modifications
          </Button>
          <Button variant="outline" size="lg">
            Annuler
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
