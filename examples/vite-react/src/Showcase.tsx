import { useId, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  Textarea,
} from '@devvy-ui/react';

/** Shared by the docs and Vite app so the examples exercise published package exports. */
export function Showcase() {
  const id = useId();
  const [saved, setSaved] = useState(false);
  return (
    <div className="showcase">
      <Card>
        <CardHeader>
          <div className="preview-eyebrow">
            <span className="project-mark">
              <img src="/devvy-logo.png" alt="" width={28} height={28} />
            </span>
            <Badge tone="brand">Workspace</Badge>
          </div>
          <CardTitle>Make room for your next idea.</CardTitle>
          <CardDescription>A few good defaults. Every detail yours.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            label="Project setup"
            items={[
              {
                value: 'general',
                label: 'General',
                content: (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setSaved(true);
                    }}
                    onChange={() => setSaved(false)}
                  >
                    <div className="field">
                      <Label htmlFor={`${id}-name`}>Project name</Label>
                      <Input
                        id={`${id}-name`}
                        name="name"
                        defaultValue="Orbit workspace"
                        required
                      />
                    </div>
                    <div className="field">
                      <Label htmlFor={`${id}-description`}>
                        Description <span className="optional">(optional)</span>
                      </Label>
                      <Textarea
                        id={`${id}-description`}
                        name="description"
                        rows={2}
                        defaultValue="A little space to build something good."
                      />
                    </div>
                    <Separator />
                    <div className="preference">
                      <div>
                        <Label htmlFor={`${id}-updates`}>Product updates</Label>
                        <p>Only the things worth knowing.</p>
                      </div>
                      <Switch id={`${id}-updates`} name="updates" defaultChecked />
                    </div>
                    <Label className="check-label">
                      <Checkbox name="terms" required defaultChecked />I agree to the community
                      guidelines
                    </Label>
                    <div className="preview-actions">
                      <Button type="submit">
                        Save changes <span aria-hidden="true">↗</span>
                      </Button>
                      <Button variant="ghost" type="reset" onClick={() => setSaved(false)}>
                        Reset
                      </Button>
                    </div>
                    <p role="status" className="save-status">
                      {saved
                        ? 'Changes saved in this preview.'
                        : 'This is a local preview. Your data stays here.'}
                    </p>
                  </form>
                ),
              },
              {
                value: 'members',
                label: 'Members',
                content: (
                  <div className="members">
                    <h3>Your space, your people.</h3>
                    <p>Alex Chen · Owner</p>
                    <p>Sam Rivera · Developer</p>
                    <Badge>2 members</Badge>
                  </div>
                ),
              },
              {
                value: 'billing',
                label: 'Billing',
                disabled: true,
                content: 'Billing is unavailable in this local example.',
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
