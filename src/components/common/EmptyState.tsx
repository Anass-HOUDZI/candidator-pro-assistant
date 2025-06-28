
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-6',
      icon: 'mb-3 text-4xl',
      title: 'text-base font-medium mb-1',
      description: 'text-sm',
      action: 'mt-3'
    },
    md: {
      container: 'py-8',
      icon: 'mb-4 text-5xl',
      title: 'text-lg font-medium mb-2',
      description: 'text-sm',
      action: 'mt-4'
    },
    lg: {
      container: 'py-12',
      icon: 'mb-6 text-6xl',
      title: 'text-xl font-semibold mb-3',
      description: 'text-base',
      action: 'mt-6'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn('text-center text-gray-500', classes.container, className)}>
      {icon && (
        <div className={cn('flex justify-center', classes.icon)}>
          {icon}
        </div>
      )}
      <h3 className={cn('text-gray-900', classes.title)}>
        {title}
      </h3>
      {description && (
        <p className={cn('text-gray-600 max-w-sm mx-auto', classes.description)}>
          {description}
        </p>
      )}
      {action && (
        <div className={classes.action}>
          {action}
        </div>
      )}
    </div>
  );
};
