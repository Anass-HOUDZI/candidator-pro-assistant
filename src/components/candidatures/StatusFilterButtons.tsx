
import React from 'react';
import { Button } from '@/components/ui/button';

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

interface StatusFilterButtonsProps {
  statusOptions: StatusOption[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const StatusFilterButtons: React.FC<StatusFilterButtonsProps> = ({
  statusOptions,
  selectedStatus,
  onStatusChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((status) => (
        <Button
          key={status.value}
          variant={selectedStatus === status.value ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(selectedStatus === status.value ? '' : status.value)}
          className="text-xs"
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
};
