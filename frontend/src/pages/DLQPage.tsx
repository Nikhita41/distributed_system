import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Skull, RefreshCw, Loader2, AlertTriangle, RotateCcw, Copy, Check } from 'lucide-react';
import { replayTask } from '../api/dlq';
import { useQueueStatus } from '../hooks/useQueueStatus';
import { useTasks } from '../hooks/useTasks';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { cn, formatRelativeTime, truncate } from '../utils/formatters';
import type { Task } from '../types';

function ReplayButton({ taskId, onSuccess }: { taskId: string; onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => replayTask(taskId),
    onSuccess: () => {
      toast.success('Task Replayed!', {
        description: `Task ${taskId.slice(0, 8)}… has been re-queued.`,
      });
      queryClient.invalidateQueries({ queryKey: ['queue-status'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess();
    },
    onError: () => {
      toast.error('Replay Failed', { description: 'Could not replay task.' });
    },
  });

  return (
    <motion.button
      whileHover={!isPending ? { scale: 1.04 } : {}}
      whileTap={!isPending ? { scale: 0.96 } : {}}
      onClick={() => mutate()}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
        isPending
          ? 'bg-[#1a1a2e] text-[#64748b] cursor-not-allowed'
          : 'bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/25 hover:bg-[#6366f1]/20'
      )}
      aria-label={`Replay task ${taskId}`}
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <RotateCcw className="w-3 h-3" />
      )}
      {isPending ? 'Replaying...' : 'Replay'}
    </motion.button>
  );
}

function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-[#64748b] hover:text-[#94a3b8] transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

/**
 * Dead Letter Queue page showing all locally-tracked failed tasks with replay functionality.
 */
export function DLQPage() {
  const { data: queueStatus, refetch: refetchQueue } = useQueueStatus();
  const { tasks, refetch: refetchTasks } = useTasks();

  const failedTasks = tasks.filter((t: Task) => t.status === 'FAILED');

  const handleReplaySuccess = () => {
    refetchQueue();
    refetchTasks();
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <Skull className="w-5 h-5 text-orange-400" />
            Dead Letter Queue
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Tasks that permanently failed. Replay them to re-queue.
          </p>
        </div>
        <button
          onClick={() => { refetchQueue(); refetchTasks(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e30] text-xs text-[#64748b] hover:text-[#94a3b8] hover:border-[#2a2a42] transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </motion.div>

      {/* DLQ Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5"
        >
          <p className="text-xs text-orange-400/70 uppercase tracking-wider mb-2">Redis DLQ Size</p>
          <p className="text-4xl font-black text-orange-400">
            {queueStatus?.dead_letter_queue ?? '—'}
          </p>
          <p className="text-xs text-[#64748b] mt-1">Total in dead letter queue</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-5"
        >
          <p className="text-xs text-red-400/70 uppercase tracking-wider mb-2">Failed (Session)</p>
          <p className="text-4xl font-black text-red-400">{failedTasks.length}</p>
          <p className="text-xs text-[#64748b] mt-1">Failed tasks this session</p>
        </motion.div>
      </div>

      {/* Warning Banner */}
      {(queueStatus?.dead_letter_queue ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 rounded-xl border border-orange-500/25 bg-orange-500/6"
        >
          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-300">
              {queueStatus?.dead_letter_queue} task{queueStatus?.dead_letter_queue !== 1 ? 's' : ''} in the dead letter queue
            </p>
            <p className="text-xs text-orange-400/70 mt-0.5">
              These tasks exceeded the maximum retry limit (5 retries) or were rejected by the circuit breaker.
              Replay them to try again.
            </p>
          </div>
        </motion.div>
      )}

      {/* Failed Tasks Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-[#1e1e30] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#f1f5f9]">
            Failed Tasks — This Session
          </h2>
          <span className="text-xs text-[#64748b]">
            {failedTasks.length} task{failedTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {failedTasks.length === 0 ? (
          <EmptyState
            title="No failed tasks"
            description="All tracked tasks are healthy. Failed tasks will appear here for replay."
            icon="inbox"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e30]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b]">Task</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b]">Reason</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b]">Retries</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b]">Failed</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b]">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#64748b]">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {failedTasks.map((task) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="border-b border-[#1e1e30]/50 hover:bg-[#14141f] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#94a3b8] font-medium capitalize">
                              {task.task_type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] font-mono text-[#64748b]">
                              {task.id.slice(0, 12)}…
                            </span>
                            <CopyIdButton id={task.id} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-red-400/80 max-w-48 block">
                          {truncate(task.result ?? 'Unknown failure', 50)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold text-red-400">{task.retry_count}</span>
                        <span className="text-xs text-[#64748b]"> / 5</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-[#64748b]">
                          {formatRelativeTime(task.updated_at)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ReplayButton taskId={task.id} onSuccess={handleReplaySuccess} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
