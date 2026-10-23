'use client';

import { useId, useState } from 'react';
import { Button } from '@devvy-ui/react';
import { LandingStudio } from './LandingStudio';
import { HeroGlassCard } from './HeroGlassCard';
import { WorkspacePreferences } from './WorkspacePreferences';
import { LandingComponents } from './LandingComponents';
import { SelectControl } from './SelectControl';
import { InterfaceIcon } from './InterfaceIcon';

export function LandingExamples() {
  const id = useId();
  const [accent, setAccent] = useState('forest');
  const [density, setDensity] = useState('default');
  return (
    <div className="landing-examples" data-preview-accent={accent} data-devvy-density={density}>
      <div className="examples-toolbar">
        <span className="examples-caption">
          <span className="status-dot" aria-hidden="true" />
          Live components. Real interactions.
        </span>
        <div className="examples-controls">
          <SelectControl
            label="Accent"
            layout="inline"
            icon={<span className="accent-picker-dot" />}
            id={`${id}-accent`}
            aria-label="Example accent"
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
            controlSize="sm"
          >
            <option value="forest">Forest</option>
            <option value="ink">Ink</option>
            <option value="clay">Clay</option>
          </SelectControl>
          <SelectControl
            label="Density"
            layout="inline"
            icon={<InterfaceIcon name="layout" />}
            id={`${id}-density`}
            aria-label="Example density"
            value={density}
            onChange={(event) => setDensity(event.target.value)}
            controlSize="sm"
          >
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </SelectControl>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAccent('forest');
              setDensity('default');
            }}
          >
            Reset preview
          </Button>
        </div>
      </div>
      <LandingComponents />
      <div className="landing-workspace-label">
        <span>THE PIECES, PUT TOGETHER</span>
        <p>A working workspace. Made with the same components.</p>
      </div>
      <div className="landing-showcase-grid">
        <LandingStudio />
        <div className="landing-showcase-side">
          <WorkspacePreferences />
          <HeroGlassCard />
        </div>
      </div>
    </div>
  );
}
