
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
);

export default App;
