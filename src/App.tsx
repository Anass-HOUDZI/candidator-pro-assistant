
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NetworkStatusIndicator } from "@/components/common/NetworkStatusIndicator";
import { PWAInstallBanner } from "@/components/common/PWAInstallBanner";
import { OfflineStatusBanner } from "@/components/common/OfflineStatusBanner";
import { OfflineModeManager } from "@/components/common/OfflineModeManager";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Candidatures from "./pages/Candidatures";
import Entreprises from "./pages/Entreprises";
import EntrepriseDetail from "./pages/EntrepriseDetail";
import Analytics from "./pages/Analytics";
import Automation from "./pages/Automation";
import Profile from "./pages/Profile";
import Scoring from "./pages/Scoring";
import Reflections from "./pages/Reflections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Ne pas retry si hors ligne
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Utiliser le cache en mode hors ligne
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
      networkMode: 'offlineFirst',
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <AuthProvider>
        <OfflineModeManager>
          <NetworkStatusIndicator />
          <PWAInstallBanner />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OfflineStatusBanner />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/candidatures" element={
                <ProtectedRoute>
                  <Candidatures />
                </ProtectedRoute>
              } />
              <Route path="/entreprises" element={
                <ProtectedRoute>
                  <Entreprises />
                </ProtectedRoute>
              } />
              <Route path="/entreprises/:id" element={
                <ProtectedRoute>
                  <EntrepriseDetail />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/automation" element={
                <ProtectedRoute>
                  <Automation />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/scoring" element={
                <ProtectedRoute>
                  <Scoring />
                </ProtectedRoute>
              } />
              <Route path="/reflections" element={
                <ProtectedRoute>
                  <Reflections />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OfflineModeManager>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
