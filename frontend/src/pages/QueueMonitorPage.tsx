import { motion } from 'framer-motion';
import {
  Database,
  Clock,
  CheckCircle2,
  XCircle,
  Skull,
  Loader2,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { useQueueStatus } from '../hooks/useQueueStatus';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { cn } from '../utils/formatters';

interface BigCounterProps {
  label: string;
  value: number;
  icon: typeof Database;
  color: string;
  bgColor: string;
  delay?: number;
}

function BigCounter({ label, value, icon: Icon, color, bgColor, delay = 0 }: BigCounterProps) {
  const animated = useAnimatedCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-[#1e1e30] bg-[#0f0f18] p-6 flex flex-col items-center text-center group relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}08 0%, transparent 70%)` }}
      />

      <div
        className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', bgColor)}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      <motion.span
        className="text-5xl font-black tabular-nums mb-2"
        style={{ color }}
      >
        {animated.toLocaleString()}
      </motion.span>

      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

/**
 * Queue Monitor page with large animated counters for all queue metrics.
 */
export function QueueMonitorPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQueueStatus();

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9]">Queue Monitor</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Live queue metrics — auto-refreshes every 5 seconds</p>
        </div>
        <div className="flex items-center gap-3">
          {isFetching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-xs text-[#64748b]"
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              Refreshing...
            </motion.div>
          )}
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1e1e30] text-xs text-[#64748b] hover:text-[#94a3b8] hover:border-[#2a2a42] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Now
          </button>
        </div>
      </motion.div>

      {isError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-12 text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-300">Cannot reach backend</p>
          <p className="text-xs text-red-400/70 mt-1">Is the FastAPI server running on port 8000?</p>
          <button
            onClick={() => refetch()}
            className="mt-4 text-xs text-[#6366f1] hover:text-[#818cf8] underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1e1e30] bg-[#0f0f18] w-fit"
          >
            <Activity className="w-3.5 h-3.5 text-[#6366f1]" />
            <span className="text-xs text-[#64748b]">Live monitoring active</span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Main counters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BigCounter
              label="Redis Queue"
              value={data?.redis_queue_size ?? 0}
              icon={Database}
              color="#a855f7"
              bgColor="bg-purple-500/10"
              delay={0}
            />
            <BigCounter
              label="Pending"
              value={data?.pending_tasks ?? 0}
              icon={Clock}
              color="#eab308"
              bgColor="bg-yellow-500/10"
              delay={0.05}
            />
            <BigCounter
              label="Processing"
              value={data?.processing_tasks ?? 0}
              icon={Loader2}
              color="#3b82f6"
              bgColor="bg-blue-500/10"
              delay={0.1}
            />
            <BigCounter
              label="Completed"
              value={data?.completed_tasks ?? 0}
              icon={CheckCircle2}
              color="#10b981"
              bgColor="bg-emerald-500/10"
              delay={0.15}
            />
            <BigCounter
              label="Failed"
              value={data?.failed_tasks ?? 0}
              icon={XCircle}
              color="#ef4444"
              bgColor="bg-red-500/10"
              delay={0.2}
            />
            <BigCounter
              label="Dead Letter"
              value={data?.dead_letter_queue ?? 0}
              icon={Skull}
              color="#f97316"
              bgColor="bg-orange-500/10"
              delay={0.25}
            />
          </div>

          {/* Success rate */}
          {data && (data.completed_tasks + data.failed_tasks > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#f1f5f9]">Task Success Rate</span>
                <span className="text-lg font-black text-emerald-400">
                  {Math.round((data.completed_tasks / (data.completed_tasks + data.failed_tasks)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(data.completed_tasks / (data.completed_tasks + data.failed_tasks)) * 100}%`,
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#6366f1] to-[#10b981] rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-[#64748b] mt-1.5">
                <span>{data.completed_tasks} completed</span>
                <span>{data.failed_tasks} failed</span>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12 text-[#64748b]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading queue status...
            </div>
          )}
        </>
      )}
    </div>
  );
}
