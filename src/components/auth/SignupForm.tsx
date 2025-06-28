
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      );
      
      if (error) {
        let errorMessage = "Une erreur est survenue lors de l'inscription";
        
        if (error.message.includes('User already registered')) {
          errorMessage = "Un compte existe déjà avec cet email. Essayez de vous connecter.";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Adresse email invalide";
        }
        
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte."
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && formData.firstName && formData.lastName;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Prénom
          </Label>
          <div className="relative group">
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
              disabled={loading}
              className="pl-11 transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400 disabled:opacity-50"
              placeholder="John"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary-500 transition-colors duration-200" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Nom
          </Label>
          <div className="relative group">
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
              disabled={loading}
              className="pl-11 transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400 disabled:opacity-50"
              placeholder="Doe"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary-500 transition-colors duration-200" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative group">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            disabled={loading}
            className="pl-11 transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400 disabled:opacity-50"
            placeholder="john@example.com"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors duration-200" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Mot de passe
        </Label>
        <div className="relative group">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="pr-11 transition-all duration-200 focus:scale-105 focus:shadow-md border-gray-200 focus:border-primary-400 disabled:opacity-50"
            placeholder="••••••••"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={loading}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4 text-gray-400" /> : 
              <Eye className="h-4 w-4 text-gray-400" />
            }
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Minimum 6 caractères
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading || !isFormValid}
        className="w-full h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Création...
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>
    </form>
  );
};
