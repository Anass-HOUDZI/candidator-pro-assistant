
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="mb-2 text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
