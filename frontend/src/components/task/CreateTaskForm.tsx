import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Loader2, Mail, FileText, Image, Video, Zap } from 'lucide-react';
import { createTask } from '../../api/tasks';
import type { TaskCreate, TaskType } from '../../types';
import { cn } from '../../utils/formatters';

interface CreateTaskFormProps {
  onSuccess?: (taskId: string) => void;
}

const TASK_TYPES: Array<{ value: TaskType; label: string; icon: typeof Mail; description: string }> = [
  { value: 'email', label: 'Email', icon: Mail, description: 'Send email notifications' },
  { value: 'report', label: 'Report', icon: FileText, description: 'Generate data reports' },
  { value: 'image', label: 'Image', icon: Image, description: 'Resize & process images' },
  { value: 'video', label: 'Video', icon: Video, description: 'Process video files' },
];

/**
 * Professional task creation form with real-time validation and animated feedback.
 */
export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<TaskCreate>({
    task_type: 'email',
    payload: '',
    priority: 5,
    deadline_hours: 24,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      toast.success('Task Created!', {
        description: `Task ${data.task_id.slice(0, 8)}… queued successfully.`,
        duration: 4000,
      });
      // Refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['queue-status'] });
      // Reset form
      setForm({ task_type: 'email', payload: '', priority: 5, deadline_hours: 24 });
      onSuccess?.(data.task_id);
    },
    onError: () => {
      toast.error('Task Creation Failed', {
        description: 'Could not create task. Check if the backend is running.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.payload.trim()) {
      toast.warning('Payload Required', { description: 'Please enter a task payload.' });
      return;
    }
    mutate(form);
  };

  const priorityColor =
    form.priority >= 8 ? '#ef4444' : form.priority >= 5 ? '#f59e0b' : '#6366f1';
  const priorityLabel = form.priority >= 8 ? 'HIGH' : form.priority >= 5 ? 'MEDIUM' : 'LOW';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#1e1e30] bg-[#0f0f18] p-6"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-[#6366f1]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Create Task</h2>
          <p className="text-xs text-[#64748b]">Add a new task to the queue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Type */}
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-3">Task Type</label>
          <div className="grid grid-cols-2 gap-2">
            {TASK_TYPES.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, task_type: value }))}
                className={cn(
                  'flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all',
                  form.task_type === value
                    ? 'border-[#6366f1]/50 bg-[#6366f1]/8 text-[#818cf8]'
                    : 'border-[#1e1e30] bg-[#14141f] text-[#64748b] hover:border-[#2a2a42] hover:text-[#94a3b8]'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0',
                    form.task_type === value ? 'bg-[#6366f1]/20' : 'bg-[#1a1a2e]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{label}</p>
                  <p className="text-[10px] text-[#64748b] truncate">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payload */}
        <div>
          <label htmlFor="payload" className="block text-xs font-medium text-[#94a3b8] mb-2">
            Payload
          </label>
          <textarea
            id="payload"
            rows={4}
            placeholder={`Enter task payload...\nExamples:\n• user@example.com\n• report_id=123\n• /uploads/photo.jpg`}
            value={form.payload}
            onChange={(e) => setForm((f) => ({ ...f, payload: e.target.value }))}
            className="w-full bg-[#14141f] border border-[#1e1e30] rounded-lg px-3 py-2.5 text-sm text-[#f1f5f9] placeholder:text-[#64748b]/60 focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 transition-all resize-none font-mono leading-relaxed"
            required
          />
        </div>

        {/* Priority Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="priority" className="text-xs font-medium text-[#94a3b8]">
              Priority
            </label>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: priorityColor, backgroundColor: `${priorityColor}15` }}
              >
                {priorityLabel}
              </span>
              <span className="text-sm font-bold tabular-nums" style={{ color: priorityColor }}>
                {form.priority}
              </span>
            </div>
          </div>
          <input
            id="priority"
            type="range"
            min={1}
            max={10}
            step={1}
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
            className="w-full"
            style={{ accentColor: priorityColor }}
          />
          <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>

        {/* Deadline Hours */}
        <div>
          <label htmlFor="deadline" className="block text-xs font-medium text-[#94a3b8] mb-2">
            Deadline (hours)
          </label>
          <div className="relative">
            <input
              id="deadline"
              type="number"
              min={1}
              max={168}
              value={form.deadline_hours}
              onChange={(e) => setForm((f) => ({ ...f, deadline_hours: Math.max(1, Number(e.target.value)) }))}
              className="w-full bg-[#14141f] border border-[#1e1e30] rounded-lg px-3 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 transition-all pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b]">hours</span>
          </div>
          <p className="text-[10px] text-[#64748b] mt-1">
            Task deadline in hours (1–168). Higher urgency tasks get score boost.
          </p>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isPending}
          whileHover={!isPending ? { scale: 1.01 } : {}}
          whileTap={!isPending ? { scale: 0.99 } : {}}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
            isPending
              ? 'bg-[#6366f1]/50 text-white/60 cursor-not-allowed'
              : 'bg-[#6366f1] hover:bg-[#818cf8] text-white shadow-lg shadow-[#6366f1]/20'
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Task
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
