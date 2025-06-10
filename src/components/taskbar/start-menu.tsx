'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DynamicIcon } from '@/components/os/dynamic-icon';
import { appRegistry } from '@/lib/app-registry';
import { useOSStore } from '@/lib/stores/os-store';
import {
  Search,
  Power,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Info,
} from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { openWindow, systemState, toggleTheme, addNotification } = useOSStore();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredApps = Object.values(appRegistry).filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (appId: string) => {
    const app = appRegistry[appId];
    if (app) {
      openWindow({
        title: app.title,
        icon: app.icon,
        component: app.component,
        position: { x: 100, y: 100 },
        size: app.defaultSize || { width: 600, height: 400 },
        isMinimized: false,
        isMaximized: false,
      });
    }
    onClose();
  };

  const handleShutdown = () => {
    addNotification({
      title: 'System Shutdown',
      message: 'Thank you for visiting my portfolio!',
      type: 'info',
    });
    setTimeout(() => {
      window.location.href = 'https://github.com/ahsannayaz';
    }, 2000);
  };

  const handleLogout = () => {
    addNotification({
      title: 'Logging Out',
      message: 'See you again soon!',
      type: 'info',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            onClick={onClose}
          />

          {/* Start Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 left-0 w-full sm:w-[600px] max-w-[calc(100vw-1rem)] h-[calc(100vh-4rem)] sm:h-[700px] max-h-[700px] bg-background/95 backdrop-blur-xl border border-border rounded-t-lg shadow-2xl z-[9999] flex flex-col overflow-hidden"
          >
            {/* User Section */}
            <div className="p-4 sm:p-6 bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  AN
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Ahsan Nayaz</h2>
                  <p className="text-sm text-muted-foreground">AI Engineer</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Type to search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Apps Grid */}
            <div className="flex-1 overflow-auto px-4">
              {searchQuery && filteredApps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No applications found
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
                  {(searchQuery ? filteredApps : Object.values(appRegistry)).map((app) => (
                    <Button
                      key={app.id}
                      variant="ghost"
                      className="h-auto py-3 px-4 justify-start hover:bg-muted"
                      onClick={() => handleAppClick(app.id)}
                    >
                      <DynamicIcon name={app.icon} size={24} className="mr-3" />
                      <span className="text-sm">{app.title}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Bottom Actions */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppClick('settings')}
                  className="justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="justify-start"
                >
                  {systemState.theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppClick('about')}
                  className="justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  About Me
                </Button>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex-1 justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Restart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShutdown}
                  className="flex-1 justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Power className="h-4 w-4 mr-2" />
                  Shutdown
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 