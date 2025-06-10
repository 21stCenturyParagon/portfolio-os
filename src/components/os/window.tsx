'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, Maximize, Minimize2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOSStore } from '@/lib/stores/os-store';
import { Window as WindowType } from '@/types/os';
import { DynamicIcon } from './dynamic-icon';
import { Button } from '@/components/ui/button';

interface WindowProps {
  window: WindowType;
  children: React.ReactNode;
}

export function Window({ window, children }: WindowProps) {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [previousPosition, setPreviousPosition] = useState({ x: 100, y: 100 });
  const [previousSize, setPreviousSize] = useState({ width: 800, height: 600 });
  
  // Local position state for smooth dragging
  const [localPosition, setLocalPosition] = useState({ 
    x: window.position.x, 
    y: window.position.y 
  });
  
  // Local size state for smooth resizing
  const [localSize, setLocalSize] = useState({ 
    width: window.size.width, 
    height: window.size.height 
  });
  
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
    windowAnimationStates,
  } = useOSStore();
  
  // Get animation state from store
  const animationState = windowAnimationStates[window.id];
  const isMinimizing = animationState === 'minimizing';
  const isRestoring = animationState === 'restoring';

  // Sync local state with store state when not actively manipulating
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setLocalPosition({ x: window.position.x, y: window.position.y });
      setLocalSize({ width: window.size.width, height: window.size.height });
    }
  }, [window.position, window.size, isDragging, isResizing]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!window.isMaximized && !isResizing) {
        dragControls.start(e);
      }
    },
    [dragControls, window.isMaximized, isResizing]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setActiveWindow(window.id);
  }, [window.id, setActiveWindow]);

  const handleDrag = useCallback((event: any, info: any) => {
    if (!isResizing && !window.isMaximized) {
      // For left/top positioning, we need to add the delta directly
      const newX = localPosition.x + info.delta.x;
      const newY = localPosition.y + info.delta.y;
      
      setLocalPosition({
        x: newX,
        y: newY
      });
    }
  }, [localPosition, window.isMaximized, isResizing]);

  const handleDragEnd = useCallback((event: any, info: any) => {
    if (!isResizing && !window.isMaximized) {
      // Get viewport dimensions
      const viewportWidth = typeof globalThis !== 'undefined' ? globalThis.innerWidth : 1920;
      const viewportHeight = typeof globalThis !== 'undefined' ? globalThis.innerHeight : 1080;
      
      // Ensure window stays within viewport bounds
      // Keep at least 100px of the window visible on each edge
      const minVisibleWidth = 100;
      const minVisibleHeight = 50;
      
      // Constrain position
      let newX = Math.max(minVisibleWidth - localSize.width, Math.min(localPosition.x, viewportWidth - minVisibleWidth));
      let newY = Math.max(0, Math.min(localPosition.y, viewportHeight - minVisibleHeight - 48)); // 48px for taskbar
      
      const newPosition = { x: newX, y: newY };
      
      updateWindowPosition(window.id, newPosition);
      setLocalPosition(newPosition);
    }
    setIsDragging(false);
  }, [window.id, localPosition, window.isMaximized, isResizing, updateWindowPosition, localSize]);

  const handleResize = useCallback(
    (direction: string) => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.isMaximized) return;
      
      setIsResizing(true);
      setActiveWindow(window.id);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = localSize.width;
      const startHeight = localSize.height;
      const startPosX = localPosition.x;
      const startPosY = localPosition.y;
      
      const minWidth = 300;
      const minHeight = 200;
      
      // Use refs to track current values during resize
      const currentSize = { width: startWidth, height: startHeight };
      const currentPosition = { x: startPosX, y: startPosY };
      
      const handlePointerMove = (e: PointerEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newPosX = startPosX;
        let newPosY = startPosY;
        
        // Handle horizontal resizing
        if (direction.includes('right')) {
          newWidth = Math.max(minWidth, startWidth + deltaX);
        } else if (direction.includes('left')) {
          const potentialWidth = startWidth - deltaX;
          if (potentialWidth >= minWidth) {
            newWidth = potentialWidth;
            newPosX = startPosX + deltaX;
          } else {
            newWidth = minWidth;
            newPosX = startPosX + (startWidth - minWidth);
          }
        }
        
        // Handle vertical resizing
        if (direction.includes('bottom')) {
          newHeight = Math.max(minHeight, startHeight + deltaY);
        } else if (direction.includes('top')) {
          const potentialHeight = startHeight - deltaY;
          if (potentialHeight >= minHeight) {
            newHeight = potentialHeight;
            newPosY = startPosY + deltaY;
          } else {
            newHeight = minHeight;
            newPosY = startPosY + (startHeight - minHeight);
          }
        }
        
        // Update tracking variables
        currentSize.width = newWidth;
        currentSize.height = newHeight;
        currentPosition.x = newPosX;
        currentPosition.y = newPosY;
        
        // Update local state for immediate visual feedback
        setLocalSize({ width: newWidth, height: newHeight });
        setLocalPosition({ x: newPosX, y: newPosY });
      };
      
      const handlePointerUp = () => {
        // Commit the current tracked values to the store
        updateWindowSize(window.id, currentSize);
        updateWindowPosition(window.id, currentPosition);
        
        // Update local state to match final values
        setLocalSize({ width: currentSize.width, height: currentSize.height });
        setLocalPosition({ x: currentPosition.x, y: currentPosition.y });
        
        setIsResizing(false);
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
      
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [window.id, window.isMaximized, localSize, localPosition, updateWindowSize, updateWindowPosition, setActiveWindow]
  );

  const handleMaximizeToggle = useCallback(() => {
    if (window.isMaximized) {
      // Restore to previous position and size
      restoreWindow(window.id);
    } else {
      // Save current position and size before maximizing
      setPreviousPosition({ x: localPosition.x, y: localPosition.y });
      setPreviousSize({ width: localSize.width, height: localSize.height });
      maximizeWindow(window.id);
    }
  }, [window.id, window.isMaximized, maximizeWindow, restoreWindow, localPosition, localSize]);

  const handleMinimize = useCallback(() => {
    // Just call minimizeWindow - the animation is handled by the store
    minimizeWindow(window.id);
  }, [window.id, minimizeWindow]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      closeWindow(window.id);
    }, 200);
  }, [window.id, closeWindow]);

  if (window.isMinimized && !isMinimizing) return null;

  // Calculate target position and size based on state
  const targetPosition = window.isMaximized 
    ? { x: 0, y: 0 }
    : { x: localPosition.x, y: localPosition.y };
    
  const targetSize = window.isMaximized
    ? { 
        width: typeof globalThis !== 'undefined' ? globalThis.innerWidth : 1920,
        height: (typeof globalThis !== 'undefined' ? globalThis.innerHeight : 1080) - 48
      }
    : { width: localSize.width, height: localSize.height };

  // Calculate taskbar position for minimize animation
  const viewportHeight = typeof globalThis !== 'undefined' ? globalThis.innerHeight : 1080;
  const minimizeTargetY = viewportHeight - 24; // Animate to just above taskbar

  return (
    <motion.div
      ref={windowRef}
      className={cn(
        'fixed flex flex-col window-glass overflow-hidden',
        window.isMaximized ? '' : 'rounded-xl',
        window.isActive && 'ring-2 ring-[var(--system-accent)]',
        (isResizing || isDragging) && 'select-none'
      )}
      style={{
        zIndex: window.zIndex,
      }}
      drag={!window.isMaximized && !isResizing && !isMinimizing}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      dragTransition={{ power: 0, timeConstant: 0 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onPointerDown={() => !isDragging && !isResizing && setActiveWindow(window.id)}
      initial={isRestoring ? { 
        scale: 0.5, 
        opacity: 0,
        width: targetSize.width,
        height: targetSize.height,
        x: targetPosition.x,
        y: minimizeTargetY
      } : { 
        scale: 0.9, 
        opacity: 0,
        width: targetSize.width,
        height: targetSize.height,
        x: targetPosition.x,
        y: targetPosition.y
      }}
      animate={{ 
        scale: isClosing || isMinimizing ? 0.5 : 1, 
        opacity: isClosing || isMinimizing ? 0 : 1,
        width: window.isMaximized ? targetSize.width : localSize.width,
        height: window.isMaximized ? targetSize.height : localSize.height,
        x: window.isMaximized ? 0 : localPosition.x,
        y: isMinimizing ? minimizeTargetY : (window.isMaximized ? 0 : localPosition.y),
      }}
      exit={{ scale: 0.5, opacity: 0, y: minimizeTargetY }}
      transition={{ 
        scale: { 
          duration: isRestoring || isMinimizing ? 0.3 : 0.2, 
          ease: isRestoring ? 'easeOut' : isMinimizing ? 'easeIn' : 'easeInOut' 
        },
        opacity: { 
          duration: isRestoring || isMinimizing ? 0.3 : 0.2 
        },
        width: { 
          duration: isResizing || isDragging ? 0 : 0.3, 
          ease: 'easeInOut' 
        },
        height: { 
          duration: isResizing || isDragging ? 0 : 0.3, 
          ease: 'easeInOut' 
        },
        x: { 
          duration: isDragging || isResizing ? 0 : 0.3, 
          ease: 'easeInOut' 
        },
        y: { 
          duration: isDragging || isResizing ? 0 : 0.3, 
          ease: isMinimizing ? 'easeIn' : isRestoring ? 'easeOut' : 'easeInOut' 
        },
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between h-11 px-4 glass border-b border-white/10 select-none cursor-move"
        onPointerDown={handlePointerDown}
      >
        <div className="flex items-center gap-3">
          <DynamicIcon name={window.icon} size={18} className="text-foreground/80" />
          <span className="text-sm font-medium">{window.title}</span>
        </div>
        
        {/* Window Controls */}
        <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
          {/* Minimize */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-yellow-500/20 hover:text-yellow-500"
              onClick={handleMinimize}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M3 7H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </motion.div>
          
          {/* Maximize/Restore */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-green-500/20 hover:text-green-500"
              onClick={handleMaximizeToggle}
            >
              {window.isMaximized ? (
                // Restore icon - two overlapping squares
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="M4.5 2.5H9.5C10.0523 2.5 10.5 2.94772 10.5 3.5V8.5C10.5 9.05228 10.0523 9.5 9.5 9.5H4.5C3.94772 9.5 3.5 9.05228 3.5 8.5V3.5C3.5 2.94772 3.94772 2.5 4.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M6.5 4.5V3C6.5 2.44772 6.94772 2 7.5 2H11C11.5523 2 12 2.44772 12 3V6.5C12 7.05228 11.5523 7.5 11 7.5H9.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              ) : (
                // Maximize icon - single square
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                >
                  <rect
                    x="3"
                    y="3"
                    width="8"
                    height="8"
                    rx="0.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </Button>
          </motion.div>
          
          {/* Close */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive"
              onClick={handleClose}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-background/40 scrollbar-accent">
        {children}
      </div>
      
      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          {/* Edge handles */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('top')}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('bottom')}
          />
          <div
            className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('left')}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('right')}
          />
          
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('top-left')}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-[var(--system-accent)]/20"
            onPointerDown={handleResize('bottom-right')}
          />
        </>
      )}
    </motion.div>
  );
} 