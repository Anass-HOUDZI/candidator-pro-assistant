
import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

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
    rtt: 0,
    saveData: false
  });

  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'fast' | 'medium' | 'slow'>('medium');

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
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false
      };

      setNetworkStatus(status);
      
      // Analyser la qualité de connexion
      const slowConnection = connection?.effectiveType === 'slow-2g' || 
                           connection?.effectiveType === '2g' ||
                           (connection?.downlink && connection.downlink < 0.5) ||
                           (connection?.rtt && connection.rtt > 2000);
      
      const fastConnection = connection?.effectiveType === '4g' ||
                           (connection?.downlink && connection.downlink > 2) ||
                           (connection?.rtt && connection.rtt < 500);

      setIsSlowConnection(slowConnection);
      
      if (slowConnection) {
        setConnectionQuality('slow');
      } else if (fastConnection) {
        setConnectionQuality('fast');
      } else {
        setConnectionQuality('medium');
      }

      // Envoyer l'état au service worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NETWORK_STATUS_UPDATE',
          status: status
        });
      }
    };

    const handleOnline = () => {
      updateNetworkStatus();
      
      // Déclencher la synchronisation automatique
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          const syncRegistration = registration as ServiceWorkerRegistrationWithSync;
          return syncRegistration.sync.register('background-sync');
        }).catch(error => {
          console.warn('Background sync not supported:', error);
        });
      }

      // Notifier les autres composants
      window.dispatchEvent(new CustomEvent('network-online'));
    };

    const handleOffline = () => {
      updateNetworkStatus();
      window.dispatchEvent(new CustomEvent('network-offline'));
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
      
      // Adapter les requêtes selon la qualité de connexion
      const connection = (navigator as any).connection;
      if (connection && connection.saveData) {
        console.log('Data saver mode activated');
        window.dispatchEvent(new CustomEvent('data-saver-mode'));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        // Re-vérifier la connexion quand l'app redevient visible
        updateNetworkStatus();
      }
    };

    // Initialiser le statut
    updateNetworkStatus();

    // Écouter les changements
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Test périodique de la connectivité
    const connectivityCheck = setInterval(() => {
      if (navigator.onLine) {
        // Ping silencieux pour vérifier la vraie connectivité
        fetch('/manifest.json', { 
          method: 'HEAD',
          cache: 'no-cache'
        }).catch(() => {
          // La connexion semble coupée malgré navigator.onLine
          if (navigator.onLine) {
            handleOffline();
          }
        });
      }
    }, 30000); // Vérification toutes les 30 secondes

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      
      clearInterval(connectivityCheck);
    };
  }, []);

  return {
    ...networkStatus,
    isSlowConnection,
    connectionQuality
  };
};
