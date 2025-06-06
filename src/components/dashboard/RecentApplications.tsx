import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ExternalLink, Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Application {
  id: string;
  entreprise: string;
  poste: string;
  statut: 'envoyee' | 'relancee' | 'entretien' | 'refusee' | 'acceptee';
  datePostulation: string;
  score: number;
  prochainAction: string;
}

const applications: Application[] = [
  {
    id: '1',
    entreprise: 'TechCorp',
    poste: 'Développeur Full Stack',
    statut: 'entretien',
    datePostulation: '2024-01-15',
    score: 92,
    prochainAction: 'Entretien demain 14h'
  },
  {
    id: '2',
    entreprise: 'StartupIA',
    poste: 'Lead Developer',
    statut: 'relancee',
    datePostulation: '2024-01-10',
    score: 88,
    prochainAction: 'Relance dans 3 jours'
  },
  {
    id: '3',
    entreprise: 'BigTech Inc',
    poste: 'Senior Engineer',
    statut: 'envoyee',
    datePostulation: '2024-01-12',
    score: 85,
    prochainAction: 'Attente réponse'
  },
  {
    id: '4',
    entreprise: 'CloudCompany',
    poste: 'DevOps Engineer',
    statut: 'acceptee',
    datePostulation: '2024-01-08',
    score: 95,
    prochainAction: 'Négocier salaire'
  },
  {
    id: '5',
    entreprise: 'WebAgency',
    poste: 'Frontend Developer',
    statut: 'refusee',
    datePostulation: '2024-01-05',
    score: 78,
    prochainAction: 'Feedback reçu'
  }
];

const getStatusConfig = (status: string) => {
  const configs = {
    envoyee: { color: 'bg-blue-100 text-blue-800', label: 'Envoyée' },
    relancee: { color: 'bg-yellow-100 text-yellow-800', label: 'Relancée' },
    entretien: { color: 'bg-purple-100 text-purple-800', label: 'Entretien' },
    refusee: { color: 'bg-red-100 text-red-800', label: 'Refusée' },
    acceptee: { color: 'bg-green-100 text-green-800', label: 'Acceptée' }
  };
  return configs[status as keyof typeof configs] || configs.envoyee;
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 80) return 'text-blue-600 bg-blue-50';
  if (score >= 70) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

export const RecentApplications: React.FC = () => {
  const navigate = useNavigate();

  const handleVoirTout = () => {
    navigate('/candidatures');
  };

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
                  Score
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
                const statusConfig = getStatusConfig(app.statut);
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
                          {new Date(app.datePostulation).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={cn("text-xs", statusConfig.color)}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        getScoreColor(app.score)
                      )}>
                        {app.score}/100
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-sm text-gray-700">
                        {app.statut === 'entretien' && <Calendar className="mr-1 h-4 w-4 text-purple-500" />}
                        {app.statut === 'relancee' && <MessageSquare className="mr-1 h-4 w-4 text-yellow-500" />}
                        {app.prochainAction}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Action spécifique pour chaque candidature
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
      </CardContent>
    </Card>
  );
};
