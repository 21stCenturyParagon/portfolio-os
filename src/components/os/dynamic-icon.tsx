import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size = 24 }: DynamicIconProps) {
  const Icon = (Icons as any)[name] as LucideIcon;
  
  if (!Icon) {
    console.warn(`Icon "${name}" not found`);
    return <Icons.FileQuestion className={className} size={size} />;
  }
  
  return <Icon className={className} size={size} />;
} 