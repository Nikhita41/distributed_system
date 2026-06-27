import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../hooks/useTasks';
import { TaskTable } from '../components/task/TaskTable';
import { TaskDrawer } from '../components/task/TaskDrawer';
import { CreateTaskForm } from '../components/task/CreateTaskForm';
import type { Task } from '../types';

/**
 * Tasks page with create form and live task table side-by-side.
 */
export function TasksPage() {
  const { tasks, isLoading, isError, refetch, addTaskId, clearAllTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskCreated = (taskId: string) => {
    addTaskId(taskId);
    // Brief delay to allow backend to process before refetch
    setTimeout(() => refetch(), 500);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-[#f1f5f9]">Tasks</h1>
        <p className="text-sm text-[#64748b] mt-0.5">
          Create new tasks and monitor their status in real-time
        </p>
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Create Form */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:w-80 flex-shrink-0"
        >
          <CreateTaskForm onSuccess={handleTaskCreated} />

          {/* Session note */}
          <div className="mt-3 p-3 rounded-lg border border-[#1e1e30] bg-[#14141f]">
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              <span className="text-[#94a3b8] font-medium">Note:</span> Tasks created in this session are tracked 
              in your browser. The table refreshes every 5 seconds to show live status.
            </p>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 min-w-0"
        >
          {isError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <p className="text-sm text-red-400">Failed to load tasks. Is the backend running?</p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-xs text-[#6366f1] hover:text-[#818cf8] underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <TaskTable
              tasks={tasks}
              isLoading={isLoading}
              onTaskClick={setSelectedTask}
              onClearAll={clearAllTasks}
              onRefresh={() => refetch()}
            />
          )}
        </motion.div>
      </div>

      {/* Task Drawer */}
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
