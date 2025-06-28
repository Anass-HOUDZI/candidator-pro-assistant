
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthCard } from '@/components/auth/AuthCard';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Chargement...</p>
            <p className="text-sm text-gray-500">Vérification de votre session</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    if (isLogin) {
      navigate(from, { replace: true });
    } else {
      setIsLogin(true); // Switch to login after successful signup
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10 flex-1 flex flex-col justify-center">
        <AuthHeader />

        <AuthCard
          isLogin={isLogin}
          onToggleMode={() => setIsLogin(!isLogin)}
          onSuccess={handleSuccess}
        />

        <div className="text-center mt-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-primary-600 hover:underline">conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-primary-600 hover:underline">politique de confidentialité</a>
        </div>
      </div>

      <Footer authStyle />
    </div>
  );
};

export default Auth;
