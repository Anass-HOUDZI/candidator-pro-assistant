
import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  id: string;
  type: 'candidature' | 'entreprise' | 'reflection' | 'analytics';
  data: any;
  timestamp: number;
  action: 'create' | 'update' | 'delete';
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
}

interface CachedData {
  id: string;
  type: string;
  data: any;
  lastModified: number;
  expiresAt: number;
}

export const useOfflineStorage = () => {
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [cachedDataSize, setCachedDataSize] = useState(0);
  const { isOnline } = useNetworkStatus();
  const { toast } = useToast();

  // Initialiser IndexedDB avec version améliorée
  const initDB = useCallback(async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('JobTrackerOffline', 3);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store pour les données en attente de sync
        if (!db.objectStoreNames.contains('pendingSync')) {
          const pendingStore = db.createObjectStore('pendingSync', { keyPath: 'id' });
          pendingStore.createIndex('type', 'type', { unique: false });
          pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
          pendingStore.createIndex('priority', 'priority', { unique: false });
        }
        
        // Store pour les données mises en cache
        if (!db.objectStoreNames.contains('cachedData')) {
          const cachedStore = db.createObjectStore('cachedData', { keyPath: 'id' });
          cachedStore.createIndex('type', 'type', { unique: false });
          cachedStore.createIndex('lastModified', 'lastModified', { unique: false });
          cachedStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Store pour les métriques et analytics
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' });
          analyticsStore.createIndex('date', 'date', { unique: false });
          analyticsStore.createIndex('type', 'type', { unique: false });
        }

        // Store pour les fichiers et exports
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'id' });
          filesStore.createIndex('type', 'type', { unique: false });
          filesStore.createIndex('size', 'size', { unique: false });
        }
      };
    });
  }, []);

  // Charger les données en attente au démarrage
  useEffect(() => {
    loadPendingData();
    calculateCacheSize();
  }, []);

  // Synchroniser automatiquement quand la connexion revient
  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      const timer = setTimeout(() => {
        syncPendingData();
      }, 2000); // Délai de 2 secondes pour laisser la connexion se stabiliser

      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSync.length]);

  const loadPendingData = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction('pendingSync', 'readonly');
      const store = transaction.objectStore('pendingSync');
      
      const request = store.getAll();
      request.onsuccess = () => {
        const data = request.result.sort((a, b) => {
          // Trier par priorité puis par timestamp
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority] || 2;
          const bPriority = priorityOrder[b.priority] || 2;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }
          return a.timestamp - b.timestamp;
        });
        setPendingSync(data);
      };
    } catch (error) {
      console.error('Error loading pending data:', error);
    }
  };

  const calculateCacheSize = async () => {
    try {
      const db = await initDB();
      const stores = ['pendingSync', 'cachedData', 'analytics', 'files'];
      let totalSize = 0;

      for (const storeName of stores) {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        await new Promise((resolve) => {
          request.onsuccess = () => {
            const data = request.result;
            totalSize += JSON.stringify(data).length;
            resolve(true);
          };
        });
      }

      setCachedDataSize(Math.round(totalSize / 1024)); // En KB
    } catch (error) {
      console.error('Error calculating cache size:', error);
    }
  };

  const addToPendingSync = async (
    data: Omit<OfflineData, 'id' | 'timestamp' | 'retryCount'>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    const offlineData: OfflineData = {
      ...data,
      id: `${data.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      priority,
      retryCount: 0
    };

    try {
      const db = await initDB();
      const transaction = db.transaction('pendingSync', 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      await new Promise((resolve, reject) => {
        const request = store.add(offlineData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      setPendingSync(prev => [...prev, offlineData].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority] || 2;
        const bPriority = priorityOrder[b.priority] || 2;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return a.timestamp - b.timestamp;
      }));

      if (!isOnline) {
        toast({
          title: "Données sauvegardées hors ligne",
          description: "Vos modifications seront synchronisées au retour de la connexion."
        });
      }

      return offlineData.id;
    } catch (error) {
      console.error('Error adding to pending sync:', error);
      throw error;
    }
  };

  const syncPendingData = async () => {
    if (isSyncing || !isOnline || pendingSync.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      const db = await initDB();
      const totalItems = pendingSync.length;
      let processedItems = 0;

      for (const item of pendingSync) {
        try {
          await syncDataItem(item);
          
          // Supprimer de la queue après succès
          const transaction = db.transaction('pendingSync', 'readwrite');
          const store = transaction.objectStore('pendingSync');
          await new Promise((resolve, reject) => {
            const request = store.delete(item.id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          
          setPendingSync(prev => prev.filter(p => p.id !== item.id));
          
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Incrémenter le compteur de retry
          await updateRetryCount(item.id);
        }

        processedItems++;
        setSyncProgress((processedItems / totalItems) * 100);
      }

      if (processedItems > 0) {
        toast({
          title: "Synchronisation terminée",
          description: `${processedItems} élément(s) synchronisé(s) avec succès.`
        });
      }

    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Certains éléments n'ont pas pu être synchronisés.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
      calculateCacheSize();
    }
  };

  const updateRetryCount = async (itemId: string) => {
    try {
      const db = await initDB();
      const transaction = db.transaction('pendingSync', 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      const getRequest = store.get(itemId);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.retryCount = (item.retryCount || 0) + 1;
          
          // Supprimer après 5 tentatives échouées
          if (item.retryCount >= 5) {
            store.delete(itemId);
            setPendingSync(prev => prev.filter(p => p.id !== itemId));
          } else {
            store.put(item);
          }
        }
      };
    } catch (error) {
      console.error('Error updating retry count:', error);
    }
  };

  const syncDataItem = async (item: OfflineData) => {
    console.log('Syncing item:', item);
    
    // Simuler l'API call - remplacer par votre logique réelle
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Ici vous implémenterez les vrais appels API
    // switch (item.type) {
    //   case 'candidature':
    //     return await supabase.from('candidatures')[item.action](item.data);
    //   case 'entreprise':
    //     return await supabase.from('entreprises')[item.action](item.data);
    //   // etc.
    // }
  };

  const saveOfflineData = async (
    type: string, 
    id: string, 
    data: any, 
    expirationHours = 24
  ) => {
    try {
      const db = await initDB();
      const transaction = db.transaction('cachedData', 'readwrite');
      const store = transaction.objectStore('cachedData');
      
      const cachedRecord: CachedData = {
        id: `${type}_${id}`,
        type,
        data,
        lastModified: Date.now(),
        expiresAt: Date.now() + (expirationHours * 60 * 60 * 1000)
      };
      
      await new Promise((resolve, reject) => {
        const request = store.put(cachedRecord);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      calculateCacheSize();
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const getOfflineData = async (type?: string): Promise<any[]> => {
    try {
      const db = await initDB();
      const transaction = db.transaction('cachedData', 'readonly');
      const store = transaction.objectStore('cachedData');
      
      let request;
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const results = request.result.filter((item: CachedData) => {
            // Filtrer les données expirées
            return item.expiresAt > Date.now();
          });
          resolve(results.map(item => item.data));
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting offline data:', error);
      return [];
    }
  };

  const clearExpiredCache = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction('cachedData', 'readwrite');
      const store = transaction.objectStore('cachedData');
      const index = store.index('expiresAt');
      
      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      calculateCacheSize();
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  };

  const exportOfflineData = async () => {
    try {
      const allData = {
        pending: pendingSync,
        cached: await getOfflineData(),
        timestamp: Date.now(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jobtracker-offline-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export terminé",
        description: "Vos données hors ligne ont été exportées avec succès."
      });
    } catch (error) {
      console.error('Error exporting offline data:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données.",
        variant: "destructive"
      });
    }
  };

  // Nettoyer le cache expiré périodiquement
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, 60 * 60 * 1000); // Toutes les heures
    return () => clearInterval(interval);
  }, []);

  return {
    pendingSync,
    isSyncing,
    syncProgress,
    cachedDataSize,
    addToPendingSync,
    syncPendingData,
    saveOfflineData,
    getOfflineData,
    clearExpiredCache,
    exportOfflineData
  };
};
