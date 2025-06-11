
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, MessageCircle, Calendar, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReflectionsListProps {
  reflections: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

const typeLabels = {
  'note_candidature': 'Note sur candidature',
  'analyse_performance': 'Analyse de performance',
  'strategie_recherche': 'Stratégie de recherche',
  'collaboration': 'Collaboration'
};

const statusColors = {
  'en_cours': 'bg-blue-100 text-blue-800',
  'termine': 'bg-green-100 text-green-800',
  'en_attente': 'bg-yellow-100 text-yellow-800',
  'archive': 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  'basse': 'bg-gray-100 text-gray-800',
  'moyenne': 'bg-blue-100 text-blue-800',
  'haute': 'bg-orange-100 text-orange-800',
  'urgente': 'bg-red-100 text-red-800'
};

export const ReflectionsList = ({ reflections, isLoading, onRefresh }: ReflectionsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reflections.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réflexion</h3>
        <p className="text-gray-600">Commencez par créer votre première réflexion</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reflections.map((reflection) => (
        <Card key={reflection.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{reflection.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[reflection.type]}
                  </Badge>
                  <Badge className={`text-xs ${statusColors[reflection.status]}`}>
                    {reflection.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`text-xs ${priorityColors[reflection.priority]}`}>
                    {reflection.priority}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem>Partager</DropdownMenuItem>
                  <DropdownMenuItem>Archiver</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {reflection.content}
            </p>
            
            {reflection.candidatures && (
              <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                <strong>Candidature:</strong> {reflection.candidatures.poste} chez {reflection.candidatures.entreprise}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {reflection.due_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(reflection.due_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {reflection.reflection_comments?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{reflection.reflection_comments.length}</span>
                  </div>
                )}
                {reflection.reflection_collaborators?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{reflection.reflection_collaborators.length}</span>
                  </div>
                )}
              </div>
              <span>
                {formatDistanceToNow(new Date(reflection.created_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            </div>
            
            {reflection.tags && reflection.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {reflection.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
