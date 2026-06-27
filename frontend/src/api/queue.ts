import apiClient from './client';
import type { QueueStatus } from '../types';

/**
 * Fetch aggregate queue status metrics from the backend.
 */
export const getQueueStatus = async (): Promise<QueueStatus> => {
  const response = await apiClient.get<QueueStatus>('/queue-status');
  return response.data;
};
