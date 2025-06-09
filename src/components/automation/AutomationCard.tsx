
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Search, 
  FileText, 
  Calendar,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Automation {
  id: string;
  nom: string;
  type: string;
  description: string | null;
  actif: boolean | null;
  frequence: string | null;
}

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, currentState: boolean) => void;
  onEdit?: (automation: Automation) => void;
  onDelete?: (id: string) => void;
  onConfigure?: (automation: Automation) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({ 
  automation, 
  onToggle, 
  onEdit, 
  onDelete,
  onConfigure 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'veille': return Search;
      case 'rapport': return FileText;
      case 'rappel': return Calendar;
      default: return Settings;
    }
  };

  const getStatusColor = (actif: boolean | null) => {
    return actif ? 'text-green-600' : 'text-red-600';
  };

  const getFrequenceIcon = (frequence: string | null) => {
    return <Clock className="h-4 w-4" />;
  };

  const IconComponent = getTypeIcon(automation.type);

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-gray-100 rounded-lg">
              <IconComponent className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{automation.nom}</h3>
                <Badge 
                  variant={automation.actif ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    automation.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}
                >
                  {automation.actif ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {automation.description || 'Aucune description disponible'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  {getFrequenceIcon(automation.frequence)}
                  <span className="capitalize">{automation.frequence || 'quotidien'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {automation.actif ? (
                    <Play className="h-4 w-4 text-green-500" />
                  ) : (
                    <Pause className="h-4 w-4 text-red-500" />
                  )}
                  <span className={getStatusColor(automation.actif)}>
                    {automation.actif ? 'En cours' : 'En pause'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={automation.actif || false}
              onCheckedChange={() => onToggle(automation.id, automation.actif || false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(automation)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onConfigure && onConfigure(automation)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="h-4 w-4 mr-2" />
                  Historique
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(automation.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
