import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppLayout } from './components/layout/AppLayout';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { QueueMonitorPage } from './pages/QueueMonitorPage';
import { DLQPage } from './pages/DLQPage';
import { WorkerHealthPage } from './pages/WorkerHealthPage';
import { SettingsPage } from './pages/SettingsPage';

// Configure React Query with sensible defaults for a dashboard
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 4000,
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CommandPaletteProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/queue" element={<QueueMonitorPage />} />
              <Route path="/dlq" element={<DLQPage />} />
              <Route path="/workers" element={<WorkerHealthPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>

          {/* Toast notifications — dark theme */}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#0f0f18',
                border: '1px solid #1e1e30',
                color: '#f1f5f9',
                borderRadius: '12px',
              },
            }}
          />
        </CommandPaletteProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
