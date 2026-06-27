import apiClient from './client';
import type { DLQReplayResponse } from '../types';

/**
 * Replay a task from the dead-letter queue by resetting its retry count
 * and re-enqueueing it.
 */
export const replayTask = async (taskId: string): Promise<DLQReplayResponse> => {
  const response = await apiClient.post<DLQReplayResponse>(`/dlq/replay/${taskId}`);
  return response.data;
};
