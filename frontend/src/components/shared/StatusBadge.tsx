import { motion } from 'framer-motion';
import { cn, getStatusConfig } from '../../utils/formatters';
import type { TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus | string;
  pulse?: boolean;
  className?: string;
}

/**
 * Colored badge for task status with optional pulsing animation for active states.
 */
export function StatusBadge({ status, pulse = false, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const shouldPulse = pulse && status === 'PROCESSING';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {shouldPulse && (
          <motion.span
            className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', config.dotColor)}
            animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', config.dotColor)} />
      </span>
      {config.label}
    </span>
  );
}
