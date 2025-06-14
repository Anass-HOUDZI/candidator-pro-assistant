
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Search, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const automationTemplates = [
  {
    id: 'relance-email',
    nom: 'Relance Email',
    description: 'Envoie automatiquement des emails de relance après X jours sans réponse',
    icon: Mail,
    color: 'bg-blue-500',
    type: 'email'
  },
  {
    id: 'veille-emploi',
    nom: 'Veille Emploi',
    description: 'Surveille les nouvelles offres correspondant à votre profil',
    icon: Search,
    color: 'bg-green-500',
    type: 'veille'
  },
  {
    id: 'rapport-auto',
    nom: 'Rapport Auto',
    description: 'Génère automatiquement un rapport hebdomadaire de vos candidatures',
    icon: FileText,
    color: 'bg-purple-500',
    type: 'rapport'
  },
  {
    id: 'rappel-entretien',
    nom: 'Rappel Entretien',
    description: 'Envoie des rappels avant vos entretiens programmés',
    icon: Calendar,
    color: 'bg-orange-500',
    type: 'rappel'
  }
];

interface AutomationTemplatesProps {
  automations: any[];
  onCreateFromTemplate: (template: any) => void;
}

export const AutomationTemplates: React.FC<AutomationTemplatesProps> = ({ 
  automations, 
  onCreateFromTemplate 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Templates d'automatisation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {automationTemplates.map((template) => {
            const IconComponent = template.icon;
            const existingAutomation = automations.find(a => a.type === template.type);
            
            return (
              <div
                key={template.id}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all duration-200",
                  existingAutomation
                    ? "bg-gray-50 border-gray-200"
                    : "hover:shadow-md hover:scale-105 border-gray-200 hover:border-primary-300"
                )}
                onClick={() => !existingAutomation && onCreateFromTemplate(template)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("p-2 rounded-lg", template.color)}>
                    <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm md:text-base">{template.nom}</h3>
                    {existingAutomation && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Déjà configuré
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-3">{template.description}</p>
                {!existingAutomation && (
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
