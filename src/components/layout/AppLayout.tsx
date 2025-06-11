
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  TrendingUp, 
  Settings, 
  User,
  Bot,
  Target,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Candidatures', href: '/candidatures', icon: FileText },
  { name: 'Entreprises', href: '/entreprises', icon: Building2 },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Automation', href: '/automation', icon: Bot },
  { name: 'Scoring', href: '/scoring', icon: Target },
  { name: 'Réflexions', href: '/reflections', icon: MessageSquare },
  { name: 'Profil', href: '/profile', icon: User },
];

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">JobTracker</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="px-4 py-4 border-t">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
