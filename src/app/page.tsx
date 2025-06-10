'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Desktop } from '@/components/desktop/desktop';
import { Taskbar } from '@/components/taskbar/taskbar';
import { Window } from '@/components/os/window';
import { AppRenderer } from '@/components/os/app-renderer';
import { BootScreen } from '@/components/os/boot-screen';
import { useOSStore } from '@/lib/stores/os-store';

export default function Page() {
  const { windows, systemState, bootState, addNotification } = useOSStore();
  
  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', systemState.theme === 'dark');
  }, [systemState.theme]);
  
  useEffect(() => {
    // Show welcome notification after boot
    if (bootState === 'running') {
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if (!hasShownWelcome) {
        setTimeout(() => {
          addNotification({
            title: 'Welcome to Ahsan Nayaz\'s Portfolio',
            message: 'Double-click on desktop icons to explore my work!',
            type: 'info',
          });
          localStorage.setItem('hasShownWelcome', 'true');
        }, 2000); // Increased delay to allow for desktop animation
      }
    }
  }, [bootState, addNotification]);
  
  // Disable default context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);
  
  // Debug logging
  useEffect(() => {
    console.log('Current windows:', windows);
    windows.forEach(w => {
      console.log(`Window ${w.id}: position(${w.position.x}, ${w.position.y}), size(${w.size.width}x${w.size.height}), minimized: ${w.isMinimized}`);
    });
  }, [windows]);
  
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Boot Screen */}
      <BootScreen />
      
      {/* OS Interface */}
      <AnimatePresence>
        {bootState === 'running' && (
          <>
            {/* Desktop */}
            <Desktop />
            
            {/* Windows Container */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {windows.map((window) => (
                  <div key={window.id} className="pointer-events-auto">
                    <Window window={window}>
                      <AppRenderer componentName={window.component} />
                    </Window>
                  </div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Taskbar */}
            <Taskbar />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
