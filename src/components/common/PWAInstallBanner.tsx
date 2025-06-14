
import React, { useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, installApp, shareApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50 shadow-2xl border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Installer JobTracker</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Installez l'application pour un accès rapide et des fonctionnalités hors ligne.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={installApp}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Installer
              </Button>
              <Button
                onClick={shareApp}
                variant="outline"
                size="sm"
              >
                <Share className="h-4 w-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="ml-2 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
