import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Filter, Search, MoreHorizontal, Eye, Edit, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddCandidatureDialog } from '@/components/candidatures/AddCandidatureDialog';
import { CandidatureActions } from '@/components/candidatures/CandidatureActions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface Candidature {
  id: string;
  entreprise: string;
  poste: string;
  statut: string | null;
  date_envoi: string | null;
  salaire: string | null;
  priorite: string | null;
}
const Candidatures = () => {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchCandidatures();
  }, []);
  const fetchCandidatures = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Information",
          description: "Connectez-vous pour voir vos candidatures"
        });
        setLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.from('candidatures').select('*').order('created_at', {
        ascending: false
      });
      if (error) {
        throw error;
      }
      setCandidatures(data || []);
    } catch (error) {
      console.error('Error fetching candidatures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatutColor = (statut: string | null) => {
    switch (statut) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Entretien':
        return 'bg-purple-100 text-purple-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refusée':
        return 'bg-red-100 text-red-800';
      case 'Accepté':
        return 'bg-emerald-100 text-emerald-800';
      case 'Offre reçue':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
            
          </div>
          <AddCandidatureDialog />
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input type="text" placeholder="Rechercher par entreprise ou poste..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des candidatures */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <div className="text-center py-8">Chargement...</div> : candidatures.length === 0 ? <div className="text-center py-8 text-gray-500">
                Aucune candidature trouvée. Ajoutez votre première candidature !
              </div> : <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Entreprise</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Poste</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Priorité</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date d'envoi</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Salaire</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatures.map(candidature => <tr key={candidature.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{candidature.entreprise}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-900">{candidature.poste}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(candidature.statut)}`}>
                            {candidature.statut || 'En cours'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            {candidature.priorite === 'Haute' && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {candidature.priorite === 'Moyenne' && <Star className="h-4 w-4 text-gray-400" />}
                            {candidature.priorite === 'Faible' && <Star className="h-4 w-4 text-gray-300" />}
                            <span className="text-sm">{candidature.priorite || 'Moyenne'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {candidature.date_envoi ? new Date(candidature.date_envoi).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-900">{candidature.salaire || '-'}</td>
                        <td className="py-4 px-4">
                          <CandidatureActions candidature={candidature} onUpdate={fetchCandidatures} />
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
};
export default Candidatures;