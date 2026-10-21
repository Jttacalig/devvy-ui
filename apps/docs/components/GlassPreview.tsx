'use client';

import { useId, useRef, useState, type CSSProperties } from 'react';
import { SelectControl } from './SelectControl';
import { InterfaceIcon } from './InterfaceIcon';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  Dock,
  Glass,
  Input,
  Label,
  Switch,
} from '@devvy-ui/react';

const views = ['Overview', 'Activity', 'Library'] as const;
function Mark({ kind }: { kind: 'grid' | 'pulse' | 'layers' | 'settings' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'grid' ? (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </>
      ) : kind === 'pulse' ? (
        <path d="M3 12h4l3-7 4 14 3-7h4" />
      ) : kind === 'layers' ? (
        <>
          <path d="m12 3 10 6-10 6L2 9Z" />
          <path d="m3 13 9 5 9-5M3 17l9 5 9-5" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" />
        </>
      )}
    </svg>
  );
}

export function GlassPreview() {
  const id = useId();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [quality, setQuality] = useState<'auto' | 'full' | 'reduced'>('auto');
  const [tint, setTint] = useState('mint');
  const [blur, setBlur] = useState(14);
  const [opacity, setOpacity] = useState(88);
  const [lighting, setLighting] = useState('135');
  const [view, setView] = useState<(typeof views)[number]>('Overview');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('A little space to make something good.');
  const [tasks, setTasks] = useState([true, true, false]);
  const nameInput = useRef<HTMLInputElement>(null);
  const dialogTrigger = useRef<HTMLButtonElement | null>(null);
  const material: CSSProperties & {
    '--dvy-glass-blur': string;
    '--dvy-glass-opacity': number;
    '--dvy-glass-light-angle': string;
  } = {
    '--dvy-glass-blur': `${blur}px`,
    '--dvy-glass-opacity': opacity / 100,
    '--dvy-glass-light-angle': `${lighting}deg`,
  };
  return (
    <div className="glass-playground" id="glass-studio">
      <div className="glass-studio-heading">
        <div>
          <span className="studio-eyebrow">INTERACTIVE PREVIEW</span>
          <h3>Material studio</h3>
          <p>Fine-tune the details. See them come to life.</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Reset material settings"
          onClick={() => {
            setTheme('dark');
            setQuality('auto');
            setTint('mint');
            setBlur(14);
            setOpacity(88);
            setLighting('135');
          }}
        >
          <InterfaceIcon name="reset" /> Reset
        </Button>
      </div>
      <div className="glass-controls" id="material-controls">
        <SelectControl
          label="Appearance"
          icon={<InterfaceIcon name={theme === 'dark' ? 'moon' : 'sun'} />}
          aria-label="Glass appearance"
          value={theme}
          onChange={(event) => setTheme(event.target.value === 'light' ? 'light' : 'dark')}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </SelectControl>
        <SelectControl
          label="Effects"
          icon={<InterfaceIcon name="light" />}
          aria-label="Glass effect quality"
          value={quality}
          onChange={(event) => {
            const value = event.target.value;
            if (value === 'auto' || value === 'full' || value === 'reduced') setQuality(value);
          }}
        >
          <option value="auto">Automatic</option>
          <option value="full">Full effects</option>
          <option value="reduced">Reduced effects</option>
        </SelectControl>
        <SelectControl
          label="Atmosphere"
          icon={<span className="atmosphere-swatch" data-atmosphere={tint} />}
          aria-label="Glass atmosphere"
          value={tint}
          onChange={(event) => setTint(event.target.value)}
        >
          <option value="mint">Mint</option>
          <option value="ocean">Ocean</option>
          <option value="amber">Amber</option>
        </SelectControl>
      </div>
      <div className="glass-preview-frame">
        <Glass
          theme={theme}
          quality={quality}
          style={material}
          className="glass-scene"
          data-tint={tint}
        >
          <div className="glass-orbit glass-orbit-one" aria-hidden="true" />
          <div className="glass-orbit glass-orbit-two" aria-hidden="true" />
          <div className="glass-scene-content">
            <div className="glass-scene-top">
              <div className="glass-scene-brand">
                <span className="glass-mini-mark">
                  <img src="/devvy-logo.png" alt="" width="26" height="26" />
                </span>
                <span>
                  orbit<span className="glass-brand-slash"> / </span>workspace
                </span>
              </div>
              <span className="glass-live-tag">
                <span />
                LOCAL PREVIEW
              </span>
            </div>
            <nav
              className="dvy-floating-nav glass-preview-nav"
              aria-label="Glass preview navigation"
            >
              <a href="#material-workspace">Workspace</a>
              <a href="#material-controls">Customize</a>
              <a href="#glass-api">Use the theme ↗</a>
            </nav>
            <div className="glass-workspace-heading" id="material-workspace">
              <div>
                <span className="glass-kicker">A CLEARER WAY TO CREATE</span>
                <h3>
                  {view === 'Overview'
                    ? 'Space for your next idea.'
                    : view === 'Activity'
                      ? 'A little progress, every day.'
                      : 'Good things, kept close.'}
                </h3>
                <p role="status">
                  {view === 'Overview'
                    ? message
                    : view === 'Activity'
                      ? 'Your design checklist is ready to explore.'
                      : 'Your reusable building blocks live here.'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={(event) => {
                  dialogTrigger.current = event.currentTarget;
                  setOpen(true);
                }}
                aria-haspopup="dialog"
              >
                Workspace settings <span aria-hidden="true">↗</span>
              </Button>
            </div>
            <div className="glass-card-grid">
              <Card className="glass-project-card">
                <CardContent>
                  <div className="glass-card-top">
                    <span className="glass-project-icon">
                      <Mark kind="layers" />
                    </span>
                    <Badge tone="brand">In the making</Badge>
                  </div>
                  <p className="glass-kicker">PERSONAL PROJECT / 001</p>
                  <h4>
                    {view === 'Library' ? 'Your component collection' : 'A considered beginning.'}
                  </h4>
                  <p>
                    Thoughtful surfaces. Familiar controls. All the room you need to make it yours.
                  </p>
                  <div className="glass-project-divider" />
                  <div className="glass-project-footer">
                    <span className="glass-avatar" aria-hidden="true">
                      DS
                    </span>
                    <span>
                      Designed by you.<small>Built with DEVVY UI</small>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setView('Library');
                        setMessage('Your component collection is open.');
                      }}
                    >
                      Explore <span aria-hidden="true">↗</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-checklist-card">
                <CardContent>
                  <div className="glass-card-top">
                    <h4>Ready for takeoff</h4>
                    <span className="glass-complete">{tasks.filter(Boolean).length}/3</span>
                  </div>
                  <p className="glass-checklist-description">A small start is still a start.</p>
                  <div className="glass-task-list">
                    {['Choose your palette', 'Make it accessible', 'Build your next idea'].map(
                      (task, index) => (
                        <Label key={task}>
                          <Checkbox
                            checked={tasks[index]}
                            onChange={(event) =>
                              setTasks((previous) =>
                                previous.map((checked, current) =>
                                  current === index ? event.target.checked : checked,
                                ),
                              )
                            }
                          />
                          {task}
                        </Label>
                      ),
                    )}
                  </div>
                  <div className="glass-checklist-bottom">
                    <span className="status-dot" /> Everything stays in this preview.
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="glass-dock-wrap">
              <Dock label="Workspace shortcuts">
                {views.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={item}
                    aria-pressed={view === item}
                    onClick={() => setView(item)}
                  >
                    <Mark kind={index === 0 ? 'grid' : index === 1 ? 'pulse' : 'layers'} />
                    <span>{item}</span>
                  </button>
                ))}
                <span className="glass-dock-divider" aria-hidden="true" />
                <button
                  type="button"
                  onClick={(event) => {
                    dialogTrigger.current = event.currentTarget;
                    setOpen(true);
                  }}
                  aria-label="Open workspace settings"
                  aria-haspopup="dialog"
                >
                  <Mark kind="settings" />
                </button>
              </Dock>
            </div>
            <p className="glass-scene-caption">
              Real DEVVY components · Illustrative workspace · No data leaves this page
            </p>
          </div>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Shape your workspace"
            description="A few personal touches. Saved only for this preview."
            initialFocusRef={nameInput}
            returnFocusRef={dialogTrigger}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setMessage(
                  `${nameInput.current?.value || 'Your workspace'} is ready. Make something good.`,
                );
                setOpen(false);
              }}
            >
              <div className="field">
                <Label htmlFor={`${id}-workspace`}>Workspace name</Label>
                <Input
                  ref={nameInput}
                  id={`${id}-workspace`}
                  name="workspace"
                  defaultValue="Orbit"
                  required
                  maxLength={64}
                />
              </div>
              <Label className="glass-dialog-switch">
                <Switch defaultChecked />
                Keep the focus on your work
              </Label>
              <div className="glass-dialog-actions">
                <Button type="submit">Save workspace</Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Dialog>
        </Glass>
      </div>
      <div className="glass-tuning">
        <label htmlFor={`${id}-blur`}>
          Frost <output>{blur}px</output>
          <input
            id={`${id}-blur`}
            aria-label="Glass blur"
            type="range"
            min="4"
            max="20"
            step="2"
            value={blur}
            onChange={(event) => setBlur(Number(event.target.value))}
          />
        </label>
        <label htmlFor={`${id}-opacity`}>
          Surface <output>{opacity}%</output>
          <input
            id={`${id}-opacity`}
            aria-label="Glass surface opacity"
            type="range"
            min="80"
            max="98"
            step="2"
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value))}
          />
        </label>
        <SelectControl
          label="Lighting"
          icon={<InterfaceIcon name="sun" />}
          aria-label="Glass lighting"
          value={lighting}
          onChange={(event) => setLighting(event.target.value)}
        >
          <option value="135">Top left</option>
          <option value="225">Top right</option>
          <option value="45">Bottom left</option>
        </SelectControl>
      </div>
      <div className="glass-studio-footer">
        <span>
          <span className="status-dot" /> Changes apply instantly
        </span>
        <a href="#glass-api">
          View integration guide <InterfaceIcon name="arrow" />
        </a>
      </div>
    </div>
  );
}
