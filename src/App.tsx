
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { NetworkStatusIndicator } from "@/components/common/NetworkStatusIndicator";
import { PWAInstallBanner } from "@/components/common/PWAInstallBanner";
import { OfflineStatusBanner } from "@/components/common/OfflineStatusBanner";
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
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Ne pas retry les mutations si hors ligne
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
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
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
