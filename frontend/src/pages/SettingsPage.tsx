import { motion } from 'framer-motion';
import { Settings, Zap, Globe, Database, Shield } from 'lucide-react';

/**
 * Settings page — placeholder with API configuration display.
 */
export function SettingsPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#f1f5f9]">Settings</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Configuration for the Task Queue Dashboard</p>
      </motion.div>

      {/* API Config */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#1e1e30] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#6366f1]" />
          <h2 className="text-sm font-semibold text-[#f1f5f9]">API Configuration</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-[#64748b] mb-2">Backend API URL</p>
            <div className="flex items-center gap-3 bg-[#14141f] rounded-lg px-3 py-2.5 border border-[#1e1e30]">
              <code className="text-sm text-[#818cf8] flex-1">{apiUrl}</code>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-1.5">
              Set via <code className="text-[#818cf8]">VITE_API_BASE_URL</code> in <code className="text-[#818cf8]">.env.local</code>
            </p>
          </div>

          <div>
            <p className="text-xs text-[#64748b] mb-2">Available Endpoints</p>
            <div className="space-y-1.5">
              {[
                { method: 'GET', path: '/', desc: 'Health check' },
                { method: 'POST', path: '/tasks', desc: 'Create task' },
                { method: 'GET', path: '/tasks/{id}', desc: 'Get task details' },
                { method: 'GET', path: '/queue-status', desc: 'Queue metrics' },
                { method: 'POST', path: '/dlq/replay/{id}', desc: 'Replay DLQ task' },
                { method: 'GET', path: '/worker-health', desc: 'Worker heartbeat' },
              ].map(({ method, path, desc }) => (
                <div key={path} className="flex items-center gap-3 text-xs py-1.5">
                  <span
                    className={`w-12 text-center font-mono font-bold rounded px-1 py-0.5 text-[10px] ${
                      method === 'GET'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-blue-400 bg-blue-500/10'
                    }`}
                  >
                    {method}
                  </span>
                  <code className="text-[#818cf8] font-mono flex-1">{path}</code>
                  <span className="text-[#64748b] hidden sm:block">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Config */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#1e1e30] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#6366f1]" />
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Dashboard Settings</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: Zap, label: 'Auto-refresh interval', value: '5 seconds', color: 'text-[#6366f1]' },
            { icon: Database, label: 'Task storage', value: 'Browser localStorage', color: 'text-purple-400' },
            { icon: Shield, label: 'CORS requirement', value: 'Backend must allow localhost:5173', color: 'text-yellow-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-[#1e1e30]/50 last:border-0">
              <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
              <span className="text-xs text-[#64748b] flex-1">{label}</span>
              <span className="text-xs font-medium text-[#94a3b8]">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Keyboard Shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#1e1e30]">
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Keyboard Shortcuts</h2>
        </div>
        <div className="p-5 space-y-2">
          {[
            { key: '⌘ K / Ctrl K', action: 'Open command palette' },
            { key: 'Esc', action: 'Close dialogs / drawers' },
          ].map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-[#64748b]">{action}</span>
              <kbd className="text-[10px] bg-[#1a1a2e] border border-[#2a2a42] px-2 py-1 rounded font-mono text-[#94a3b8]">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
