
const CACHE_NAME = 'jobtracker-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

const API_CACHE = 'jobtracker-api-v1';
const IMAGE_CACHE = 'jobtracker-images-v1';

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
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first pour les assets statiques
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style') {
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
        // Fallback vers la page principale en cas d'erreur
        if (request.destination === 'document') {
          return caches.match('/');
        }
      })
    );
  }

  // Network-first pour les APIs Supabase
  else if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
  }

  // Cache-first pour les images
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

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(syncPendingData());
  }
});

// Messages du client
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
});

// Fonction de synchronisation des données en attente
async function syncPendingData() {
  try {
    // Récupérer les données en attente depuis IndexedDB
    const pendingData = await getPendingData();
    
    for (const data of pendingData) {
      try {
        // Tenter de synchroniser chaque élément
        await syncDataItem(data);
        // Supprimer de la queue locale si succès
        await removePendingData(data.id);
      } catch (error) {
        console.error('Failed to sync data item:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helpers pour IndexedDB (implémentation simplifiée)
async function getPendingData() {
  // Implémentation IndexedDB pour récupérer les données en attente
  return [];
}

async function syncDataItem(data) {
  // Implémentation de la synchronisation avec l'API
}

async function removePendingData(id) {
  // Supprimer l'élément de la queue IndexedDB
}
