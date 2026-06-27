import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
}

/**
 * Error state with retry button and animated warning icon.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
  isNetworkError = false,
}: ErrorStateProps) {
  const Icon = isNetworkError ? WifiOff : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Icon className="w-7 h-7 text-red-400" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-red-500/5 blur-xl" />
      </div>

      <h3 className="text-base font-semibold text-[#f1f5f9] mb-2">{title}</h3>
      <p className="text-sm text-[#64748b] max-w-xs leading-relaxed mb-6">{description}</p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] hover:bg-[#1e1e30] border border-[#1e1e30] hover:border-[#2a2a42] text-[#f1f5f9] rounded-lg text-sm font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
