import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasksByIds } from '../api/tasks';
import type { Task } from '../types';

const STORAGE_KEY = 'dtq_task_ids';

/**
 * Hook to manage the locally tracked list of task IDs (persisted in localStorage)
 * and fetch their current state from the API.
 */
export function useTasks() {
  const [taskIds, setTaskIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist task IDs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskIds));
  }, [taskIds]);

  const addTaskId = useCallback((id: string) => {
    setTaskIds((prev) => {
      if (prev.includes(id)) return prev;
      return [id, ...prev];
    });
  }, []);

  const removeTaskId = useCallback((id: string) => {
    setTaskIds((prev) => prev.filter((tid) => tid !== id));
  }, []);

  const clearAllTasks = useCallback(() => {
    setTaskIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const { data: tasks = [], isLoading, isError, refetch } = useQuery<Task[], Error>({
    queryKey: ['tasks', taskIds],
    queryFn: () => getTasksByIds(taskIds),
    enabled: taskIds.length > 0,
    refetchInterval: 5000,
    staleTime: 4000,
  });

  return {
    tasks,
    taskIds,
    isLoading,
    isError,
    refetch,
    addTaskId,
    removeTaskId,
    clearAllTasks,
  };
}
