import { useEffect, useState } from 'react';
import { Button, Glass, Label, Switch } from '@devvy-ui/react';
import '@devvy-ui/styles/glass.css';
import { Showcase } from './Showcase';
export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [glass, setGlass] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.devvyTheme = theme;
  }, [theme]);
  return (
    <main className="playground">
      <header>
        <span className="example-brand">
          <img src="/devvy-logo.png" alt="DEVVY UI" width={44} height={44} />
          <span className="eyebrow">DEV STATION / OPEN SOURCE</span>
        </span>
        <Button variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'}
        </Button>
      </header>
      <h1>
        Build once.
        <br />
        Style freely.
      </h1>
      <p className="lead">DEVVY UI · React foundation · v0.1.0-alpha.0</p>
      <h2 className="sr-only">Component preview</h2>
      <Label className="example-glass-toggle">
        <Switch checked={glass} onChange={(event) => setGlass(event.target.checked)} />
        Use DEVVY GLASS
      </Label>
      <Glass enabled={glass} className="example-material">
        <Showcase />
      </Glass>
      <footer>Ten original foundation components. Ordinary CSS. MIT licensed.</footer>
    </main>
  );
}
