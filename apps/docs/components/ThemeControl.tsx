'use client';
import { useEffect, useState } from 'react';
import { SelectControl } from './SelectControl';
import { InterfaceIcon } from './InterfaceIcon';
export function ThemeControl() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.dataset.devvyTheme = theme;
  }, [theme]);
  return (
    <div className="theme-control">
      <SelectControl
        label="Site theme"
        hideLabel
        icon={
          <InterfaceIcon name={theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'system'} />
        }
        aria-label="Site theme"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </SelectControl>
    </div>
  );
}
