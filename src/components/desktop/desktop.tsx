'use client';

import { useRef } from 'react';
import { useOSStore } from '@/lib/stores/os-store';
import { DesktopIcon } from './desktop-icon';
import { ContextMenu, ContextMenuItem, useContextMenu } from '@/components/os/context-menu';
import { AnimatePresence } from 'framer-motion';
import { 
  Wallpaper, 
  FolderPlus, 
  FileText, 
  RefreshCw, 
  Settings,
  Palette,
  Image as ImageIcon 
} from 'lucide-react';

export function Desktop() {
  const { desktopIcons, backgroundImage, openWindow, setBackgroundImage, getGradientStyle } = useOSStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();
  
  const handleDesktopRightClick = (e: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      {
        label: 'View',
        submenu: [
          { label: 'Large icons', onClick: () => {} },
          { label: 'Medium icons', onClick: () => {} },
          { label: 'Small icons', onClick: () => {} },
          { label: '', separator: true },
          { label: 'Auto arrange icons', onClick: () => {} },
          { label: 'Align icons to grid', onClick: () => {} },
        ],
      },
      { label: '', separator: true },
      {
        label: 'Refresh',
        icon: <RefreshCw className="h-4 w-4" />,
        onClick: () => window.location.reload(),
      },
      { label: '', separator: true },
      {
        label: 'New',
        submenu: [
          {
            label: 'Folder',
            icon: <FolderPlus className="h-4 w-4" />,
            onClick: () => {},
            disabled: true,
          },
          {
            label: 'Text Document',
            icon: <FileText className="h-4 w-4" />,
            onClick: () => {},
            disabled: true,
          },
        ],
      },
      { label: '', separator: true },
      {
        label: 'Change background',
        icon: <ImageIcon className="h-4 w-4" />,
        onClick: () => fileInputRef.current?.click(),
      },
      {
        label: 'Personalize',
        icon: <Palette className="h-4 w-4" />,
        onClick: () => {
          openWindow({
            title: 'Settings',
            icon: 'Settings',
            component: 'settings',
            size: { width: 800, height: 600 },
            position: { x: 100, y: 100 },
            isMinimized: false,
            isMaximized: false,
          });
        },
      },
    ];
    
    openContextMenu(e, items);
  };
  
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setBackgroundImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden no-context-menu"
      onContextMenu={handleDesktopRightClick}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient background when no image is set */}
      {!backgroundImage && (
        <div 
          className="absolute inset-0" 
          style={{ background: getGradientStyle() }}
        />
      )}
      
      {/* Icons */}
      {desktopIcons.map((icon) => (
        <DesktopIcon key={icon.id} icon={icon} />
      ))}
      
      {/* Hidden file input for background upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundUpload}
        className="hidden"
      />
      
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            items={contextMenu.items}
            position={contextMenu.position}
            onClose={closeContextMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 