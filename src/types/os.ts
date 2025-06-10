export interface Window {
  id: string;
  title: string;
  icon: string;
  component: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isActive: boolean;
}

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  appId: string;
  position: { x: number; y: number };
}

export interface App {
  id: string;
  title: string;
  icon: string;
  component: string;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface SystemState {
  theme: 'light' | 'dark';
  volume: number;
  brightness: number;
  wifi: boolean;
  bluetooth: boolean;
} 