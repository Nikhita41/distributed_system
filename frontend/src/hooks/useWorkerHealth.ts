import { useQuery } from '@tanstack/react-query';
import { getWorkerHealth } from '../api/worker';
import type { WorkerHealth } from '../types';

/**
 * Hook to poll worker health every 5 seconds.
 * Notifies via toast if worker goes offline.
 */
export function useWorkerHealth() {
  return useQuery<WorkerHealth, Error>({
    queryKey: ['worker-health'],
    queryFn: getWorkerHealth,
    refetchInterval: 5000,
    staleTime: 4000,
    retry: 2,
  });
}
