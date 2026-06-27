import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import type { TrendDataPoint } from '../../types';

interface ProcessingTrendProps {
  data: TrendDataPoint[];
}

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
      <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#f1f5f9]">{payload[0].value} pending</p>
    </div>
  );
};

/**
 * Area chart showing the pending task count trend over time.
 */
export function ProcessingTrend({ data }: ProcessingTrendProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5 h-full"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#f1f5f9]">Processing Trend</h3>
        <p className="text-xs text-[#64748b] mt-0.5">Pending queue depth over time</p>
      </div>

      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48 text-xs text-[#64748b]">
          Collecting data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="pending"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#pendingGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
