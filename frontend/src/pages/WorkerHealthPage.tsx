import { motion, AnimatePresence } from 'framer-motion';
import { Heart, AlertTriangle, WifiOff, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useWorkerHealth } from '../hooks/useWorkerHealth';
import { formatRelativeTime } from '../utils/formatters';

/**
 * Worker Health page with heartbeat animation and status display.
 */
export function WorkerHealthPage() {
  const { data: worker, isLoading, isError, refetch } = useWorkerHealth();

  const isHealthy = worker?.status === 'HEALTHY';

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#f1f5f9]">Worker Health</h1>
        <p className="text-sm text-[#64748b] mt-0.5">
          Monitor the background worker heartbeat in real-time
        </p>
      </motion.div>

      {/* Offline Warning Banner */}
      <AnimatePresence>
        {worker?.status === 'OFFLINE' && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/8"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">Worker is Offline</p>
              <p className="text-xs text-red-400/70 mt-0.5">
                The background worker is not sending heartbeats. New tasks will be queued but not processed until
                the worker comes back online. Check that <code className="text-red-300">worker.py</code> is running.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main heartbeat display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#1e1e30] bg-[#0f0f18] p-10 flex flex-col items-center text-center"
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin" />
            <p className="text-sm text-[#64748b]">Checking worker status...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <WifiOff className="w-10 h-10 text-red-400" />
            <p className="text-sm font-semibold text-red-300">Cannot connect to backend</p>
            <button onClick={() => refetch()} className="text-xs text-[#6366f1] hover:text-[#818cf8] underline">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Heartbeat animation */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Pulsing rings */}
              {isHealthy && (
                <>
                  <motion.div
                    className="absolute rounded-full border border-emerald-500/30"
                    style={{ width: 180, height: 180 }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full border border-emerald-500/20"
                    style={{ width: 180, height: 180 }}
                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                  />
                </>
              )}

              {/* Core icon */}
              <motion.div
                className={`relative w-28 h-28 rounded-full flex items-center justify-center ${
                  isHealthy
                    ? 'bg-emerald-500/10 border-2 border-emerald-500/30'
                    : 'bg-red-500/10 border-2 border-red-500/30'
                }`}
                animate={isHealthy ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart
                  className={`w-12 h-12 ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`}
                  fill={isHealthy ? 'currentColor' : 'none'}
                />
              </motion.div>
            </div>

            {/* Status text */}
            <motion.div
              key={worker?.status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 mb-8"
            >
              <div className="flex items-center justify-center gap-2">
                {isHealthy ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span
                  className={`text-3xl font-black ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {isHealthy ? 'HEALTHY' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-sm text-[#64748b]">
                {isHealthy
                  ? 'Worker is actively processing tasks'
                  : 'Worker has not sent a heartbeat in 30+ seconds'}
              </p>
            </motion.div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="rounded-xl border border-[#1e1e30] bg-[#14141f] p-4">
                <p className="text-xs text-[#64748b] mb-1.5">Heartbeat Status</p>
                <p className={`text-sm font-bold ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isHealthy ? '< 30 seconds' : 'No signal'}
                </p>
              </div>
              <div className="rounded-xl border border-[#1e1e30] bg-[#14141f] p-4">
                <p className="text-xs text-[#64748b] mb-1.5">Poll Interval</p>
                <p className="text-sm font-bold text-[#94a3b8]">5 seconds</p>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Technical details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5 space-y-3"
      >
        <h3 className="text-sm font-semibold text-[#f1f5f9]">Worker Details</h3>
        <div className="space-y-2">
          {[
            { label: 'Process', value: 'worker.py' },
            { label: 'Heartbeat Key', value: 'worker_heartbeat (Redis)' },
            { label: 'Timeout Threshold', value: '30 seconds' },
            { label: 'Task Queue', value: 'task_queue (Redis Sorted Set)' },
            { label: 'Max Retries', value: '5 attempts' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[#1e1e30]/50 last:border-0">
              <span className="text-xs text-[#64748b]">{label}</span>
              <span className="text-xs font-mono text-[#94a3b8]">{value}</span>
            </div>
          ))}
        </div>

        <div className="pt-1">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-[#6366f1] hover:text-[#818cf8] transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Manual refresh
          </button>
        </div>
      </motion.div>
    </div>
  );
}
