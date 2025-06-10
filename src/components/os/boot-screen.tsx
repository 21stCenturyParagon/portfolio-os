'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/lib/stores/os-store';
import { Zap } from 'lucide-react';

interface BootMessage {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  delay: number;
}

const bootMessages: BootMessage[] = [
  { text: ' _____           _    __       _ _         _____ _____ ', type: 'info', delay: 0 },
  { text: '|  __ \\         | |  / _|     | (_)       |  _  /  ___|', type: 'info', delay: 50 },
  { text: '| |__) |__  _ __| |_| |_ ___  | |_  ___   | | | \\ `--. ', type: 'info', delay: 100 },
  { text: '|  ___/ _ \\| \'__| __|  _/ _ \\ | | |/ _ \\  | | | |`--. \\', type: 'info', delay: 150 },
  { text: '| |  | (_) | |  | |_| || (_) || | | (_) | \\ \\_/ /\\__/ /', type: 'info', delay: 200 },
  { text: '|_|   \\___/|_|   \\__|_| \\___/ |_|_|\\___/   \\___/\\____/ ', type: 'info', delay: 250 },
  { text: '', type: 'info', delay: 300 },
  { text: 'Portfolio OS v1.0.0 - Copyright (c) 2024 Ahsan Nayaz', type: 'info', delay: 400 },
  { text: '================================================================================', type: 'info', delay: 500 },
  { text: '', type: 'info', delay: 600 },
  { text: 'BIOS Date: 12/15/2024, Version: AN-UEFI 2024.12', type: 'info', delay: 700 },
  { text: 'Detecting hardware configuration...', type: 'info', delay: 900 },
  { text: '[    0.000000] Linux version 6.5.0-portfolio (ahsan@dev) (gcc 13.2.0)', type: 'info', delay: 1100 },
  { text: '[    0.000124] Command line: quiet splash vt.handoff=1', type: 'info', delay: 1200 },
  { text: '[    0.001337] CPU: AMD Ryzen 9 7950X 16-Core Processor @ 5.7GHz', type: 'info', delay: 1400 },
  { text: '[    0.001450] Memory: 32768MB DDR5 @ 6000MHz', type: 'info', delay: 1600 },
  { text: '[    0.001623] GPU: NVIDIA GeForce RTX 4090 24GB', type: 'info', delay: 1800 },
  { text: '[    0.002156] ACPI: Early table checksum verification disabled', type: 'info', delay: 2000 },
  { text: '[    0.003421] Kernel/User page tables isolation: enabled', type: 'info', delay: 2100 },
  { text: '', type: 'info', delay: 2200 },
  { text: ':: Loading kernel modules...', type: 'info', delay: 2300 },
  { text: '[  OK  ] Loaded module: nvme', type: 'success', delay: 2500 },
  { text: '[  OK  ] Loaded module: nvidia', type: 'success', delay: 2700 },
  { text: '[  OK  ] Loaded module: ethernet', type: 'success', delay: 2900 },
  { text: '[  OK  ] Loaded module: usb-storage', type: 'success', delay: 3100 },
  { text: '', type: 'info', delay: 3200 },
  { text: ':: Starting Portfolio OS services...', type: 'info', delay: 3300 },
  { text: '[  OK  ] Started D-Bus System Message Bus', type: 'success', delay: 3500 },
  { text: '[  OK  ] Started Portfolio Data Service', type: 'success', delay: 3700 },
  { text: '[  OK  ] Started Project Management Daemon', type: 'success', delay: 3900 },
  { text: '[  OK  ] Started Skills Analysis Engine', type: 'success', delay: 4100 },
  { text: '[  OK  ] Started AI Integration Service', type: 'success', delay: 4300 },
  { text: '[  OK  ] Started Contact Request Handler', type: 'success', delay: 4500 },
  { text: '[  OK  ] Started Window Compositor', type: 'success', delay: 4700 },
  { text: '[  OK  ] Started Desktop Environment', type: 'success', delay: 4900 },
  { text: '', type: 'info', delay: 5000 },
  { text: ':: All systems operational', type: 'success', delay: 5100 },
  { text: ':: Launching graphical interface...', type: 'info', delay: 5300 },
];

export function BootScreen() {
  const { bootState, setBootState, primaryAccent, secondaryAccent } = useOSStore();
  const [terminalMessages, setTerminalMessages] = useState<BootMessage[]>([]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Control rendering based on boot state
  useEffect(() => {
    if (bootState === 'running') {
      const timer = setTimeout(() => setShouldRender(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
    }
  }, [bootState]);
  
  // Terminal cursor blink
  useEffect(() => {
    if (showTerminal) {
      const interval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showTerminal]);
  
  // Boot sequence effect
  useEffect(() => {
    if (bootState === 'booting') {
      // Reset states
      setTerminalMessages([]);
      setShowTerminal(true);
      setShowLogo(false);
      setIsTransitioning(false);
      
      // Display terminal messages with delays
      let messageTimeouts: NodeJS.Timeout[] = [];
      
      bootMessages.forEach((message, index) => {
        const timeout = setTimeout(() => {
          setTerminalMessages(prev => [...prev, message]);
          
          // Auto-scroll terminal
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
          
          // After last message, transition to logo
          if (index === bootMessages.length - 1) {
            setTimeout(() => {
              setShowTerminal(false);
              setShowLogo(true);
              setTimeout(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setBootState('running');
                  setTimeout(() => setIsTransitioning(false), 1000);
                }, 800);
              }, 1500);
            }, 800);
          }
        }, message.delay);
        
        messageTimeouts.push(timeout);
      });
      
      return () => {
        messageTimeouts.forEach(timeout => clearTimeout(timeout));
      };
    } else if (bootState === 'shutting-down') {
      setShowTerminal(false);
      setShowLogo(true);
      setIsTransitioning(false);
      
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => setBootState('off'), 800);
      }, 500);
    }
  }, [bootState, setBootState]);
  
  if (!shouldRender) return null;
  
  return (
    <AnimatePresence mode="wait">
      {bootState === 'off' && (
        <motion.div
          key="off-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer group"
              onClick={() => setBootState('booting')}
            >
              <div 
                className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <Zap className="w-12 h-12 text-white relative z-10" />
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 mt-6 text-sm font-medium"
              >
                Click to boot
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      
      {(bootState === 'booting' || bootState === 'shutting-down' || isTransitioning) && (
        <motion.div
          key="boot-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: isTransitioning ? 0.8 : 0.3,
            ease: isTransitioning ? "easeInOut" : "easeOut"
          }}
          onAnimationComplete={() => {
            if (isTransitioning) {
              setIsTransitioning(false);
            }
          }}
          className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden ${
            isTransitioning ? 'pointer-events-none' : ''
          }`}
        >
          <AnimatePresence mode="wait">
            {/* Terminal View */}
            {showTerminal && bootState === 'booting' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full bg-black p-8"
              >
                <div 
                  ref={terminalRef}
                  className="w-full h-full overflow-y-auto font-mono text-sm leading-relaxed"
                  style={{ fontFamily: '"Cascadia Code", "Fira Code", "Consolas", "Monaco", monospace' }}
                >
                  {terminalMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.05 }}
                      className={`${
                        msg.type === 'success' ? 'text-green-400' :
                        msg.type === 'warning' ? 'text-yellow-400' :
                        msg.type === 'error' ? 'text-red-400' :
                        'text-gray-300'
                      }`}
                    >
                      {msg.text || '\u00A0'}
                    </motion.div>
                  ))}
                  {showTerminal && bootState === 'booting' && (
                    <span className={`inline-block w-2 h-4 bg-green-400 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Logo View */}
            {showLogo && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 20,
                  }}
                  className="mb-8"
                >
                  <div 
                    className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center text-white text-5xl font-bold relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                      boxShadow: `0 20px 40px ${primaryAccent}30`
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20"
                      animate={{ opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="relative z-10 font-black">AN</span>
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-light text-white mb-2"
                >
                  {bootState === 'shutting-down' ? 'Shutting Down' : 'Welcome'}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-400"
                >
                  {bootState === 'shutting-down' ? 'Saving your session...' : 'Initializing desktop environment...'}
                </motion.p>
                
                {bootState === 'booting' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex justify-center gap-1"
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: i * 0.15
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 