
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans JobFlow !"
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Essayez de vous connecter.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte."
      });
      setIsLogin(true);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <AuthHeader />

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
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleLogin}
              />
            ) : (
              <SignupForm
                email={email}
                password={password}
                firstName={firstName}
                lastName={lastName}
                showPassword={showPassword}
                loading={loading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleSignup}
              />
            )}

            <div className="text-center pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
              >
                {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-primary-600 hover:underline">conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-primary-600 hover:underline">politique de confidentialité</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
