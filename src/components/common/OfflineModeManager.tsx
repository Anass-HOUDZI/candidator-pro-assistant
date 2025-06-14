
import React, { useState, useEffect } from 'react';
import { CloudOff, Wifi, Download, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { cn } from '@/lib/utils';

interface OfflineModeManagerProps {
  children: React.ReactNode;
}

export const OfflineModeManager: React.FC<OfflineModeManagerProps> = ({ children }) => {
  const { isOnline, isSlowConnection, connectionQuality } = useNetworkStatus();
  const { pendingSync, isSyncing, saveOfflineData } = useOfflineStorage();
  const [offlineCapabilities, setOfflineCapabilities] = useState<string[]>([]);

  useEffect(() => {
    // Définir les capacités disponibles hors ligne
    const capabilities = [
      'Consultation des candidatures mises en cache',
      'Ajout et modification de candidatures',
      'Consultation de la base entreprises',
      'Analytics basées sur les données locales',
      'Prise de notes et réflexions',
      'Export des données en local'
    ];
    setOfflineCapabilities(capabilities);
  }, []);

  // Wrapper pour désactiver certaines fonctions en mode hors ligne
  const withOfflineCheck = (callback: () => void, requiresOnline = false) => {
    return () => {
      if (requiresOnline && !isOnline) {
        console.warn('Cette fonctionnalité nécessite une connexion internet');
        return;
      }
      callback();
    };
  };

  // Provider pour le contexte hors ligne
  const offlineContext = {
    isOnline,
    isSlowConnection,
    connectionQuality,
    pendingSync: pendingSync.length,
    isSyncing,
    saveOfflineData,
    withOfflineCheck
  };

  return (
    <div className="relative">
      {/* Overlay d'information en mode hors ligne */}
      {!isOnline && (
        <div className="fixed inset-x-4 top-20 z-40">
          <Alert className="border-orange-200 bg-orange-50">
            <CloudOff className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <span>
                  Mode hors ligne activé - Fonctionnalités limitées disponibles
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => window.location.reload()}
                >
                  <Wifi className="h-3 w-3 mr-1" />
                  Reconnecter
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Indicateur de connexion lente */}
      {isOnline && isSlowConnection && (
        <div className="fixed inset-x-4 top-20 z-40">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Connexion lente détectée - Chargement optimisé activé
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Panneau de statut détaillé (affiché quand nécessaire) */}
      {(!isOnline || pendingSync.length > 0) && (
        <div className="fixed bottom-4 left-4 z-40">
          <Card className="w-80 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {!isOnline ? (
                  <CloudOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-500" />
                )}
                {!isOnline ? 'Mode Hors Ligne' : 'Synchronisation Pending'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!isOnline && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Fonctionnalités disponibles :</p>
                  <ul className="text-xs space-y-1">
                    {offlineCapabilities.map((capability, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pendingSync.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600">
                    {pendingSync.length} élément(s) en attente de synchronisation
                  </p>
                  {isOnline && (
                    <p className="text-xs text-green-600">
                      Synchronisation automatique au retour de la connexion
                    </p>
                  )}
                </div>
              )}

              {isSyncing && (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Download className="h-3 w-3 animate-pulse" />
                  Synchronisation en cours...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contenu principal avec contexte hors ligne */}
      <div 
        className={cn(
          "transition-all duration-300",
          !isOnline && "opacity-95",
          isSlowConnection && "data-saver-mode"
        )}
        data-offline-context={JSON.stringify(offlineContext)}
      >
        {children}
      </div>
    </div>
  );
};

// Hook pour utiliser le contexte hors ligne
export const useOfflineMode = () => {
  const { isOnline, isSlowConnection, connectionQuality } = useNetworkStatus();
  const { pendingSync, isSyncing, saveOfflineData } = useOfflineStorage();

  const withOfflineCheck = (callback: () => void, requiresOnline = false) => {
    return () => {
      if (requiresOnline && !isOnline) {
        console.warn('Cette fonctionnalité nécessite une connexion internet');
        return;
      }
      callback();
    };
  };

  return {
    isOnline,
    isSlowConnection,
    connectionQuality,
    pendingSync: pendingSync.length,
    isSyncing,
    saveOfflineData,
    withOfflineCheck
  };
};
