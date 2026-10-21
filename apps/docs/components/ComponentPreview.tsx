'use client';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  Textarea,
  Glass,
  Dialog,
  Dock,
} from '@devvy-ui/react';
import '@devvy-ui/styles/glass.css';
import { useId, useState, useRef } from 'react';
import { ChartPreview, NavigationPreview } from './DataNavigationPreview';
import type { ComponentName } from '../lib/catalog';
export function ComponentPreview({ name }: { name: ComponentName }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const invoker = useRef<HTMLButtonElement>(null);
  return (
    <div className="component-preview">
      <h2 className="sr-only">Interactive preview</h2>
      {name === 'chart' ? (
        <ChartPreview />
      ) : ['navbar', 'sidebar', 'breadcrumbs'].includes(name) ? (
        <NavigationPreview name={name} />
      ) : name === 'button' ? (
        <div className="button-row">
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>
      ) : name === 'badge' ? (
        <div className="button-row">
          <Badge>Draft</Badge>
          <Badge tone="brand">Ready</Badge>
          <Badge tone="danger">Action required</Badge>
        </div>
      ) : name === 'input' ? (
        <div className="field">
          <Label htmlFor={id}>Email</Label>
          <Input id={id} type="email" placeholder="you@example.com" />
        </div>
      ) : name === 'textarea' ? (
        <div className="field">
          <Label htmlFor={id}>Notes</Label>
          <Textarea id={id} placeholder="What are you building?" />
        </div>
      ) : name === 'label' ? (
        <>
          <Label htmlFor={id}>Project name</Label>
          <Input id={id} placeholder="Your next idea" />
        </>
      ) : name === 'checkbox' ? (
        <div className="control-stack">
          <Label>
            <Checkbox defaultChecked />
            Include documentation
          </Label>
          <Label>
            <Checkbox indeterminate />
            Some items selected
          </Label>
          <Label>
            <Checkbox disabled />
            Unavailable option
          </Label>
        </div>
      ) : name === 'switch' ? (
        <div className="control-stack">
          <Label>
            <Switch defaultChecked />
            Product updates
          </Label>
          <Label>
            <Switch disabled />
            Unavailable preference
          </Label>
        </div>
      ) : name === 'card' ? (
        <Card>
          <CardContent>
            <CardTitle>A place for your idea.</CardTitle>
            <p>Compose a surface from simple parts.</p>
          </CardContent>
        </Card>
      ) : name === 'separator' ? (
        <div>
          <p>Project settings</p>
          <Separator decorative={false} />
          <p>Team settings</p>
        </div>
      ) : name === 'glass' ? (
        <Glass theme="dark" quality="auto">
          <Card>
            <CardContent>
              <CardTitle>Clarity with a little depth.</CardTitle>
              <p>Explore the full material lab at /ui/glass.</p>
              <Button variant="outline">Your next idea</Button>
            </CardContent>
          </Card>
        </Glass>
      ) : name === 'dialog' ? (
        <>
          <Button ref={invoker} onClick={() => setOpen(true)} aria-haspopup="dialog">
            Open settings
          </Button>
          <Dialog
            open={open}
            returnFocusRef={invoker}
            onOpenChange={setOpen}
            title="Workspace settings"
            description="A native dialog with familiar controls."
          >
            <Button onClick={() => setOpen(false)}>Done</Button>
          </Dialog>
        </>
      ) : name === 'dock' ? (
        <Dock label="Example navigation">
          <a href="/ui" aria-current="page">
            Introduction
          </a>
          <a href="/ui/glass">Glass</a>
          <a href="/ui/components">Components</a>
        </Dock>
      ) : (
        <Tabs
          label="Example views"
          items={[
            { value: 'overview', label: 'Overview', content: <p>Everything in one place.</p> },
            {
              value: 'activity',
              label: 'Activity',
              content: <p>Your project is ready to build.</p>,
            },
            { value: 'disabled', label: 'Archived', disabled: true, content: 'Archived projects' },
          ]}
        />
      )}
    </div>
  );
}
