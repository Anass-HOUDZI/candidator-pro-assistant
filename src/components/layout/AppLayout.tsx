
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Briefcase, 
  Users, 
  Settings, 
  Target, 
  TrendingUp,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Candidatures', href: '/candidatures', icon: Briefcase },
  { name: 'Entreprises', href: '/entreprises', icon: Users },
  { name: 'Scoring', href: '/scoring', icon: Target },
  { name: 'Automatisation', href: '/automation', icon: Settings },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar mobile */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex h-16 items-center gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <div className="relative w-full max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    className="block w-full rounded-lg border-0 bg-gray-50 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm"
                    placeholder="Rechercher..."
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button className="relative rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="flex items-center gap-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-white">JC</span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="text-sm font-semibold text-gray-900">Job Candidat</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const location = useLocation();
  
  return (
    <>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobFlow</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="ml-auto lg:hidden">
              <X className="h-6 w-6 text-gray-400" />
            </button>
          )}
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                          isActive
                            ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-l-md p-3 text-sm leading-6 font-medium transition-all duration-200'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                            'h-5 w-5 shrink-0'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
