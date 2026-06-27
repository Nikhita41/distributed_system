import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Skull,
  Heart,
  Database,
} from 'lucide-react';
import { MetricCard } from '../components/shared/MetricCard';
import { QueueStatusPie } from '../components/charts/QueueStatusPie';
import { TaskTrendLine } from '../components/charts/TaskTrendLine';
import { PriorityBar } from '../components/charts/PriorityBar';
import { ProcessingTrend } from '../components/charts/ProcessingTrend';
import { useQueueStatus } from '../hooks/useQueueStatus';
import { useWorkerHealth } from '../hooks/useWorkerHealth';
import { useTasks } from '../hooks/useTasks';
import type { TrendDataPoint } from '../types';
import { formatRelativeTime } from '../utils/formatters';
import { format } from 'date-fns';

const MAX_TREND_POINTS = 20;

/**
 * Main dashboard page with metric cards, charts, and live data.
 */
export function DashboardPage() {
  const { data: queueStatus, isLoading: queueLoading, isError: queueError } = useQueueStatus();
  const { data: worker } = useWorkerHealth();
  const { tasks } = useTasks();
  const isHealthy = worker?.status === 'HEALTHY';

  // Accumulate trend data by polling snapshots
  const [trendHistory, setTrendHistory] = useState<TrendDataPoint[]>([]);
  const prevStatusRef = useRef(queueStatus);

  useEffect(() => {
    if (!queueStatus) return;
    prevStatusRef.current = queueStatus;
    const point: TrendDataPoint = {
      time: format(new Date(), 'HH:mm:ss'),
      completed: queueStatus.completed_tasks,
      failed: queueStatus.failed_tasks,
      pending: queueStatus.pending_tasks,
    };
    setTrendHistory((prev) => {
      const next = [...prev, point];
      return next.length > MAX_TREND_POINTS ? next.slice(-MAX_TREND_POINTS) : next;
    });
  }, [queueStatus]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3 },
    }),
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#f1f5f9]">Dashboard</h1>
        <p className="text-sm text-[#64748b] mt-0.5">
          Real-time overview of your distributed task queue
        </p>
      </motion.div>

      {/* Worker Offline Banner */}
      {worker?.status === 'OFFLINE' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/8"
        >
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-300">Worker Offline</p>
            <p className="text-xs text-red-400/70 mt-0.5">
              The background worker is not responding. Tasks will remain queued until it recovers.
            </p>
          </div>
        </motion.div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            title: 'Pending',
            value: queueStatus?.pending_tasks,
            icon: Clock,
            iconColor: 'text-yellow-400',
            iconBg: 'bg-yellow-500/10',
            glowColor: '#eab308',
          },
          {
            title: 'Processing',
            value: queueStatus?.processing_tasks,
            icon: Loader2,
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
            glowColor: '#3b82f6',
          },
          {
            title: 'Completed',
            value: queueStatus?.completed_tasks,
            icon: CheckCircle2,
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            glowColor: '#10b981',
          },
          {
            title: 'Failed',
            value: queueStatus?.failed_tasks,
            icon: XCircle,
            iconColor: 'text-red-400',
            iconBg: 'bg-red-500/10',
            glowColor: '#ef4444',
          },
          {
            title: 'DLQ Size',
            value: queueStatus?.dead_letter_queue,
            icon: Skull,
            iconColor: 'text-orange-400',
            iconBg: 'bg-orange-500/10',
            glowColor: '#f97316',
          },
          {
            title: 'Redis Queue',
            value: queueStatus?.redis_queue_size,
            icon: Database,
            iconColor: 'text-purple-400',
            iconBg: 'bg-purple-500/10',
            glowColor: '#a855f7',
          },
        ].map((card, i) => (
          <motion.div key={card.title} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <MetricCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              iconColor={card.iconColor}
              iconBg={card.iconBg}
              glowColor={card.glowColor}
              isLoading={queueLoading && !queueError}
            />
          </motion.div>
        ))}
      </div>

      {/* Worker Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`flex items-center gap-3 p-3.5 rounded-xl border ${
          isHealthy
            ? 'border-emerald-500/20 bg-emerald-500/5'
            : 'border-red-500/20 bg-red-500/5'
        }`}
      >
        <Heart className={`w-4 h-4 ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`} />
        <span className={`text-sm font-medium ${isHealthy ? 'text-emerald-300' : 'text-red-300'}`}>
          Worker {isHealthy ? 'Online' : 'Offline'}
        </span>
        <span className="text-xs text-[#64748b] ml-auto">
          Auto-refreshes every 5 seconds
        </span>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <QueueStatusPie data={queueStatus} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <TaskTrendLine data={trendHistory} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <PriorityBar tasks={tasks} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <ProcessingTrend data={trendHistory} />
        </motion.div>
      </div>
    </div>
  );
}
