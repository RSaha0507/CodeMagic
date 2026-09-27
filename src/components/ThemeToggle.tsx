import { useEffect, useState } from 'react';
import { Button } from './ui/button';

type Theme = 'dark' | 'light';

function initialTheme(): Theme {
  const savedTheme = window.localStorage.getItem('codemagic-theme');
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    window.localStorage.setItem('codemagic-theme', theme);
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      className="theme-toggle text-xs"
    >
      {nextTheme === 'light' ? 'Light theme' : 'Dark theme'}
    </Button>
  );
}
