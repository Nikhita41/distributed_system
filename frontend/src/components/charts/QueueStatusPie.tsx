import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { QueueStatus } from '../../types';
import { motion } from 'framer-motion';

interface QueueStatusPieProps {
  data: QueueStatus | undefined;
}

const COLORS = {
  pending: '#eab308',
  processing: '#3b82f6',
  completed: '#10b981',
  failed: '#ef4444',
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-[#14141f] border border-[#1e1e30] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-[#94a3b8] mb-0.5">{item.name}</p>
      <p className="text-lg font-bold text-[#f1f5f9]">{item.value.toLocaleString()}</p>
    </div>
  );
};

const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-[#64748b]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Donut chart showing distribution of task statuses.
 */
export function QueueStatusPie({ data }: QueueStatusPieProps) {
  const chartData = [
    { name: 'Pending', value: data?.pending_tasks ?? 0, color: COLORS.pending },
    { name: 'Processing', value: data?.processing_tasks ?? 0, color: COLORS.processing },
    { name: 'Completed', value: data?.completed_tasks ?? 0, color: COLORS.completed },
    { name: 'Failed', value: data?.failed_tasks ?? 0, color: COLORS.failed },
  ].filter((d) => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5 h-full"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#f1f5f9]">Queue Distribution</h3>
        <p className="text-xs text-[#64748b] mt-0.5">{total} total tasks</p>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-[#64748b]">
          <div className="w-20 h-20 rounded-full border-4 border-[#1e1e30] mb-3 flex items-center justify-center">
            <span className="text-xs">Empty</span>
          </div>
          <p className="text-xs">No tasks in queue</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
