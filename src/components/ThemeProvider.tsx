'use client';

import { useEffect } from 'react';
import { useTimeCycle } from '@/hooks/useTimeCycle';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { timeOfDay, initTimeCycle } = useTimeCycle();

  useEffect(() => {
    initTimeCycle();
  }, [initTimeCycle]);

  useEffect(() => {
    // Remove previous theme classes
    document.body.classList.remove('theme-morning', 'theme-afternoon', 'theme-evening', 'theme-night');
    // Add new theme class
    document.body.classList.add(`theme-${timeOfDay}`);
  }, [timeOfDay]);

  return <>{children}</>;
}
