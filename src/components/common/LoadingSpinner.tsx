
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  speed?: 'slow' | 'normal' | 'fast';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  color = 'primary',
  speed = 'normal'
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2',
    xl: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    primary: 'border-gray-300 border-t-primary-600',
    secondary: 'border-gray-300 border-t-secondary-600',
    accent: 'border-gray-300 border-t-accent-600',
    muted: 'border-gray-200 border-t-gray-500'
  };

  const speedClasses = {
    slow: 'animate-spin duration-1000',
    normal: 'animate-spin',
    fast: 'animate-spin duration-500'
  };

  return (
    <div 
      className={cn(
        'rounded-full', 
        sizeClasses[size], 
        colorClasses[color],
        speedClasses[speed],
        className
      )}
      role="status"
      aria-label="Chargement"
    />
  );
};
