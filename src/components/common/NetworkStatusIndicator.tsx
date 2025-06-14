
import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';

export const NetworkStatusIndicator = () => {
  const { isOnline, effectiveType, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) {
    return null; // Masquer l'indicateur quand tout va bien
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all duration-300",
      !isOnline 
        ? "bg-red-500 text-white" 
        : isSlowConnection 
        ? "bg-orange-500 text-white"
        : "bg-green-500 text-white"
    )}>
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Mode hors ligne</span>
        </>
      ) : isSlowConnection ? (
        <>
          <Signal className="h-4 w-4" />
          <span>Connexion lente ({effectiveType})</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4" />
          <span>En ligne</span>
        </>
      )}
    </div>
  );
};
