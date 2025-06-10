'use client';

import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useOSStore } from '@/lib/stores/os-store';
import { DesktopIcon as DesktopIconType } from '@/types/os';
import { DynamicIcon } from '@/components/os/dynamic-icon';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: DesktopIconType;
}

export function DesktopIcon({ icon }: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  const { openWindow, updateIconPosition } = useOSStore();
  
  const handleDoubleClick = () => {
    console.log('Desktop icon double-clicked:', icon.appId);
    
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
      component: icon.appId,
      size: { width: windowWidth, height: windowHeight },
      position: { x: centerX, y: centerY },
      isMinimized: false,
      isMaximized: false,
    });
  };
  
  const handleDragEnd = (event: any, info: any) => {
    const newPosition = {
      x: icon.position.x + info.offset.x,
      y: icon.position.y + info.offset.y,
    };
    updateIconPosition(icon.id, newPosition);
    setIsDragging(false);
  };
  
  return (
    <motion.div
      className={cn(
        'absolute flex flex-col items-center justify-center w-20 p-2',
        'cursor-pointer select-none group',
        isDragging && 'opacity-50'
      )}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ power: 0, timeConstant: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ x: icon.position.x, y: icon.position.y }}
      animate={{ x: icon.position.x, y: icon.position.y }}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-white/10 transition-colors">
        <DynamicIcon name={icon.icon} size={32} className="text-white drop-shadow-md" />
      </div>
      <span className="text-xs text-white text-center max-w-[70px] break-words drop-shadow-md mt-1">
        {icon.title}
      </span>
    </motion.div>
  );
} 