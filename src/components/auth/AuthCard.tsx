
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

interface AuthCardProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  isLogin,
  onToggleMode,
  onSuccess
}) => {
  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-large animate-scale-in">
      <CardHeader className="text-center space-y-2 pb-6">
        <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {isLogin ? 'Connectez-vous à votre compte' : 'Rejoignez JobTracker aujourd\'hui'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLogin ? (
          <LoginForm onSuccess={onSuccess} />
        ) : (
          <SignupForm onSuccess={onSuccess} />
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <button
            onClick={onToggleMode}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
          >
            {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
