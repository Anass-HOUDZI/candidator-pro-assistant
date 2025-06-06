
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ExternalLink, Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  entreprise: string;
  poste: string;
  statut: string;
  date_envoi: string | null;
  localisation?: string;
  salaire?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  description?: string;
  priorite?: string;
}

const getStatusConfig = (status: string) => {
  const configs = {
    'En cours': { color: 'bg-blue-100 text-blue-800', label: 'En cours' },
    'Entretien': { color: 'bg-purple-100 text-purple-800', label: 'Entretien' },
    'Refusée': { color: 'bg-red-100 text-red-800', label: 'Refusée' },
    'Offre reçue': { color: 'bg-green-100 text-green-800', label: 'Offre reçue' }
  };
  return configs[status as keyof typeof configs] || { color: 'bg-gray-100 text-gray-800', label: status };
};

const getProchainAction = (statut: string, dateEnvoi: string) => {
  const daysSince = Math.floor((new Date().getTime() - new Date(dateEnvoi).getTime()) / (1000 * 60 * 60 * 24));
  
  switch (statut) {
    case 'Entretien':
      return 'Préparer entretien';
    case 'En cours':
      return daysSince > 14 ? 'Relance recommandée' : 'Attente réponse';
    case 'Offre reçue':
      return 'Négocier conditions';
    case 'Refusée':
      return 'Analyser feedback';
    default:
      return 'Suivi en cours';
  }
};

export const RecentApplications: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures récentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoirTout = () => {
    navigate('/candidatures');
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Candidatures Récentes
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleVoirTout}>
            Voir tout
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Aucune candidature</p>
              <p className="text-sm">Ajoutez votre première candidature pour commencer le suivi</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise / Poste
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prochaine Action
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app, index) => {
                  const statusConfig = getStatusConfig(app.statut || 'En cours');
                  const prochainAction = getProchainAction(app.statut || 'En cours', app.date_envoi || app.created_at);
                  
                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => navigate('/candidatures')}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{app.entreprise}</div>
                          <div className="text-sm text-gray-500">{app.poste}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(app.date_envoi || app.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={cn("text-xs", statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-700">
                          {app.statut === 'Entretien' && <Calendar className="mr-1 h-4 w-4 text-purple-500" />}
                          {app.statut === 'En cours' && <MessageSquare className="mr-1 h-4 w-4 text-blue-500" />}
                          {prochainAction}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/candidatures');
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
