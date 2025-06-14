
import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

// Étendre l'interface ServiceWorkerRegistration pour inclure l'API sync
interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: {
    register: (tag: string) => Promise<void>;
  };
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0
  });

  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      const status: NetworkStatus = {
        isOnline: navigator.onLine,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0
      };

      setNetworkStatus(status);
      
      // Détecter une connexion lente
      const slowConnection = connection?.effectiveType === 'slow-2g' || 
                           connection?.effectiveType === '2g' ||
                           (connection?.downlink && connection.downlink < 0.5);
      setIsSlowConnection(slowConnection);
    };

    const handleOnline = () => {
      updateNetworkStatus();
      // Déclencher la synchronisation des données en attente
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          // Cast vers notre interface étendue pour éviter l'erreur TypeScript
          const syncRegistration = registration as ServiceWorkerRegistrationWithSync;
          return syncRegistration.sync.register('background-sync');
        });
      }
    };

    const handleOffline = () => {
      updateNetworkStatus();
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
    };

    // Initialiser le statut
    updateNetworkStatus();

    // Écouter les changements de statut réseau
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return {
    ...networkStatus,
    isSlowConnection
  };
};
