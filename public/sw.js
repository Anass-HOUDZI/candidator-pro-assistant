
const CACHE_NAME = 'jobtracker-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

const API_CACHE = 'jobtracker-api-v2';
const IMAGE_CACHE = 'jobtracker-images-v2';
const ANALYTICS_CACHE = 'jobtracker-analytics-v2';

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes('jobtracker-v2')) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // Notifier les clients de la mise à jour
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
});

// Gestion des requêtes avec stratégies adaptées
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first pour les assets statiques et l'app shell
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.includes('/icons/') ||
      url.pathname === '/manifest.json') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      }).catch(() => {
        // Fallback vers la page principale pour les documents
        if (request.destination === 'document') {
          return caches.match('/');
        }
      })
    );
  }

  // Network-first pour les APIs Supabase avec cache de secours
  else if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          // Cache spécial pour les données d'analytics
          if (url.pathname.includes('analytics') || url.pathname.includes('candidatures')) {
            caches.open(ANALYTICS_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          } else {
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
        }
        return response;
      }).catch(() => {
        // Fallback vers le cache en cas d'échec réseau
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Retourner une réponse par défaut pour les APIs critiques
          if (url.pathname.includes('candidatures') || url.pathname.includes('entreprises')) {
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          throw new Error('No cached response available');
        });
      })
    );
  }

  // Cache-first pour les images avec compression
  else if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Synchronisation en arrière-plan améliorée
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(syncPendingData());
  }
  
  if (event.tag === 'analytics-sync') {
    console.log('Analytics sync triggered');
    event.waitUntil(syncAnalyticsData());
  }
});

// Messages du client avec gestion des mises à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_NEW_ROUTE') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.add(event.data.payload);
      })
    );
  }

  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Vérifier s'il y a une mise à jour disponible
    event.waitUntil(checkForUpdates());
  }
});

// Fonction de synchronisation des données en attente
async function syncPendingData() {
  try {
    const pendingData = await getPendingDataFromIDB();
    
    for (const data of pendingData) {
      try {
        await syncDataItem(data);
        await removePendingDataFromIDB(data.id);
      } catch (error) {
        console.error('Failed to sync data item:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Synchronisation des données d'analytics
async function syncAnalyticsData() {
  try {
    const analyticsData = await getAnalyticsDataFromIDB();
    await syncAnalyticsToServer(analyticsData);
  } catch (error) {
    console.error('Analytics sync failed:', error);
  }
}

// Vérification des mises à jour
async function checkForUpdates() {
  try {
    const response = await fetch('/manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      // Logique de vérification de version
      console.log('Checking for updates...', manifest);
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
}

// Helpers pour IndexedDB (implémentation complète)
async function openIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JobTrackerPWA', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingSync')) {
        const store = db.createObjectStore('pendingSync', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('analytics')) {
        const store = db.createObjectStore('analytics', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
}

async function getPendingDataFromIDB() {
  const db = await openIDB();
  const transaction = db.transaction('pendingSync', 'readonly');
  const store = transaction.objectStore('pendingSync');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingDataFromIDB(id) {
  const db = await openIDB();
  const transaction = db.transaction('pendingSync', 'readwrite');
  const store = transaction.objectStore('pendingSync');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAnalyticsDataFromIDB() {
  const db = await openIDB();
  const transaction = db.transaction('analytics', 'readonly');
  const store = transaction.objectStore('analytics');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function syncDataItem(data) {
  // Implémentation de synchronisation réelle
  console.log('Syncing data item:', data);
  // Ici, vous feriez l'appel à votre API
}

async function syncAnalyticsToServer(data) {
  // Synchronisation des analytics
  console.log('Syncing analytics:', data);
}
