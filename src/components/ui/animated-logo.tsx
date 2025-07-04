import React from 'react';
import { cn } from '@/lib/utils';
interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
export const AnimatedLogo = ({
  className,
  size = 'md'
}: AnimatedLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  return <div className={cn('relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg', 'animate-logo-pulse cursor-pointer transition-all duration-300 hover:scale-110', sizeClasses[size], className)}>
      
      
      
    </div>;
};