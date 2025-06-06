
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CandidaturesChart: React.FC = () => {
  const { toast } = useToast();
  const [candidaturesData, setCandidaturesData] = useState([]);
  const [secteurData, setSecteurData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Récupérer les candidatures
      const { data: candidatures, error: candidaturesError } = await supabase
        .from('candidatures')
        .select('*')
        .eq('user_id', user.id);

      if (candidaturesError) throw candidaturesError;

      // Récupérer les entreprises
      const { data: entreprises, error: entreprisesError } = await supabase
        .from('entreprises')
        .select('*')
        .eq('user_id', user.id);

      if (entreprisesError) throw entreprisesError;

      // Préparer les données d'évolution par mois
      const candidaturesByMonth = candidatures?.reduce((acc, candidature) => {
        const date = new Date(candidature.date_envoi || candidature.created_at);
        const monthKey = date.toLocaleDateString('fr-FR', { month: 'short' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = { mois: monthKey, candidatures: 0, entretiens: 0, acceptations: 0 };
        }
        
        acc[monthKey].candidatures++;
        if (candidature.statut === 'Entretien') acc[monthKey].entretiens++;
        if (candidature.statut === 'Offre reçue') acc[monthKey].acceptations++;
        
        return acc;
      }, {}) || {};

      const monthlyData = Object.values(candidaturesByMonth);
      setCandidaturesData(monthlyData);

      // Préparer les données par secteur
      const secteurs = entreprises?.reduce((acc, entreprise) => {
        const secteur = entreprise.secteur || 'Non spécifié';
        const candidaturesEntreprise = candidatures?.filter(c => c.entreprise === entreprise.nom)?.length || 0;
        const entretiens = candidatures?.filter(c => c.entreprise === entreprise.nom && c.statut === 'Entretien')?.length || 0;
        const tauxReponse = candidaturesEntreprise > 0 ? Math.round((entretiens / candidaturesEntreprise) * 100) : 0;
        
        if (!acc[secteur]) {
          acc[secteur] = { secteur, candidatures: 0, taux: 0, totalEntretiens: 0 };
        }
        
        acc[secteur].candidatures += candidaturesEntreprise;
        acc[secteur].totalEntretiens += entretiens;
        
        return acc;
      }, {}) || {};

      // Calculer le taux de réponse pour chaque secteur
      const secteurChartData = Object.values(secteurs).map(s => ({
        ...s,
        taux: s.candidatures > 0 ? Math.round((s.totalEntretiens / s.candidatures) * 100) : 0
      })).filter(s => s.candidatures > 0);

      setSecteurData(secteurChartData);

    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des graphiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Évolution des Candidatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="evolution" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="evolution" className="font-medium">Évolution</TabsTrigger>
              <TabsTrigger value="comparison" className="font-medium">Comparaison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evolution" className="mt-4">
              {candidaturesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={candidaturesData}>
                    <defs>
                      <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="mois" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="candidatures" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorCandidatures)"
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="entretiens" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorEntretiens)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucune donnée disponible</p>
                    <p className="text-sm">Ajoutez des candidatures pour voir l'évolution</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-4">
              {candidaturesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={candidaturesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="mois" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="candidatures" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="entretiens" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="acceptations" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucune donnée disponible</p>
                    <p className="text-sm">Ajoutez des candidatures pour voir la comparaison</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-6 w-6 text-purple-500" />
            Performance par Secteur
          </CardTitle>
        </CardHeader>
        <CardContent>
          {secteurData.length > 0 ? (
            <div className="space-y-6">
              {secteurData.map((item, index) => (
                <div key={item.secteur} className="animate-fade-in" style={{ animationDelay: `${300 + index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 text-lg">{item.secteur}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-600">{item.taux}% de réponse</span>
                      <p className="text-xs text-gray-500">{item.candidatures} candidatures</p>
                    </div>
                  </div>
                  
                  {/* Barre de progression pour les candidatures */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Candidatures</span>
                      <span>{item.candidatures}/50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min((item.candidatures / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Barre de progression pour le taux de réponse */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Taux de réponse</span>
                      <span>{item.taux}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.taux}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Aucune donnée de secteur</p>
                <p className="text-sm">Ajoutez des entreprises et candidatures pour voir les performances</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
