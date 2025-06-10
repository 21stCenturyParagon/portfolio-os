import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import app components
const appComponents = {
  about: dynamic(() => import('@/components/apps/about-app'), {
    loading: () => <AppLoading />,
  }),
  projects: dynamic(() => import('@/components/apps/projects-app'), {
    loading: () => <AppLoading />,
  }),
  skills: dynamic(() => import('@/components/apps/skills-app'), {
    loading: () => <AppLoading />,
  }),
  blog: dynamic(() => import('@/components/apps/blog-app'), {
    loading: () => <AppLoading />,
  }),
  contact: dynamic(() => import('@/components/apps/contact-app'), {
    loading: () => <AppLoading />,
  }),
  terminal: dynamic(() => import('@/components/apps/terminal-app'), {
    loading: () => <AppLoading />,
  }),
  settings: dynamic(() => import('@/components/apps/settings'), {
    loading: () => <AppLoading />,
  }),
};

function AppLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
    </div>
  );
}

interface AppRendererProps {
  componentName: string;
}

export function AppRenderer({ componentName }: AppRendererProps) {
  const Component = appComponents[componentName as keyof typeof appComponents];
  
  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">App not found: {componentName}</p>
      </div>
    );
  }
  
  return (
    <Suspense fallback={<AppLoading />}>
      <Component />
    </Suspense>
  );
} 