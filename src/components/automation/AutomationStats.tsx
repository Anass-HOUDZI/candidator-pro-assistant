
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, Pause, Clock } from 'lucide-react';

interface AutomationStatsProps {
  automations: any[];
}

export const AutomationStats: React.FC<AutomationStatsProps> = ({ automations }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total automatisations</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{automations.length}</p>
            </div>
            <Zap className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Actives</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">
                {automations.filter(a => a.actif).length}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">En pause</p>
              <p className="text-lg md:text-2xl font-bold text-yellow-600">
                {automations.filter(a => !a.actif).length}
              </p>
            </div>
            <Pause className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Temps économisé</p>
              <p className="text-lg md:text-2xl font-bold text-purple-600">
                {Math.round(automations.filter(a => a.actif).length * 2.5)}h
              </p>
            </div>
            <Clock className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
