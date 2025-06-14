
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimisations PWA avancées
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks optimisés
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-toast', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select'
          ],
          'data-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
          'charts': ['recharts'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          'icons': ['lucide-react'],
          // Chunks pour les fonctionnalités PWA
          'offline': ['@/hooks/useOfflineStorage', '@/hooks/useNetworkStatus'],
          'pwa': ['@/hooks/usePWA', '@/components/common/NetworkStatusIndicator']
        },
        // Optimisation des noms de fichiers pour le cache
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'offline' || chunkInfo.name === 'pwa') {
            return 'assets/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/css/i.test(ext || '')) {
            return 'assets/styles/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      // Optimisations de bundle
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Taille de chunk recommandée pour PWA
    chunkSizeWarningLimit: 1000,
    // Optimisations supplémentaires
    cssCodeSplit: true,
    sourcemap: mode === 'development',
    // Preload des modules critiques
    modulePreload: {
      polyfill: true,
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
      'lucide-react'
    ],
    // Pré-bundling pour de meilleures performances
    force: false,
  },
  // Configuration PWA spécifique
  define: {
    __PWA_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  // Optimisations de développement
  esbuild: {
    // Optimisations pour le développement
    keepNames: mode === 'development',
  },
  // Configuration du serveur de développement pour PWA
  preview: {
    port: 8080,
    host: true,
    cors: true,
    headers: {
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache',
    },
  },
}));
