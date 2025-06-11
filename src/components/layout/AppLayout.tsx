
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <button
            key={item.name}
            onClick={() => {
              navigate(item.href);
              onItemClick?.();
            }}
            className={cn(
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </button>
        );
      })}
    </>
  );

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">JobTracker</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavigationItems onItemClick={onItemClick} />
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t">
        <Button
          variant="ghost"
          onClick={() => {
            handleSignOut();
            onItemClick?.();
          }}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent onItemClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-bold text-gray-900">JobTracker</h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Mobile Content */}
        <main className="p-4 pb-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <SidebarContent />
      </div>

      {/* Desktop Content */}
      <div className="ml-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
