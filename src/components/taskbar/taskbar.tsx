'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Wifi, 
  WifiOff,
  Volume2, 
  VolumeX,
  Battery, 
  BatteryLow,
  Power, 
  RotateCcw, 
  X,
  ChevronUp,
  Bell,
  Settings,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOSStore } from '@/lib/stores/os-store';
import { DynamicIcon } from '@/components/os/dynamic-icon';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ContextMenu, ContextMenuItem, useContextMenu } from '@/components/os/context-menu';

interface WindowPreview {
  windowId: string;
  title: string;
  icon: string;
}

interface TaskbarButtonProps {
  windows: WindowPreview[];
  icon: string;
  isActive: boolean;
  appName: string;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

function TaskbarButton({ windows, icon, isActive, appName, onLeftClick, onRightClick }: TaskbarButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    // Show tooltip after short delay
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(true), 800);
    
    // Show preview for windows
    if (windows.length > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowPreview(true), 500);
    }
  };
  
  const handleMouseLeave = () => {
    // Hide tooltip
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(false);
    
    // Hide preview
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPreview(false), 100);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);
  
  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <motion.div 
        whileHover={{ scale: 1.05, y: -2 }} 
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-11 w-11 relative transition-all duration-200 overflow-hidden',
            'hover:bg-white/15 hover:backdrop-blur-xl',
            'before:absolute before:inset-0 before:opacity-0 hover:before:opacity-10',
            'before:bg-gradient-to-br before:from-[var(--primary-accent)] before:to-[var(--secondary-accent)]',
            'before:transition-opacity before:duration-300',
            isActive && 'bg-white/10 backdrop-blur-xl before:opacity-5',
            windows.length === 0 && 'opacity-80'
          )}
          onClick={onLeftClick}
          onContextMenu={onRightClick}
        >
          <DynamicIcon name={icon} size={22} className={cn(
            "transition-all duration-200",
            isActive && "drop-shadow-md"
          )} />
          
          {/* Window indicators */}
          {windows.length > 0 && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              {windows.slice(0, 3).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    'h-0.5 rounded-full transition-all duration-300',
                    isActive 
                      ? 'w-3.5' 
                      : 'w-2 bg-foreground/40'
                  )}
                  style={isActive ? {
                    background: 'linear-gradient(to right, var(--primary-accent), var(--secondary-accent))',
                    boxShadow: '0 0 4px var(--primary-accent)'
                  } : undefined}
                />
              ))}
            </div>
          )}
          
          {/* Notification dot */}
          {appName === 'contact' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </motion.div>
      
      {/* Simple Tooltip */}
      <AnimatePresence>
        {showTooltip && !showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
              {appName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Window Preview */}
      <AnimatePresence>
        {showPreview && windows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="glass-heavy rounded-lg p-3 shadow-2xl min-w-[250px]">
              <div className="flex flex-col gap-2">
                {windows.map((window) => (
                  <div
                    key={window.windowId}
                    className="px-3 py-2 rounded-md hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3"
                    onClick={() => onLeftClick()}
                  >
                    <DynamicIcon name={icon} size={16} className="opacity-70" />
                    <div className="text-sm font-medium">{window.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom tooltip component for system tray
function SystemTrayTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 800);
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Taskbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showSystemTray, setShowSystemTray] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [batteryLevel] = useState(85); // Mock battery level
  
  const {
    windows,
    desktopIcons,
    openWindow,
    restoreWindow,
    minimizeWindow,
    closeWindow,
    setActiveWindow,
    getWindowsByComponent,
    systemState,
    setBootState,
    notifications,
    toggleTheme,
    toggleWifi,
    setVolume,
    getGradientStyle,
  } = useOSStore();
  
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Clear search when menus close
  useEffect(() => {
    if (!showStartMenu && !showSearchMenu) {
      setSearchQuery('');
    }
  }, [showStartMenu, showSearchMenu]);
  
  // Filter apps based on search query
  const filteredApps = desktopIcons.filter(icon => 
    icon.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle search submission
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredApps.length > 0) {
      const firstApp = filteredApps[0];
      handleAppClick(firstApp.appId);
      setSearchQuery('');
      setShowStartMenu(false);
      setShowSearchMenu(false);
    }
  };

  const handleAppClick = (appId: string) => {
    const appWindows = getWindowsByComponent(appId);
    
    if (appWindows.length === 0) {
      // Open new window
      const icon = desktopIcons.find((i) => i.appId === appId);
      if (icon) {
        // Calculate center position for new window
        const windowWidth = 800;
        const windowHeight = 600;
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        
        const centerX = Math.max(50, (screenWidth - windowWidth) / 2);
        const centerY = Math.max(50, (screenHeight - windowHeight - 48) / 2); // 48px for taskbar
        
        openWindow({
          title: icon.title,
          icon: icon.icon,
          component: appId,
          size: { width: windowWidth, height: windowHeight },
          position: { x: centerX, y: centerY },
          isMinimized: false,
          isMaximized: false,
        });
      }
    } else if (appWindows.length === 1) {
      // Single window - restore or minimize
      const window = appWindows[0];
      if (window.isMinimized) {
        restoreWindow(window.id);
      } else if (window.isActive) {
        minimizeWindow(window.id);
      } else {
        setActiveWindow(window.id);
      }
    } else {
      // Multiple windows - cycle through them
      const activeWindow = appWindows.find(w => w.isActive);
      if (activeWindow) {
        const index = appWindows.indexOf(activeWindow);
        const nextWindow = appWindows[(index + 1) % appWindows.length];
        if (nextWindow.isMinimized) {
          restoreWindow(nextWindow.id);
        } else {
          setActiveWindow(nextWindow.id);
        }
      } else {
        // No active window - activate first non-minimized or restore first
        const nonMinimized = appWindows.find(w => !w.isMinimized);
        if (nonMinimized) {
          setActiveWindow(nonMinimized.id);
        } else {
          restoreWindow(appWindows[0].id);
        }
      }
    }
  };

  const handleAppRightClick = (e: React.MouseEvent, appId: string) => {
    const appWindows = getWindowsByComponent(appId);
    const icon = desktopIcons.find((i) => i.appId === appId);
    
    const items: ContextMenuItem[] = [];
    
    if (appWindows.length > 0) {
      items.push({
        label: 'Close all windows',
        icon: <X className="h-4 w-4" />,
        onClick: () => appWindows.forEach(w => closeWindow(w.id)),
      });
      
      if (appWindows.length > 1) {
        items.push({
          label: 'Show all windows',
          onClick: () => appWindows.forEach(w => {
            if (w.isMinimized) restoreWindow(w.id);
            else setActiveWindow(w.id);
          }),
        });
      }
      
      items.push({ label: '', separator: true });
    }
    
    items.push({
      label: icon?.title || 'Open',
      icon: <DynamicIcon name={icon?.icon || 'FileQuestion'} size={16} />,
      onClick: () => handleAppClick(appId),
    });
    
    openContextMenu(e, items);
  };

  const handlePowerAction = (action: 'shutdown' | 'restart') => {
    setShowStartMenu(false);
    if (action === 'shutdown') {
      setBootState('shutting-down');
    } else {
      setBootState('shutting-down');
      setTimeout(() => setBootState('booting'), 1000);
    }
  };

  // Group windows by component
  const windowGroups = desktopIcons.reduce((acc, icon) => {
    const appWindows = windows
      .filter(w => w.component === icon.appId)
      .map(w => ({
        windowId: w.id,
        title: w.title,
        icon: w.icon,
      }));
    
    if (appWindows.length > 0 || true) { // Always show pinned apps
      acc[icon.appId] = {
        icon: icon.icon,
        windows: appWindows,
        isActive: appWindows.some(w => windows.find(win => win.id === w.windowId)?.isActive),
        name: icon.title,
      };
    }
    
    return acc;
  }, {} as Record<string, { icon: string; windows: WindowPreview[]; isActive: boolean; name: string }>);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <>
      <motion.div 
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6,
          delay: 0.4,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="fixed bottom-0 left-0 right-0 h-12 taskbar-glass flex items-center px-3 gap-2"
      >
        {/* Start Button */}
        <SystemTrayTooltip content="Start">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 hover:bg-white/15 transition-all duration-200 group"
              onClick={() => {
                setShowStartMenu(!showStartMenu);
                setShowSearchMenu(false);
                setShowSystemTray(false);
              }}
                          >
                <div className="relative w-6 h-6">
                  <div 
                    className="absolute inset-0 rounded-md shadow-lg group-hover:shadow-xl transition-shadow"
                    style={{ background: getGradientStyle() }}
                  />
                  <Zap className="absolute inset-0 w-4 h-4 m-auto text-white" />
                </div>
              </Button>
          </motion.div>
        </SystemTrayTooltip>
        
        {/* Search Button */}
        <SystemTrayTooltip content="Search apps and files">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              variant="ghost"
              className="h-9 px-4 hover:bg-white/15 transition-all duration-200 flex items-center gap-2"
              onClick={() => {
                setShowSearchMenu(!showSearchMenu);
                setShowStartMenu(false);
                setShowSystemTray(false);
              }}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Search</span>
            </Button>
          </motion.div>
        </SystemTrayTooltip>
        
        <div className="w-px h-8 bg-white/20 mx-1" />
        
        {/* App Buttons */}
        <div className="flex items-center gap-1 flex-1">
          {Object.entries(windowGroups).map(([appId, group]) => (
            <TaskbarButton
              key={appId}
              windows={group.windows}
              icon={group.icon}
              isActive={group.isActive}
              appName={group.name}
              onLeftClick={() => handleAppClick(appId)}
              onRightClick={(e) => handleAppRightClick(e, appId)}
            />
          ))}
        </div>
        
        <div className="w-px h-8 bg-white/20 mx-1" />
        
        {/* System Tray */}
        <div className="flex items-center gap-1">
          <SystemTrayTooltip content="Show hidden icons">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/15 transition-all relative"
              onClick={() => {
                setShowSystemTray(!showSystemTray);
                setShowStartMenu(false);
                setShowSearchMenu(false);
              }}
            >
              <ChevronUp className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </SystemTrayTooltip>
          
          <div className="flex items-center gap-2 px-2">
            <SystemTrayTooltip content={systemState.wifi ? 'Connected' : 'No internet'}>
              {systemState.wifi ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4 opacity-50" />
              )}
            </SystemTrayTooltip>
            
            <SystemTrayTooltip content={`Volume: ${systemState.volume}%`}>
              {systemState.volume > 0 ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4 opacity-50" />
              )}
            </SystemTrayTooltip>
            
            <SystemTrayTooltip content={`Battery: ${batteryLevel}%`}>
              {batteryLevel < 20 ? (
                <BatteryLow className="h-4 w-4 text-red-500" />
              ) : (
                <Battery className="h-4 w-4" />
              )}
            </SystemTrayTooltip>
          </div>
        </div>
        
        {/* Clock */}
        <SystemTrayTooltip content={format(currentTime, 'EEEE, MMMM d, yyyy')}>
          <Button
            variant="ghost"
            className="h-10 px-3 hover:bg-white/15 transition-all duration-200"
            onClick={() => {/* Could open calendar */}}
          >
            <div className="text-sm text-center">
              <div className="font-medium">{format(currentTime, 'h:mm a')}</div>
              <div className="text-xs opacity-80">{format(currentTime, 'M/d/yyyy')}</div>
            </div>
          </Button>
        </SystemTrayTooltip>
      </motion.div>
      
      {/* System Tray Popup */}
      <AnimatePresence>
        {showSystemTray && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowSystemTray(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-14 right-4 z-50 w-[320px] glass-heavy rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-medium mb-3">Quick Settings</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={systemState.wifi ? "default" : "outline"}
                    className="h-16 flex flex-col gap-1"
                    onClick={toggleWifi}
                  >
                    <Wifi className="h-5 w-5" />
                    <span className="text-xs">Wi-Fi</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col gap-1"
                    onClick={() => setVolume(systemState.volume > 0 ? 0 : 75)}
                  >
                    {systemState.volume > 0 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    <span className="text-xs">Sound</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col gap-1"
                    onClick={toggleTheme}
                  >
                    {systemState.theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <span className="text-xs">Theme</span>
                  </Button>
                </div>
                
                {unreadNotifications > 0 && (
                  <>
                    <div className="h-px bg-white/20" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">{unreadNotifications} new notifications</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Start Menu - Fixed Height */}
      <AnimatePresence>
        {showStartMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowStartMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-14 left-4 z-50 w-[600px] h-[500px] glass-heavy rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex h-full">
                {/* Left sidebar */}
                <div className="w-[200px] glass p-4 border-r border-white/10 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ background: getGradientStyle() }}
                    >
                      A
                    </div>
                    <div>
                      <div className="font-semibold">Ahsan Nayaz</div>
                      <div className="text-xs opacity-70">AI Engineer</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-white/10"
                      onClick={() => {
                        handleAppClick('settings');
                        setShowStartMenu(false);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </div>
                  
                  <div className="space-y-1 pt-4 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-white/10"
                      onClick={() => handlePowerAction('restart')}
                    >
                      <RotateCcw className="h-4 w-4 mr-3" />
                      Restart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-white/10"
                      onClick={() => handlePowerAction('shutdown')}
                    >
                      <Power className="h-4 w-4 mr-3" />
                      Shut down
                    </Button>
                  </div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Type to search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      className="glass border-white/20 focus:border-[var(--primary-accent)]"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex-1 overflow-auto scrollbar-minimal">
                    <div>
                      <h3 className="text-xs font-semibold mb-2 opacity-60">All Apps</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {filteredApps.map((icon) => (
                          <Button
                            key={icon.id}
                            variant="ghost"
                            className="h-20 flex flex-col gap-2 hover:bg-white/10"
                            onClick={() => {
                              handleAppClick(icon.appId);
                              setShowStartMenu(false);
                            }}
                          >
                            <DynamicIcon name={icon.icon} size={24} />
                            <span className="text-xs">{icon.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Search Overlay - Enhanced Animation */}
      <AnimatePresence mode="wait">
        {showSearchMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowSearchMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  duration: 0.25,
                  ease: [0.23, 1, 0.32, 1]
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 10,
                transition: {
                  duration: 0.15,
                  ease: "easeInOut"
                }
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[600px] glass-heavy rounded-xl shadow-2xl overflow-hidden"
            >
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.1,
                    duration: 0.2
                  }
                }}
              >
                <Input
                  type="text"
                  placeholder="Search for apps, files, and settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="text-lg glass border-white/20 focus:border-[var(--primary-accent)] mb-4"
                  autoFocus
                />
                
                <AnimatePresence mode="wait">
                  {searchQuery && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <h3 className="text-xs font-semibold opacity-60 mb-2">Apps</h3>
                      {filteredApps.map((icon, index) => (
                        <motion.div
                          key={icon.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: index * 0.03,
                              duration: 0.2
                            }
                          }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-white/10"
                            onClick={() => {
                              handleAppClick(icon.appId);
                              setShowSearchMenu(false);
                            }}
                          >
                            <DynamicIcon name={icon.icon} size={20} className="mr-3" />
                            {icon.title}
                          </Button>
                        </motion.div>
                      ))}
                      
                      {filteredApps.length === 0 && (
                        <motion.div 
                          className="text-center py-8 opacity-50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          No results found for "{searchQuery}"
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={contextMenu.position}
          onClose={closeContextMenu}
        />
      )}
    </>
  );
} 