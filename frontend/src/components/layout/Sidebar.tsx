import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  List,
  Activity,
  Skull,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/formatters';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: List },
  { to: '/queue', label: 'Queue Monitor', icon: Activity },
  { to: '/dlq', label: 'Dead Letter Queue', icon: Skull },
  { to: '/workers', label: 'Worker Health', icon: Heart },
];

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
];

/**
 * Collapsible sidebar navigation with animated transitions.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div className={cn('fixed inset-0 z-20 lg:hidden', collapsed ? 'pointer-events-none' : '')} />

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-screen border-r border-[#1e1e30] bg-[#0a0a0f] flex-shrink-0 z-30 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-[#1e1e30] flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-semibold text-[#f1f5f9] truncate"
                >
                  TaskForge
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                  isActive
                    ? 'bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20'
                    : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a1a2e]',
                  collapsed ? 'justify-center' : ''
                )}
                title={collapsed ? label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-[#6366f1]"
                  />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-2 pb-3 border-t border-[#1e1e30] pt-3 space-y-0.5">
          {bottomItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#6366f1]/10 text-[#818cf8]'
                    : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a1a2e]',
                  collapsed ? 'justify-center' : ''
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium',
              'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a1a2e] transition-all duration-150',
              collapsed ? 'justify-center' : ''
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
