
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Upload, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AnalyzeOffersDialog = () => {
  const [open, setOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState<'url' | 'text' | 'file'>('url');
  const [formData, setFormData] = useState({
    url: '',
    text: '',
    file: null as File | null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simuler l'analyse IA
    setTimeout(() => {
      console.log('Analyse des offres:', { type: analysisType, data: formData });
      
      toast({
        title: "Analyse terminée",
        description: "3 nouvelles offres analysées et ajoutées à votre scoring.",
      });
      
      setIsAnalyzing(false);
      setOpen(false);
      setFormData({ url: '', text: '', file: null });
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({...formData, file});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Analyser nouvelles offres
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Analyser de nouvelles offres</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Sélection du type d'analyse */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={analysisType === 'url' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('url')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Link className="h-4 w-4" />
              <span className="text-xs">URL</span>
            </Button>
            <Button
              type="button"
              variant={analysisType === 'text' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('text')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Zap className="h-4 w-4" />
              <span className="text-xs">Texte</span>
            </Button>
            <Button
              type="button"
              variant={analysisType === 'file' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('file')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Upload className="h-4 w-4" />
              <span className="text-xs">Fichier</span>
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {analysisType === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="url">URL de l'offre d'emploi</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://exemple.com/offre-emploi"
                  required
                />
              </div>
            )}
            
            {analysisType === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="text">Texte de l'offre</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  placeholder="Collez ici le texte de l'offre d'emploi..."
                  rows={6}
                  required
                />
              </div>
            )}
            
            {analysisType === 'file' && (
              <div className="space-y-2">
                <Label htmlFor="file">Fichier PDF de l'offre</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  Formats acceptés: PDF, DOC, DOCX, TXT
                </p>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser avec IA'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
