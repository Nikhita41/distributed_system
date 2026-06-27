import apiClient from './client';
import type { WorkerHealth } from '../types';

/**
 * Fetch the current worker heartbeat status.
 */
export const getWorkerHealth = async (): Promise<WorkerHealth> => {
  const response = await apiClient.get<WorkerHealth>('/worker-health');
  return response.data;
};
