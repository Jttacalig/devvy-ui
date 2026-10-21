'use client';
import { useEffect, useState } from 'react';
import { SelectControl } from './SelectControl';
import { InterfaceIcon } from './InterfaceIcon';
export function ThemeControl() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const css = document.createElement('style');
    css.appendChild(
      document.createTextNode(
        '*, *::before, *::after { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }',
      ),
    );
    document.head.appendChild(css);

    document.documentElement.dataset.devvyTheme = theme;

    // Force computed style recalculation before transitions are restored
    void window.getComputedStyle(document.documentElement).opacity;

    requestAnimationFrame(() => {
      if (css.parentNode) {
        css.parentNode.removeChild(css);
      }
    });
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
