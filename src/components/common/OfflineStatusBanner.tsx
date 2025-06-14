
import React from 'react';
import { CloudOff, Wifi, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { cn } from '@/lib/utils';

export const OfflineStatusBanner = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const { pendingSync, isSyncing, syncPendingData } = useOfflineStorage();

  // Masquer si tout va bien
  if (isOnline && !isSlowConnection && pendingSync.length === 0) {
    return null;
  }

  return (
    <Card className={cn(
      "mx-4 mb-4 border-l-4 transition-all duration-300",
      !isOnline 
        ? "border-l-red-500 bg-red-50" 
        : isSlowConnection 
        ? "border-l-orange-500 bg-orange-50"
        : pendingSync.length > 0
        ? "border-l-blue-500 bg-blue-50"
        : "border-l-green-500 bg-green-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isOnline ? (
              <CloudOff className="h-5 w-5 text-red-600" />
            ) : isSyncing ? (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            ) : isSlowConnection ? (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            ) : (
              <Wifi className="h-5 w-5 text-green-600" />
            )}
            
            <div>
              <p className={cn(
                "font-medium text-sm",
                !isOnline 
                  ? "text-red-900" 
                  : isSlowConnection 
                  ? "text-orange-900"
                  : "text-blue-900"
              )}>
                {!isOnline 
                  ? "Mode hors ligne" 
                  : isSyncing 
                  ? "Synchronisation en cours..."
                  : isSlowConnection 
                  ? "Connexion lente détectée"
                  : "Données en attente de synchronisation"
                }
              </p>
              
              <p className={cn(
                "text-xs mt-1",
                !isOnline 
                  ? "text-red-700" 
                  : isSlowConnection 
                  ? "text-orange-700"
                  : "text-blue-700"
              )}>
                {!isOnline 
                  ? `${pendingSync.length} modification(s) seront synchronisées au retour de la connexion`
                  : isSlowConnection 
                  ? "Certaines fonctionnalités peuvent être limitées"
                  : `${pendingSync.length} élément(s) en attente de synchronisation`
                }
              </p>
            </div>
          </div>

          {isOnline && pendingSync.length > 0 && !isSyncing && (
            <Button
              onClick={syncPendingData}
              size="sm"
              variant="outline"
              className="ml-4"
            >
              Synchroniser maintenant
            </Button>
          )}
        </div>

        {!isOnline && (
          <div className="mt-3 p-3 bg-red-100 rounded-lg">
            <h4 className="font-medium text-red-900 text-sm mb-1">
              Fonctionnalités disponibles hors ligne :
            </h4>
            <ul className="text-xs text-red-800 space-y-1">
              <li>• Consultation des données mises en cache</li>
              <li>• Ajout/modification de candidatures (sync automatique)</li>
              <li>• Prise de notes et réflexions</li>
              <li>• Consultation des analytics locales</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
