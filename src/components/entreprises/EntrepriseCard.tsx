
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, Globe, Briefcase, TrendingUp } from 'lucide-react';

interface Entreprise {
  id: string;
  nom: string;
  secteur: string | null;
  taille: string | null;
  localisation: string | null;
  description: string | null;
  site_web: string | null;
}

interface EntrepriseCardProps {
  entreprise: Entreprise;
  candidaturesCount: number;
  onCardClick: (id: string) => void;
  priority?: 'Haute' | 'Moyenne' | 'Faible';
}

export const EntrepriseCard: React.FC<EntrepriseCardProps> = ({ 
  entreprise, 
  candidaturesCount, 
  onCardClick,
  priority = 'Moyenne'
}) => {
  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecteurIcon = (secteur: string | null) => {
    if (!secteur) return <Briefcase className="h-4 w-4" />;
    
    if (secteur.toLowerCase().includes('tech') || secteur.toLowerCase().includes('informatique')) {
      return <TrendingUp className="h-4 w-4" />;
    }
    return <Briefcase className="h-4 w-4" />;
  };

  return (
    <Card 
      className="animate-fade-in hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 transform"
      onClick={() => onCardClick(entreprise.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{entreprise.nom}</CardTitle>
              <Badge className={getPriorityColor(priority)} variant="outline">
                {priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getSecteurIcon(entreprise.secteur)}
              <span>{entreprise.secteur || 'Secteur non défini'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {entreprise.description || 'Aucune description disponible'}
          </p>
          
          {/* Informations détaillées */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {entreprise.taille && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{entreprise.taille}</span>
              </div>
            )}
            {entreprise.localisation && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{entreprise.localisation}</span>
              </div>
            )}
          </div>

          {entreprise.site_web && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <a 
                href={entreprise.site_web} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Site web
              </a>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {candidaturesCount} candidature(s)
              </span>
              <Badge variant="outline" className="text-xs">
                {priority} priorité
              </Badge>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onCardClick(entreprise.id);
              }}
            >
              Voir détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
