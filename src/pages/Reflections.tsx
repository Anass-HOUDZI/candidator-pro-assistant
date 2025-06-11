
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReflectionsList } from '@/components/reflections/ReflectionsList';
import { AddReflectionDialog } from '@/components/reflections/AddReflectionDialog';
import { ReflectionFilters } from '@/components/reflections/ReflectionFilters';
import { ReflectionGanttChart } from '@/components/reflections/ReflectionGanttChart';
import { NotificationsPanel } from '@/components/reflections/NotificationsPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Bell, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Reflections = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [reflections, setReflections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });

  useEffect(() => {
    fetchReflections();
  }, [filters]);

  const fetchReflections = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        setIsLoading(false);
        return;
      }

      console.log('Fetching reflections for user:', user.id);

      let query = supabase
        .from('reflections')
        .select(`
          *,
          candidatures(entreprise, poste)
        `)
        .eq('user_id', user.id);

      // Appliquer les filtres
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reflections:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les réflexions",
          variant: "destructive"
        });
      } else {
        console.log('Reflections fetched:', data);
        setReflections(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflectionAdded = () => {
    fetchReflections();
    setShowAddDialog(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Réflexions</h1>
            <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
              Gérez vos notes, analyses et stratégies de recherche d'emploi
            </p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Réflexion
          </Button>
        </div>

        {/* Filtres */}
        <ReflectionFilters 
          filters={filters} 
          onFiltersChange={setFilters}
        />

        {/* Tabs principales */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <TabsTrigger value="list" className="gap-1 lg:gap-2 text-xs lg:text-sm">
              <Users className="h-3 w-3 lg:h-4 lg:w-4" />
              {!isMobile && "Liste"}
            </TabsTrigger>
            <TabsTrigger value="gantt" className="gap-1 lg:gap-2 text-xs lg:text-sm">
              <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
              {!isMobile && "Planning"}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="gap-2">
                  <Users className="h-4 w-4" />
                  Collaboration
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="list" className="mt-4 lg:mt-6">
            <ReflectionsList 
              reflections={reflections}
              isLoading={isLoading}
              onRefresh={fetchReflections}
            />
          </TabsContent>

          <TabsContent value="gantt" className="mt-4 lg:mt-6">
            <ReflectionGanttChart reflections={reflections} />
          </TabsContent>

          {!isMobile && (
            <>
              <TabsContent value="notifications" className="mt-6">
                <NotificationsPanel />
              </TabsContent>

              <TabsContent value="collaboration" className="mt-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration en équipe</h3>
                  <p className="text-gray-600">Fonctionnalité en développement - Partagez et collaborez sur vos réflexions</p>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Dialog d'ajout */}
        <AddReflectionDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onReflectionAdded={handleReflectionAdded}
        />
      </div>
    </AppLayout>
  );
};

export default Reflections;
