
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const candidaturesData = [
  { mois: 'Jan', candidatures: 12, entretiens: 4, acceptations: 1 },
  { mois: 'Fév', candidatures: 19, entretiens: 6, acceptations: 2 },
  { mois: 'Mar', candidatures: 24, entretiens: 8, acceptations: 1 },
  { mois: 'Avr', candidatures: 18, entretiens: 5, acceptations: 3 },
  { mois: 'Mai', candidatures: 26, entretiens: 9, acceptations: 2 },
  { mois: 'Juin', candidatures: 31, entretiens: 12, acceptations: 4 },
];

const secteurData = [
  { secteur: 'Tech', candidatures: 45, taux: 28 },
  { secteur: 'Finance', candidatures: 23, taux: 35 },
  { secteur: 'Santé', candidatures: 18, taux: 22 },
  { secteur: 'Education', candidatures: 15, taux: 40 },
  { secteur: 'Retail', candidatures: 12, taux: 18 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CandidaturesChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Évolution des Candidatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="evolution" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="evolution">Évolution</TabsTrigger>
              <TabsTrigger value="comparison">Comparaison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evolution" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={candidaturesData}>
                  <defs>
                    <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="candidatures" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#colorCandidatures)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="entretiens" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorEntretiens)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidaturesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="candidatures" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entretiens" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="acceptations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Performance par Secteur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {secteurData.map((item, index) => (
              <div key={item.secteur} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{item.secteur}</span>
                    <span className="text-sm text-gray-600">{item.taux}% de réponse</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.candidatures / 50) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{item.candidatures} candidatures</span>
                    <span className="text-xs text-gray-500">50 max</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
