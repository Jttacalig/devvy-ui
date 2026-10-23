'use client';

import { useId, useState } from 'react';
import { Button, Progress, Slider, Switch } from '@devvy-ui/react';
import { LandingCard } from './LandingCard';
import { SelectControl } from './SelectControl';

export function WorkspacePreferences() {
  const id = useId();
  const [notifications, setNotifications] = useState(true);
  const [region, setRegion] = useState('Asia Pacific');
  const [capacity, setCapacity] = useState(64);
  const [message, setMessage] = useState('');
  return (
    <LandingCard
      className="workspace-preferences"
      category="Workspace"
      title="Work, your way."
      description="A few small choices. A workspace that fits."
      footer={
        <Button type="submit" form={`${id}-preferences`} variant="outline">
          Save preferences <span aria-hidden="true">↗</span>
        </Button>
      }
    >
      <form
        id={`${id}-preferences`}
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(
            `Saved: ${region}, ${capacity}% capacity, updates ${notifications ? 'on' : 'off'}.`,
          );
        }}
      >
        <label className="preference-switch" htmlFor={`${id}-updates`}>
          <span>
            <strong>Keep me in the loop</strong>
            <small>Weekly project updates</small>
          </span>
          <Switch
            id={`${id}-updates`}
            aria-label="Weekly project updates"
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
          />
        </label>
        <SelectControl
          label="Workspace region"
          id={`${id}-region`}
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        >
          <option>Asia Pacific</option>
          <option>Europe</option>
          <option>Americas</option>
        </SelectControl>
        <div className="preference-capacity">
          <span>Weekly capacity</span>
          <output>{capacity}%</output>
        </div>
        <Slider
          label="Weekly capacity"
          value={capacity}
          min={10}
          max={100}
          step={1}
          onChange={(event) => setCapacity(Number(event.target.value))}
        />
        <Progress label="Selected weekly capacity" value={capacity} size="sm" />
        <p className="preference-feedback" role="status">
          {message || 'Local demo. Your settings stay in this preview.'}
        </p>
      </form>
    </LandingCard>
  );
}
