import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import type { Task } from '../../types';

interface PriorityBarProps {
  tasks: Task[];
}

const getPriorityColor = (priority: number): string => {
  if (priority >= 8) return '#ef4444';
  if (priority >= 5) return '#f59e0b';
  return '#6366f1';
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#14141f] border border-[#1e1e30] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[#64748b] mb-0.5">Priority {label}</p>
      <p className="text-sm font-bold text-[#f1f5f9]">{payload[0].value} tasks</p>
    </div>
  );
};

/**
 * Bar chart showing distribution of task priorities.
 */
export function PriorityBar({ tasks }: PriorityBarProps) {
  // Build priority distribution from 1–10
  const distribution: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) distribution[i] = 0;
  tasks.forEach((t) => {
    if (t.priority >= 1 && t.priority <= 10) {
      distribution[t.priority] = (distribution[t.priority] || 0) + 1;
    }
  });

  const data = Object.entries(distribution).map(([p, count]) => ({
    priority: p,
    count,
    priorityNum: Number(p),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5 h-full"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#f1f5f9]">Priority Distribution</h3>
        <p className="text-xs text-[#64748b] mt-0.5">Tasks by priority level (1–10)</p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-xs text-[#64748b]">
          No tasks to display
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" vertical={false} />
            <XAxis
              dataKey="priority"
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPriorityColor(entry.priorityNum)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
          <span className="text-xs text-[#64748b]">Low (1–4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="text-xs text-[#64748b]">Medium (5–7)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span className="text-xs text-[#64748b]">High (8–10)</span>
        </div>
      </div>
    </motion.div>
  );
}
