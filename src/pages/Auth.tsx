
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthCard } from '@/components/auth/AuthCard';
import { Footer } from '@/components/layout/Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10 flex-1 flex flex-col justify-center">
        <AuthHeader />

        <AuthCard
          isLogin={isLogin}
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
          onLogin={handleLogin}
          onSignup={handleSignup}
          onToggleMode={() => setIsLogin(!isLogin)}
        />

        <div className="text-center mt-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-primary-600 hover:underline">conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-primary-600 hover:underline">politique de confidentialité</a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
