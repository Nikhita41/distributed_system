import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(null);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, close]);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  return ctx;
}

// ─── Command Palette Modal ─────────────────────────────────────────────────────

import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  List,
  Activity,
  Skull,
  Heart,
  Settings,
  Search,
} from 'lucide-react';

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'tasks', label: 'Go to Tasks', icon: List, path: '/tasks' },
  { id: 'queue', label: 'Go to Queue Monitor', icon: Activity, path: '/queue' },
  { id: 'dlq', label: 'Go to Dead Letter Queue', icon: Skull, path: '/dlq' },
  { id: 'workers', label: 'Go to Worker Health', icon: Heart, path: '/workers' },
  { id: 'settings', label: 'Go to Settings', icon: Settings, path: '/settings' },
];

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    close();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="mx-4 rounded-xl border border-[#2a2a42] bg-[#0f0f18] shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e30]">
                <Search className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search commands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[#f1f5f9] placeholder:text-[#64748b] outline-none"
                />
                <kbd className="text-[10px] bg-[#1a1a2e] px-1.5 py-0.5 rounded text-[#64748b] font-medium">
                  ESC
                </kbd>
              </div>

              {/* Commands */}
              <div className="py-2 max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-[#64748b] py-8">No results found</p>
                ) : (
                  filtered.map(({ id, label, icon: Icon, path }) => (
                    <button
                      key={id}
                      onClick={() => handleSelect(path)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1a1a2e] transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-[#6366f1]" />
                      {label}
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
