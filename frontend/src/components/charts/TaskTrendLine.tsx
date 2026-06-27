import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import type { TrendDataPoint } from '../../types';

interface TaskTrendLineProps {
  data: TrendDataPoint[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#14141f] border border-[#1e1e30] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[#64748b] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-xs text-[#94a3b8] capitalize">{p.name}</span>
          <span className="text-xs font-bold text-[#f1f5f9] ml-auto pl-3">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Line chart showing completed vs failed tasks over time.
 */
export function TaskTrendLine({ data }: TaskTrendLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5 h-full"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#f1f5f9]">Task Trend</h3>
        <p className="text-xs text-[#64748b] mt-0.5">Completed vs Failed over time</p>
      </div>

      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48 text-xs text-[#64748b]">
          Collecting data... (refreshes every 5s)
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" vertical={false} />
            <XAxis
              dataKey="time"
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
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="failed"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
