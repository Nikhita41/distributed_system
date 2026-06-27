import type { Task } from '../types';

/**
 * Convert an array of tasks to a CSV string and trigger a browser download.
 */
export function exportTasksToCSV(tasks: Task[], filename = 'tasks-export.csv'): void {
  const headers = [
    'ID',
    'Task Type',
    'Priority',
    'Status',
    'Result',
    'Retry Count',
    'Deadline Hours',
    'Created At',
    'Updated At',
  ];

  const escape = (val: unknown): string => {
    const str = val == null ? '' : String(val);
    // Wrap in quotes if the value contains commas, quotes, or newlines
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = tasks.map((task) =>
    [
      task.id,
      task.task_type,
      task.priority,
      task.status,
      task.result ?? '',
      task.retry_count,
      task.deadline_hours,
      task.created_at ?? '',
      task.updated_at ?? '',
    ]
      .map(escape)
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
