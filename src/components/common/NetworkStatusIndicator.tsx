
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const NetworkStatusIndicator = () => {
  const [syncProgress, setSyncProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Gestion sécurisée des hooks
  let networkData, offlineData;
  try {
    networkData = useNetworkStatus();
    offlineData = useOfflineStorage();
  } catch (error) {
    console.error('Error loading network or offline hooks:', error);
    return null;
  }

  const { isOnline, effectiveType, isSlowConnection } = networkData;
  const { pendingSync, isSyncing, syncPendingData } = offlineData;

  // Animation du progress pendant la sync
  useEffect(() => {
    if (isSyncing) {
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setSyncProgress(100);
      const timeout = setTimeout(() => setSyncProgress(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isSyncing]);

  if (isOnline && !isSlowConnection && pendingSync.length === 0 && !isSyncing) {
    return null;
  }

  const getStatusColor = () => {
    if (!isOnline) return "border-red-500 bg-red-50";
    if (isSyncing) return "border-blue-500 bg-blue-50";
    if (isSlowConnection) return "border-orange-500 bg-orange-50";
    if (pendingSync.length > 0) return "border-yellow-500 bg-yellow-50";
    return "border-green-500 bg-green-50";
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-600" />;
    if (isSyncing) return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    if (isSlowConnection) return <Signal className="h-4 w-4 text-orange-600" />;
    if (pendingSync.length > 0) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getStatusMessage = () => {
    if (!isOnline) return "Mode hors ligne";
    if (isSyncing) return "Synchronisation en cours...";
    if (isSlowConnection) return `Connexion lente (${effectiveType})`;
    if (pendingSync.length > 0) return `${pendingSync.length} élément(s) en attente`;
    return "Synchronisé";
  };

  return (
    <Card className={cn(
      "fixed top-4 right-4 z-50 shadow-lg transition-all duration-300 cursor-pointer",
      getStatusColor(),
      showDetails ? "w-80" : "w-auto"
    )}>
      <CardContent className="p-3">
        <div 
          className="flex items-center gap-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusMessage()}</span>
          {pendingSync.length > 0 && (
            <span className="bg-white rounded-full px-2 py-1 text-xs font-bold">
              {pendingSync.length}
            </span>
          )}
        </div>

        {isSyncing && (
          <div className="mt-2">
            <Progress value={syncProgress} className="h-1" />
            <p className="text-xs text-gray-600 mt-1">
              Synchronisation des données...
            </p>
          </div>
        )}

        {showDetails && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>État réseau:</span>
                <span className={isOnline ? "text-green-600" : "text-red-600"}>
                  {isOnline ? "En ligne" : "Hors ligne"}
                </span>
              </div>
              
              {isOnline && (
                <div className="flex justify-between">
                  <span>Qualité:</span>
                  <span className={isSlowConnection ? "text-orange-600" : "text-green-600"}>
                    {effectiveType || "Inconnue"}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>En attente:</span>
                <span>{pendingSync.length} élément(s)</span>
              </div>
            </div>

            {isOnline && pendingSync.length > 0 && !isSyncing && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  syncPendingData();
                }}
                size="sm"
                className="w-full text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Synchroniser maintenant
              </Button>
            )}

            {!isOnline && (
              <div className="bg-red-100 p-2 rounded text-xs">
                <p className="font-medium text-red-900 mb-1">Fonctionnalités disponibles :</p>
                <ul className="text-red-800 space-y-0.5">
                  <li>• Consultation des données en cache</li>
                  <li>• Modification des candidatures</li>
                  <li>• Analytics hors ligne</li>
                  <li>• Prise de notes</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
