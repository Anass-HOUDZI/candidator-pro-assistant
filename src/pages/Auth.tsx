import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Eye, EyeOff, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithOAuth({
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
      const {
        error
      } = await supabase.auth.signInWithPassword({
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
      const {
        error
      } = await supabase.auth.signUp({
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
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-x-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">JobFlow</span>
          </div>
          
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connexion Google */}
            

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              
            </div>

            {/* Formulaire email/mot de passe */}
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              {!isLogin && <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required={!isLogin} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required={!isLogin} />
                  </div>
                </div>}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10" />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full text-sky-50 bg-indigo-800 hover:bg-indigo-700">
                {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary-900">
                {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Auth;