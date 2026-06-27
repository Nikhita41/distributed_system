import axios from 'axios';
import { toast } from 'sonner';

/**
 * Central Axios instance — all API calls flow through here.
 * Base URL is read from the .env.local file at build time.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Response Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error / backend unreachable
      toast.error('Backend Unreachable', {
        description: 'Cannot connect to the task queue API. Is the server running?',
        duration: 5000,
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
