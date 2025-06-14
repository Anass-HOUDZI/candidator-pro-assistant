
import { useState, useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';

interface OfflineData {
  id: string;
  type: 'candidature' | 'entreprise' | 'reflection';
  data: any;
  timestamp: number;
  action: 'create' | 'update' | 'delete';
}

export const useOfflineStorage = () => {
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline } = useNetworkStatus();

  // Initialiser IndexedDB
  useEffect(() => {
    initDB();
    loadPendingData();
  }, []);

  // Synchroniser automatiquement quand la connexion revient
  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      syncPendingData();
    }
  }, [isOnline, pendingSync]);

  const initDB = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('JobTrackerOffline', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('pendingSync')) {
          const store = db.createObjectStore('pendingSync', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('lastModified', 'lastModified', { unique: false });
        }
      };
    });
  };

  const loadPendingData = async () => {
    try {
      const db = await initDB() as IDBDatabase;
      const transaction = db.transaction('pendingSync', 'readonly');
      const store = transaction.objectStore('pendingSync');
      const request = store.getAll();
      
      request.onsuccess = () => {
        setPendingSync(request.result);
      };
    } catch (error) {
      console.error('Error loading pending data:', error);
    }
  };

  const addToPendingSync = async (data: Omit<OfflineData, 'id' | 'timestamp'>) => {
    const offlineData: OfflineData = {
      ...data,
      id: `${data.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    try {
      const db = await initDB() as IDBDatabase;
      const transaction = db.transaction('pendingSync', 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      await new Promise((resolve, reject) => {
        const request = store.add(offlineData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      setPendingSync(prev => [...prev, offlineData]);
      return offlineData.id;
    } catch (error) {
      console.error('Error adding to pending sync:', error);
      throw error;
    }
  };

  const syncPendingData = async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    
    try {
      const db = await initDB() as IDBDatabase;
      
      for (const item of pendingSync) {
        try {
          // Simuler l'API call - remplacer par votre logique réelle
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
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncDataItem = async (item: OfflineData) => {
    // Implémentation de la synchronisation avec votre API
    // Cette fonction doit être adaptée selon votre backend
    console.log('Syncing item:', item);
    
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Ici vous feriez l'appel réel à votre API Supabase
    // switch (item.type) {
    //   case 'candidature':
    //     return await supabase.from('candidatures')[item.action](item.data);
    //   case 'entreprise':
    //     return await supabase.from('entreprises')[item.action](item.data);
    //   // etc.
    // }
  };

  const saveOfflineData = async (type: string, id: string, data: any) => {
    try {
      const db = await initDB() as IDBDatabase;
      const transaction = db.transaction('offlineData', 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      const offlineRecord = {
        id: `${type}_${id}`,
        type,
        data,
        lastModified: Date.now()
      };
      
      await new Promise((resolve, reject) => {
        const request = store.put(offlineRecord);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const getOfflineData = async (type?: string) => {
    try {
      const db = await initDB() as IDBDatabase;
      const transaction = db.transaction('offlineData', 'readonly');
      const store = transaction.objectStore('offlineData');
      
      let request;
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting offline data:', error);
      return [];
    }
  };

  return {
    pendingSync,
    isSyncing,
    addToPendingSync,
    syncPendingData,
    saveOfflineData,
    getOfflineData
  };
};
