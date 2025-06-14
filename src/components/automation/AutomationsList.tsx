
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AutomationCard } from '@/components/automation/AutomationCard';
import { Zap } from 'lucide-react';

interface AutomationsListProps {
  automations: any[];
  loading: boolean;
  onToggle: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
  onConfigure: (automation: any) => void;
}

export const AutomationsList: React.FC<AutomationsListProps> = ({
  automations,
  loading,
  onToggle,
  onDelete,
  onConfigure
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Mes automatisations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : automations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base md:text-lg font-medium mb-2">Aucune automatisation configurée</p>
            <p className="text-sm">Utilisez les templates ci-dessus pour commencer !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {automations.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onDelete={onDelete}
                onConfigure={onConfigure}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
