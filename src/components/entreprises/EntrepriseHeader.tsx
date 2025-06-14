
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, MapPin, Globe, Star, Send, ExternalLink } from 'lucide-react';

interface Entreprise {
  id: string;
  nom: string;
  secteur: string | null;
  taille: string | null;
  localisation: string | null;
  description: string | null;
  site_web: string | null;
}

interface EntrepriseHeaderProps {
  entreprise: Entreprise;
}

export const EntrepriseHeader: React.FC<EntrepriseHeaderProps> = ({ entreprise }) => {
  return (
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
  );
};
