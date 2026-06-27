import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import type { TaskStatus, TaskType } from '../types';

/**
 * Merge Tailwind class names safely, handling conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date string to a human-readable relative time (e.g. "3 minutes ago").
 */
export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

/**
 * Format an ISO date string to a full date-time string.
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy HH:mm:ss');
  } catch {
    return dateStr;
  }
}

/**
 * Truncate a string to a max length, adding ellipsis if needed.
 */
export function truncate(str: string, max: number = 40): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/**
 * Get human-readable label for task type.
 */
export function getTaskTypeLabel(type: TaskType | string): string {
  const labels: Record<string, string> = {
    email: 'Email',
    report: 'Report',
    image: 'Image',
    video: 'Video',
  };
  return labels[type] ?? type;
}

/**
 * Get display config for a task status.
 */
export function getStatusConfig(status: TaskStatus | string): {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
} {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        color: 'yellow',
        bgColor: 'bg-yellow-500/15',
        textColor: 'text-yellow-400',
        dotColor: 'bg-yellow-400',
      };
    case 'PROCESSING':
      return {
        label: 'Processing',
        color: 'blue',
        bgColor: 'bg-blue-500/15',
        textColor: 'text-blue-400',
        dotColor: 'bg-blue-400',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        color: 'emerald',
        bgColor: 'bg-emerald-500/15',
        textColor: 'text-emerald-400',
        dotColor: 'bg-emerald-400',
      };
    case 'FAILED':
      return {
        label: 'Failed',
        color: 'red',
        bgColor: 'bg-red-500/15',
        textColor: 'text-red-400',
        dotColor: 'bg-red-400',
      };
    default:
      return {
        label: status,
        color: 'gray',
        bgColor: 'bg-gray-500/15',
        textColor: 'text-gray-400',
        dotColor: 'bg-gray-400',
      };
  }
}

/**
 * Get task type icon name for use with Lucide.
 */
export function getTaskTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    email: 'Mail',
    report: 'FileText',
    image: 'Image',
    video: 'Video',
  };
  return icons[type] ?? 'Zap';
}
