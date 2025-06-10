'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  separator?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose: () => void;
  position: { x: number; y: number };
}

export function ContextMenu({ items, onClose, position }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Adjust position to keep menu in viewport
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newX = position.x + rect.width > window.innerWidth 
        ? window.innerWidth - rect.width - 10 
        : position.x;
      const newY = position.y + rect.height > window.innerHeight 
        ? window.innerHeight - rect.height - 10 
        : position.y;
      
      setAdjustedPosition({ x: newX, y: newY });
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [position, onClose]);
  
  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      onClose();
    }
  };
  
  return (
    <motion.div
      ref={menuRef}
      className="fixed z-[10000] min-w-[200px] glass rounded-lg shadow-2xl overflow-hidden"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <div className="py-1">
        {items.map((item, index) => {
          if (item.separator) {
            return <div key={index} className="h-px bg-border/50 my-1" />;
          }
          
          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button
                className={cn(
                  'w-full px-3 py-2 text-sm text-left flex items-center justify-between gap-2',
                  'hover:bg-muted/50 transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {item.shortcut}
                  </span>
                )}
                {item.submenu && (
                  <span className="ml-2">›</span>
                )}
              </button>
              
              {/* Submenu */}
              <AnimatePresence>
                {item.submenu && activeSubmenu === item.label && (
                  <motion.div
                    className="absolute left-full top-0 ml-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="glass rounded-lg shadow-2xl overflow-hidden min-w-[180px] py-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          className={cn(
                            'w-full px-3 py-2 text-sm text-left flex items-center justify-between gap-2',
                            'hover:bg-muted/50 transition-colors',
                            subItem.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => {
                            if (!subItem.disabled && subItem.onClick) {
                              subItem.onClick();
                              onClose();
                            }
                          }}
                          disabled={subItem.disabled}
                        >
                          <div className="flex items-center gap-2">
                            {subItem.icon && <span className="w-4 h-4">{subItem.icon}</span>}
                            <span>{subItem.label}</span>
                          </div>
                          {subItem.shortcut && (
                            <span className="text-xs text-muted-foreground">
                              {subItem.shortcut}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

interface UseContextMenuResult {
  contextMenu: {
    isOpen: boolean;
    position: { x: number; y: number };
    items: ContextMenuItem[];
  } | null;
  openContextMenu: (e: React.MouseEvent, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
}

export function useContextMenu(): UseContextMenuResult {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    items: ContextMenuItem[];
  } | null>(null);
  
  const openContextMenu = (e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      items,
    });
  };
  
  const closeContextMenu = () => {
    setContextMenu(null);
  };
  
  return { contextMenu, openContextMenu, closeContextMenu };
} 