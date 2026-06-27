import { RefreshCw, Moon, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkerHealth } from '../../hooks/useWorkerHealth';
import { cn } from '../../utils/formatters';
import { useState } from 'react';
import { useCommandPalette } from '../../context/CommandPaletteContext';

/**
 * Top navigation bar with worker status badge, refresh button, and command palette trigger.
 */
export function Navbar() {
  const queryClient = useQueryClient();
  const { data: worker } = useWorkerHealth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { open } = useCommandPalette();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const isHealthy = worker?.status === 'HEALTHY';

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-[#1e1e30] bg-[#0a0a0f]/80 backdrop-blur-sm flex-shrink-0">
      {/* Left: Title */}
      <div>
        <h1 className="text-sm font-semibold text-[#f1f5f9]">Distributed Task Queue</h1>
        <p className="text-xs text-[#64748b] hidden sm:block">Monitor, Schedule and Process Background Tasks</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette */}
        <button
          onClick={open}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#1e1e30] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2a2a42] text-xs transition-all"
          aria-label="Open command palette (Ctrl+K)"
        >
          <Command className="w-3 h-3" />
          <span>Search</span>
          <kbd className="ml-1 text-[10px] font-medium bg-[#1a1a2e] px-1.5 py-0.5 rounded text-[#64748b]">
            ⌘K
          </kbd>
        </button>

        {/* Worker Status Badge */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium',
            isHealthy
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            {isHealthy && (
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <span
              className={cn(
                'relative inline-flex rounded-full h-1.5 w-1.5',
                isHealthy ? 'bg-emerald-400' : 'bg-red-400'
              )}
            />
          </span>
          <span className="hidden sm:inline">Worker {isHealthy ? 'Online' : 'Offline'}</span>
        </div>

        {/* Dark theme badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14141f] border border-[#1e1e30] text-xs text-[#64748b]">
          <Moon className="w-3 h-3" />
          <span className="hidden sm:inline">Dark</span>
        </div>

        {/* Refresh button */}
        <motion.button
          onClick={handleRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14141f] border border-[#1e1e30] hover:border-[#2a2a42] text-[#64748b] hover:text-[#94a3b8] transition-all"
          aria-label="Refresh data"
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 0.6, ease: 'linear' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>
    </header>
  );
}
