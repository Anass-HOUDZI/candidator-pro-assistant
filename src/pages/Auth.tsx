import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Eye, EyeOff, Mail, Loader2 } from 'lucide-react';

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Google",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-large">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-display">
            JobTracker
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Votre assistant intelligent pour la recherche d'emploi
          </p>
        </div>

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
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLogin}
                      className="transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isLogin}
                      className="transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400"
                    placeholder="john@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors duration-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-11 transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLogin ? 'Connexion...' : 'Création...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : "Créer mon compte"
                )}
              </Button>
            </form>

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
