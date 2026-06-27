import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/formatters';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { MetricCardSkeleton } from './LoadingSkeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
  glowColor?: string;
}

/**
 * Animated metric card with counter animation, icon, and trend indicator.
 */
export function MetricCard({
  title,
  value = 0,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendValue,
  description,
  isLoading = false,
  className,
  glowColor,
}: MetricCardProps) {
  const animatedValue = useAnimatedCounter(value ?? 0);

  if (isLoading) return <MetricCardSkeleton />;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-[#64748b]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-5',
        'hover:border-[#2a2a42] transition-all duration-200 overflow-hidden cursor-default',
        className
      )}
    >
      {/* Ambient background glow on hover */}
      {glowColor && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${glowColor}08 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-[#64748b] uppercase tracking-widest">{title}</p>
        <div
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center',
            iconBg,
            'group-hover:scale-110 transition-transform duration-200'
          )}
        >
          <Icon className={cn('w-4.5 h-4.5', iconColor)} size={18} />
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <motion.span
          key={animatedValue}
          className="text-3xl font-bold text-[#f1f5f9] tabular-nums"
        >
          {animatedValue.toLocaleString()}
        </motion.span>
      </div>

      {/* Trend / description */}
      {(trend || description) && (
        <div className="flex items-center gap-1.5">
          {trend && (
            <TrendIcon className={cn('w-3 h-3', trendColor)} />
          )}
          {trendValue && (
            <span className={cn('text-xs font-medium', trendColor)}>{trendValue}</span>
          )}
          {description && (
            <span className="text-xs text-[#64748b]">{description}</span>
          )}
        </div>
      )}

      {/* Bottom border glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: glowColor
            ? `linear-gradient(90deg, transparent, ${glowColor}40, transparent)`
            : 'linear-gradient(90deg, transparent, #6366f140, transparent)',
        }}
      />
    </motion.div>
  );
}
