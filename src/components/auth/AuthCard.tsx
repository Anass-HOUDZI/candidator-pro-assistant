
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

interface AuthCardProps {
  isLogin: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  showPassword: boolean;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
  onTogglePassword: () => void;
  onLogin: (e: React.FormEvent) => void;
  onSignup: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  isLogin,
  email,
  password,
  firstName,
  lastName,
  showPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onTogglePassword,
  onLogin,
  onSignup,
  onToggleMode
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
          <LoginForm
            email={email}
            password={password}
            showPassword={showPassword}
            loading={loading}
            onEmailChange={onEmailChange}
            onPasswordChange={onPasswordChange}
            onTogglePassword={onTogglePassword}
            onSubmit={onLogin}
          />
        ) : (
          <SignupForm
            email={email}
            password={password}
            firstName={firstName}
            lastName={lastName}
            showPassword={showPassword}
            loading={loading}
            onEmailChange={onEmailChange}
            onPasswordChange={onPasswordChange}
            onFirstNameChange={onFirstNameChange}
            onLastNameChange={onLastNameChange}
            onTogglePassword={onTogglePassword}
            onSubmit={onSignup}
          />
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
