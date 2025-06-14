
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AddReflectionDialog } from '@/components/reflections/AddReflectionDialog';
import { ReflectionFilters } from '@/components/reflections/ReflectionFilters';
import { ReflectionsHeader } from '@/components/reflections/ReflectionsHeader';
import { ReflectionsTabs } from '@/components/reflections/ReflectionsTabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Reflections = () => {
  const { toast } = useToast();
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
        <ReflectionsHeader onAddReflection={() => setShowAddDialog(true)} />

        {/* Filtres */}
        <ReflectionFilters 
          filters={filters} 
          onFiltersChange={setFilters}
        />

        {/* Tabs principales */}
        <ReflectionsTabs
          reflections={reflections}
          isLoading={isLoading}
          onRefresh={fetchReflections}
        />

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
