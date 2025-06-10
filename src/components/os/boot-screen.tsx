'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/lib/stores/os-store';
import { Loader2 } from 'lucide-react';

export function BootScreen() {
  const { bootState, setBootState } = useOSStore();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (bootState === 'booting') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setBootState('running'), 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else if (bootState === 'shutting-down') {
      setTimeout(() => setBootState('off'), 800);
    }
  }, [bootState, setBootState]);
  
  if (bootState === 'running') return null;
  
  return (
    <AnimatePresence>
      {(bootState === 'booting' || bootState === 'shutting-down') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black ${
            bootState === 'shutting-down' ? 'shutdown-animation' : ''
          }`}
        >
          <div className={`text-center ${bootState === 'booting' ? 'boot-animation' : ''}`}>
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                AN
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Portfolio OS
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-gray-400 mb-8"
            >
              {bootState === 'booting' ? 'Starting up...' : 'Shutting down...'}
            </motion.p>
            
            {/* Progress */}
            {bootState === 'booting' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="w-64 mx-auto"
              >
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{Math.floor(progress)}%</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 