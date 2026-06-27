import { cn } from '../../utils/formatters';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

/**
 * Animated shimmer skeleton for loading states.
 */
export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded-md shimmer',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Full metric card skeleton with icon and number placeholder.
 */
export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded shimmer" />
        <div className="h-8 w-8 rounded-lg shimmer" />
      </div>
      <div className="h-8 w-20 rounded shimmer" />
      <div className="h-2 w-32 rounded shimmer" />
    </div>
  );
}

/**
 * Table row skeleton.
 */
export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 rounded shimmer" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}
