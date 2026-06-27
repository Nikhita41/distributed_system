import { useQuery } from '@tanstack/react-query';
import { getQueueStatus } from '../api/queue';
import type { QueueStatus } from '../types';

/**
 * Hook to poll queue status every 5 seconds.
 */
export function useQueueStatus() {
  return useQuery<QueueStatus, Error>({
    queryKey: ['queue-status'],
    queryFn: getQueueStatus,
    refetchInterval: 5000,
    staleTime: 4000,
    retry: 3,
  });
}
