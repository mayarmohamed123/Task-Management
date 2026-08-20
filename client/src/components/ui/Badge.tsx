import React from 'react';
import { cn } from '../../utils/cn.js';
import { TaskStatus, TaskPriority } from '../../types/index.js';
import { getStatusConfig, getPriorityConfig } from '../../utils/formatters.js';

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors',
        config.badgeBg,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotBg)} />
      {config.label}
    </span>
  );
};

export interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const config = getPriorityConfig(priority);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors',
        config.badgeBg,
        className
      )}
    >
      <span className={cn('font-bold', config.iconColor)}>•</span>
      {config.label}
    </span>
  );
};
