
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  saving,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 pt-6">
      <Button 
        variant="outline" 
        size="lg" 
        onClick={onCancel}
        className="w-full md:w-auto order-2 md:order-1"
      >
        Annuler
      </Button>
      <Button 
        size="lg" 
        onClick={onSave} 
        disabled={saving}
        className="w-full md:w-auto order-1 md:order-2"
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
      </Button>
    </div>
  );
};
