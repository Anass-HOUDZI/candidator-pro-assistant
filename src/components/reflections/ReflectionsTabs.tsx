
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReflectionsList } from '@/components/reflections/ReflectionsList';
import { ReflectionGanttChart } from '@/components/reflections/ReflectionGanttChart';
import { NotificationsPanel } from '@/components/reflections/NotificationsPanel';
import { Wifi, WifiOff, Signal, Calendar, Bell, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReflectionsTabsProps {
  reflections: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ReflectionsTabs: React.FC<ReflectionsTabsProps> = ({
  reflections,
  isLoading,
  onRefresh
}) => {
  const isMobile = useIsMobile();

  return (
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
          onRefresh={onRefresh}
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
  );
};
