import { motion } from 'framer-motion';
import { Inbox, Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'inbox' | 'search' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Beautiful empty state with animated icon and optional action button.
 */
export function EmptyState({
  title = 'Nothing here yet',
  description = 'Create your first task to get started.',
  icon = 'inbox',
  action,
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : icon === 'error' ? AlertCircle : Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated icon container */}
      <motion.div
        className="relative mb-6"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#6366f1]" />
        </div>
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-2xl bg-[#6366f1]/5 blur-xl" />
      </motion.div>

      <h3 className="text-base font-semibold text-[#f1f5f9] mb-2">{title}</h3>
      <p className="text-sm text-[#64748b] max-w-xs leading-relaxed mb-6">{description}</p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="px-4 py-2 bg-[#6366f1] hover:bg-[#818cf8] text-white rounded-lg text-sm font-medium transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
