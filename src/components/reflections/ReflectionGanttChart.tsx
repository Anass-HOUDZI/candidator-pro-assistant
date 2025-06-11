
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, format, isAfter, isBefore, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReflectionGanttChartProps {
  reflections: any[];
}

const statusColors = {
  'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
  'termine': 'bg-green-100 text-green-800 border-green-200',
  'en_attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'archive': 'bg-gray-100 text-gray-800 border-gray-200'
};

const priorityColors = {
  'basse': 'bg-gray-50',
  'moyenne': 'bg-blue-50',
  'haute': 'bg-orange-50',
  'urgente': 'bg-red-50'
};

export const ReflectionGanttChart = ({ reflections }: ReflectionGanttChartProps) => {
  // Filtrer les réflexions avec des dates d'échéance
  const reflectionsWithDates = reflections.filter(r => r.due_date);
  
  // Trier par date d'échéance
  const sortedReflections = reflectionsWithDates.sort((a, b) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  // Grouper par semaine pour une meilleure visualisation
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const nextMonth = addDays(today, 30);

  const overdue = sortedReflections.filter(r => isBefore(new Date(r.due_date), today));
  const thisWeek = sortedReflections.filter(r => 
    isAfter(new Date(r.due_date), today) && isBefore(new Date(r.due_date), nextWeek)
  );
  const thisMonth = sortedReflections.filter(r => 
    isAfter(new Date(r.due_date), nextWeek) && isBefore(new Date(r.due_date), nextMonth)
  );
  const later = sortedReflections.filter(r => isAfter(new Date(r.due_date), nextMonth));

  const renderReflectionGroup = (title: string, reflections: any[], bgColor: string) => {
    if (reflections.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {title} ({reflections.length})
        </h3>
        <div className="space-y-2">
          {reflections.map((reflection) => (
            <div 
              key={reflection.id} 
              className={`p-3 rounded-lg border ${bgColor} hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{reflection.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${statusColors[reflection.status]}`}>
                    {reflection.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {reflection.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(reflection.due_date), "dd MMM yyyy", { locale: fr })}
                </span>
                <span>
                  {formatDistanceToNow(new Date(reflection.due_date), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </div>
              {reflection.candidatures && (
                <div className="mt-2 text-xs text-gray-500">
                  <strong>Candidature:</strong> {reflection.candidatures.poste} - {reflection.candidatures.entreprise}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Planning des Réflexions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reflectionsWithDates.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune réflexion avec date d'échéance</p>
            <p className="text-sm text-gray-500 mt-1">
              Ajoutez des dates d'échéance à vos réflexions pour les voir apparaître ici
            </p>
          </div>
        ) : (
          <div>
            {renderReflectionGroup("En retard", overdue, "bg-red-50 border-red-200")}
            {renderReflectionGroup("Cette semaine", thisWeek, "bg-orange-50 border-orange-200")}
            {renderReflectionGroup("Ce mois", thisMonth, "bg-blue-50 border-blue-200")}
            {renderReflectionGroup("Plus tard", later, "bg-gray-50 border-gray-200")}
          </div>
        )}
        
        {/* Statistiques rapides */}
        {reflectionsWithDates.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-semibold text-red-700">{overdue.length}</div>
                <div className="text-xs text-red-600">En retard</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-semibold text-orange-700">{thisWeek.length}</div>
                <div className="text-xs text-orange-600">Cette semaine</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-700">{thisMonth.length}</div>
                <div className="text-xs text-blue-600">Ce mois</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">{later.length}</div>
                <div className="text-xs text-gray-600">Plus tard</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
