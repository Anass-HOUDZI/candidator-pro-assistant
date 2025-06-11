
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReflectionGanttChartProps {
  reflections: any[];
}

export const ReflectionGanttChart = ({ reflections }: ReflectionGanttChartProps) => {
  const ganttRef = useRef(null);

  useEffect(() => {
    // Pour l'instant, affichage d'un placeholder
    // L'intégration complète de dhtmlxGantt nécessiterait une configuration plus avancée
    console.log('Gantt chart data:', reflections);
  }, [reflections]);

  // Version simplifiée du planning en attendant l'intégration complète de Gantt
  const reflectionsWithDates = reflections.filter(r => r.due_date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning des Réflexions</CardTitle>
      </CardHeader>
      <CardContent>
        {reflectionsWithDates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune réflexion avec date d'échéance</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reflectionsWithDates.map((reflection) => (
              <div key={reflection.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{reflection.title}</h4>
                  <p className="text-sm text-gray-600">{reflection.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(reflection.due_date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-gray-500">{reflection.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={ganttRef} className="mt-4 h-96 border rounded">
          {/* Le graphique Gantt sera intégré ici */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Graphique de Gantt (en développement)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
