'use client';
import { useState } from 'react';
import { Popover, RadioGroup } from '@devvy-ui/react';
import { useSiteTheme, type FontChoice } from './SiteTheme';
import { SelectControl } from './SelectControl';
import { InterfaceIcon } from './InterfaceIcon';
export function ThemeControl() {
  const { theme, style, font, setTheme, setStyle, setFont } = useSiteTheme();
  const [open, setOpen] = useState(false);
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
        onChange={(event) => setTheme(event.target.value as 'light' | 'dark' | 'system')}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </SelectControl>
      <Popover
        label="Choose a DEVVY style"
        open={open}
        onOpenChange={setOpen}
        trigger={<InterfaceIcon name="palette" />}
        triggerProps={{
          className: 'site-style-trigger',
          title: `DEVVY ${style}: change style`,
          'aria-label': 'Choose a DEVVY style',
        }}
        className="site-style-panel"
      >
        <RadioGroup
          label="Signature style"
          value={style}
          onValueChange={(value) => setStyle(value as 'minimal' | 'modern' | 'glass')}
          items={[
            {
              value: 'minimal',
              label: 'DEVVY Minimal',
              description: 'Clean surfaces, crisp type. The default.',
            },
            {
              value: 'modern',
              label: 'DEVVY Modern',
              description: 'Dark-first, refined contrast and green accents.',
            },
            {
              value: 'glass',
              label: 'DEVVY Glass',
              description: 'Adaptive frost, with solid-surface fallbacks.',
            },
          ]}
        />
        <p>
          Style and appearance are independent. Use the light, dark or system control for either
          material.
        </p>
        <SelectControl
          label="Interface font"
          value={font}
          onChange={(event) => setFont(event.target.value as FontChoice)}
        >
          <option value="system">System · no download</option>
          <option value="geist">Geist</option>
          <option value="manrope">Manrope</option>
          <option value="geist-mono">Geist Mono</option>
        </SelectControl>
        <a href="/ui/fonts">Explore the font collection →</a>
      </Popover>
    </div>
  );
}
