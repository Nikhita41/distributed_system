import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from '../../context/CommandPaletteContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * Main application shell: sidebar + top nav + animated page content.
 */
export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette — rendered at root level so it's always on top */}
      <CommandPalette />
    </div>
  );
}
