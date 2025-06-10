import { create } from 'zustand';
import { Window, DesktopIcon, SystemNotification, SystemState } from '@/types/os';

interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

interface OSStore {
  // Windows
  windows: Window[];
  activeWindowId: string | null;
  nextZIndex: number;
  windowAnimationStates: Record<string, 'minimizing' | 'restoring' | null>;
  
  // Desktop
  desktopIcons: DesktopIcon[];
  backgroundImage: string | null;
  
  // System
  systemState: SystemState;
  notifications: SystemNotification[];
  bootState: 'booting' | 'running' | 'shutting-down' | 'off';
  
  // Theme colors
  colorPreset: string;
  primaryAccent: string;
  secondaryAccent: string;
  
  // Window actions
  openWindow: (window: Omit<Window, 'id' | 'zIndex' | 'isActive'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  getWindowsByComponent: (component: string) => Window[];
  setWindowAnimationState: (id: string, state: 'minimizing' | 'restoring' | null) => void;
  
  // Desktop actions
  updateIconPosition: (id: string, position: { x: number; y: number }) => void;
  setBackgroundImage: (image: string | null) => void;
  
  // System actions
  toggleTheme: () => void;
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  setBootState: (state: 'booting' | 'running' | 'shutting-down' | 'off') => void;
  
  // Theme actions
  setColorPreset: (presetId: string) => void;
  setPrimaryAccent: (color: string) => void;
  setSecondaryAccent: (color: string) => void;
  getGradientStyle: () => string;
  
  // Notification actions
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const colorPresets: ColorPreset[] = [
  { id: 'ocean', name: 'Ocean', primary: '#2E3192', secondary: '#1BFFFF' },
  { id: 'sunset', name: 'Sunset', primary: '#F83600', secondary: '#F9D423' },
  { id: 'forest', name: 'Forest', primary: '#134E5E', secondary: '#71B280' },
  { id: 'lavender', name: 'Lavender', primary: '#667eea', secondary: '#764ba2' },
  { id: 'fire', name: 'Fire', primary: '#f12711', secondary: '#f5af19' },
  { id: 'midnight', name: 'Midnight', primary: '#0f0c29', secondary: '#302b63' },
  { id: 'aurora', name: 'Aurora', primary: '#00F260', secondary: '#0575E6' },
  { id: 'rose', name: 'Rose', primary: '#ED213A', secondary: '#93291E' },
  { id: 'default', name: 'Default Blue', primary: '#1e3a8a', secondary: '#7c3aed' },
  { id: 'custom', name: 'Custom', primary: '#1e3a8a', secondary: '#7c3aed' },
];

export const useOSStore = create<OSStore>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,
  nextZIndex: 1000,
  windowAnimationStates: {},
  
  desktopIcons: [
    { id: 'about', title: 'About Me', icon: 'User', appId: 'about', position: { x: 20, y: 20 } },
    { id: 'projects', title: 'Projects', icon: 'FolderOpen', appId: 'projects', position: { x: 20, y: 120 } },
    { id: 'skills', title: 'Skills & Experience', icon: 'FileText', appId: 'skills', position: { x: 20, y: 220 } },
    { id: 'blog', title: 'Blog', icon: 'BookOpen', appId: 'blog', position: { x: 20, y: 320 } },
    { id: 'contact', title: 'Contact', icon: 'Mail', appId: 'contact', position: { x: 20, y: 420 } },
    { id: 'terminal', title: 'Terminal', icon: 'Terminal', appId: 'terminal', position: { x: 20, y: 520 } },
    { id: 'settings', title: 'Settings', icon: 'Settings', appId: 'settings', position: { x: 20, y: 620 } },
  ],
  
  backgroundImage: null,
  
  systemState: {
    theme: 'dark',
    volume: 75,
    brightness: 80,
    wifi: true,
    bluetooth: false,
  },
  
  notifications: [],
  bootState: 'booting',
  
  // Theme colors
  colorPreset: 'default',
  primaryAccent: '#1e3a8a',
  secondaryAccent: '#7c3aed',
  
  // Window actions
  openWindow: (windowData) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { nextZIndex } = get();
    
    // Ensure window position is within viewport bounds
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    // Calculate a safe position that keeps the window visible
    const maxX = Math.max(0, viewportWidth - windowData.size.width);
    const maxY = Math.max(0, viewportHeight - windowData.size.height - 48); // 48px for taskbar
    
    const safePosition = {
      x: Math.min(Math.max(0, windowData.position.x), maxX),
      y: Math.min(Math.max(0, windowData.position.y), maxY)
    };
    
    // Add some offset for multiple windows
    const windowCount = get().windows.length;
    const offset = windowCount * 30;
    safePosition.x = Math.min(safePosition.x + offset, maxX);
    safePosition.y = Math.min(safePosition.y + offset, maxY);
    
    set((state) => ({
      windows: [
        ...state.windows,
        {
          ...windowData,
          id,
          position: safePosition,
          zIndex: nextZIndex,
          isActive: true,
        },
      ],
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },
  
  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },
  
  minimizeWindow: (id) => {
    // Set animation state first
    set((state) => ({
      windowAnimationStates: { ...state.windowAnimationStates, [id]: 'minimizing' }
    }));
    
    // Delay the actual minimize to allow animation
    setTimeout(() => {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isMinimized: true, isActive: false } : w
        ),
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        windowAnimationStates: { ...state.windowAnimationStates, [id]: null }
      }));
    }, 300);
  },
  
  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    }));
  },
  
  restoreWindow: (id) => {
    const { nextZIndex } = get();
    
    // Set animation state first
    set((state) => ({
      windowAnimationStates: { ...state.windowAnimationStates, [id]: 'restoring' },
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, isMaximized: false, isActive: true, zIndex: nextZIndex }
          : { ...w, isActive: false }
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
    
    // Clear animation state after animation completes
    setTimeout(() => {
      set((state) => ({
        windowAnimationStates: { ...state.windowAnimationStates, [id]: null }
      }));
    }, 300);
  },
  
  setActiveWindow: (id) => {
    const { nextZIndex } = get();
    
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, isActive: true, zIndex: nextZIndex }
          : { ...w, isActive: false }
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },
  
  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }));
  },
  
  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    }));
  },
  
  getWindowsByComponent: (component) => {
    return get().windows.filter(w => w.component === component);
  },
  
  setWindowAnimationState: (id, state) => {
    set((prevState) => ({
      windowAnimationStates: { ...prevState.windowAnimationStates, [id]: state }
    }));
  },
  
  // Desktop actions
  updateIconPosition: (id, position) => {
    set((state) => ({
      desktopIcons: state.desktopIcons.map((icon) =>
        icon.id === id ? { ...icon, position } : icon
      ),
    }));
  },
  
  setBackgroundImage: (image) => {
    set({ backgroundImage: image });
  },
  
  // System actions
  toggleTheme: () => {
    set((state) => ({
      systemState: {
        ...state.systemState,
        theme: state.systemState.theme === 'light' ? 'dark' : 'light',
      },
    }));
  },
  
  setVolume: (volume) => {
    set((state) => ({
      systemState: { ...state.systemState, volume },
    }));
  },
  
  setBrightness: (brightness) => {
    set((state) => ({
      systemState: { ...state.systemState, brightness },
    }));
  },
  
  toggleWifi: () => {
    set((state) => ({
      systemState: {
        ...state.systemState,
        wifi: !state.systemState.wifi,
      },
    }));
  },
  
  toggleBluetooth: () => {
    set((state) => ({
      systemState: {
        ...state.systemState,
        bluetooth: !state.systemState.bluetooth,
      },
    }));
  },
  
  setBootState: (bootState) => {
    set({ bootState });
  },
  
  // Theme actions
  setColorPreset: (presetId) => {
    const preset = colorPresets.find(p => p.id === presetId);
    if (preset) {
      set({ 
        colorPreset: presetId,
        primaryAccent: preset.primary,
        secondaryAccent: preset.secondary
      });
      
      // Update CSS variables
      document.documentElement.style.setProperty('--primary-accent', preset.primary);
      document.documentElement.style.setProperty('--secondary-accent', preset.secondary);
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('color-preset', presetId);
        localStorage.setItem('primary-accent', preset.primary);
        localStorage.setItem('secondary-accent', preset.secondary);
      }
    }
  },
  
  setPrimaryAccent: (color) => {
    set({ 
      primaryAccent: color,
      colorPreset: 'custom'
    });
    document.documentElement.style.setProperty('--primary-accent', color);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('primary-accent', color);
    }
  },
  
  setSecondaryAccent: (color) => {
    set({ 
      secondaryAccent: color,
      colorPreset: 'custom'
    });
    document.documentElement.style.setProperty('--secondary-accent', color);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('secondary-accent', color);
    }
  },
  
  getGradientStyle: () => {
    const { primaryAccent, secondaryAccent } = get();
    return `linear-gradient(to bottom right, ${primaryAccent}, ${secondaryAccent})`;
  },
  
  // Notification actions
  addNotification: (notification) => {
    const id = `notif-${Date.now()}`;
    
    set((state) => ({
      notifications: [
        {
          ...notification,
          id,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },
  
  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  },
})); 