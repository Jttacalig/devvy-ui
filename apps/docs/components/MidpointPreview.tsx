'use client';
import { useId, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  AspectRatio,
  Container,
  Stack,
  Grid,
  Typography,
  IconButton,
  Accordion,
  Pagination,
  RadioGroup,
  Slider,
  Table,
  Form,
  FormField,
  Fieldset,
  NumberInput,
  PasswordInput,
  SearchField,
  SegmentedControl,
  ColorPicker,
  CircularProgress,
  Spinner,
  EmptyState,
  StatusIndicator,
  Collapsible,
  DescriptionList,
  Meter,
  CopyButton,
  Button,
  Input,
  Label,
  Checkbox,
  Card,
  CardContent,
} from '@devvy-ui/react';

const plans = [
  { value: 'solo', label: 'Solo', description: 'For your next idea.' },
  { value: 'team', label: 'Team', description: 'For shared projects.' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
];
const projects = ['Orbit workspace', 'Dev Station studio', 'Field notes'];
export function MidpointPreview({ name }: { name: string }) {
  const id = useId();
  const [starred, setStarred] = useState(false);
  const [page, setPage] = useState(1);
  const [plan, setPlan] = useState('team');
  const [volume, setVolume] = useState(35);
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [query, setQuery] = useState('');
  const [color, setColor] = useState('#087565');
  const [progress, setProgress] = useState(35);
  const [loading, setLoading] = useState(true);
  const [created, setCreated] = useState(false);
  const [open, setOpen] = useState(false);
  const [storage, setStorage] = useState(45);
  const star = (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={starred ? 'currentColor' : 'none'}
      stroke="currentColor"
    >
      <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />
    </svg>
  );
  let preview;
  switch (name) {
    case 'avatar':
      preview = (
        <Stack direction="row" align="center" wrap>
          <Avatar name="Ada Rivera" size="sm" />
          <Avatar name="Bea Cruz" />
          <Avatar name="Cal Lee" size="lg" shape="square" />
        </Stack>
      );
      break;
    case 'avatar-group':
      preview = (
        <AvatarGroup label="Project contributors" max={3}>
          <Avatar name="Ada Rivera" />
          <Avatar name="Bea Cruz" />
          <Avatar name="Cal Lee" />
          <Avatar name="Drew Park" />
          <Avatar name="Eli Wong" />
        </AvatarGroup>
      );
      break;
    case 'aspect-ratio':
      preview = (
        <AspectRatio ratio={16 / 9} className="midpoint-ratio">
          <div>
            <strong>Room for your next idea.</strong>
            <p>A responsive 16:9 canvas.</p>
          </div>
        </AspectRatio>
      );
      break;
    case 'container':
      preview = (
        <Container size="sm" className="midpoint-layout-surface">
          <Typography as="h3" variant="heading">
            A focused reading column.
          </Typography>
          <p>Responsive gutters keep this content comfortable on small screens.</p>
        </Container>
      );
      break;
    case 'stack':
      preview = (
        <Stack gap="1rem">
          <Typography as="h3" variant="heading">
            Space to compose.
          </Typography>
          <Stack direction="row" gap="0.75rem" wrap>
            <Button onClick={() => setMessage('Changes saved.')}>Save changes</Button>
            <Button variant="outline" onClick={() => setMessage('Changes discarded.')}>
              Discard
            </Button>
          </Stack>
          <p role="status">{message || 'Choose an action.'}</p>
        </Stack>
      );
      break;
    case 'grid':
      preview = (
        <Grid minItemWidth="9rem">
          {['Design', 'Build', 'Ship'].map((item) => (
            <Card key={item}>
              <CardContent>
                <strong>{item}</strong>
                <p>One considered step.</p>
              </CardContent>
            </Card>
          ))}
        </Grid>
      );
      break;
    case 'typography':
      preview = (
        <Stack>
          <Typography as="h3" variant="heading">
            Build with intention.
          </Typography>
          <Typography>A clear hierarchy makes the important details easier to find.</Typography>
          <Typography variant="small" tone="muted">
            Small details. Complete ownership.
          </Typography>
          <Typography as="code" variant="code">
            --dvy-brand: #087565;
          </Typography>
        </Stack>
      );
      break;
    case 'icon-button':
      preview = (
        <Stack direction="row" align="center">
          <IconButton
            label="Star project"
            aria-pressed={starred}
            variant="outline"
            onClick={() => setStarred((value) => !value)}
          >
            {star}
          </IconButton>
          <span role="status">{starred ? 'Project starred' : 'Project not starred'}</span>
        </Stack>
      );
      break;
    case 'accordion':
      preview = (
        <Accordion
          items={[
            {
              value: 'ownership',
              title: 'Can I customize the source?',
              content: (
                <p>Yes. Keep the MIT notice and change the implementation to suit your project.</p>
              ),
            },
            {
              value: 'themes',
              title: 'How do themes work?',
              content: <p>Override the scoped CSS tokens for your colors, type and spacing.</p>,
            },
            {
              value: 'soon',
              title: 'Future adapters',
              content: 'Not available yet.',
              disabled: true,
            },
          ]}
        />
      );
      break;
    case 'pagination':
      preview = (
        <Stack>
          <Pagination page={page} count={12} onPageChange={setPage} />
          <p role="status">Showing page {page} of 12</p>
        </Stack>
      );
      break;
    case 'radio-group':
      preview = (
        <Form onSubmit={(event) => event.preventDefault()} onReset={() => setPlan('team')}>
          <RadioGroup
            label="Workspace plan"
            name="plan"
            items={plans}
            value={plan}
            onValueChange={setPlan}
            required
          />
          <p role="status">Selected plan: {plan}</p>
          <Button type="reset" variant="outline">
            Reset plan
          </Button>
        </Form>
      );
      break;
    case 'slider':
      preview = (
        <Stack>
          <Label htmlFor={id}>Volume · {volume}%</Label>
          <Slider
            id={id}
            label="Volume"
            name="volume"
            value={volume}
            onChange={(event) => setVolume(event.currentTarget.valueAsNumber)}
          />
          <Button variant="outline" onClick={() => setVolume(35)}>
            Reset volume
          </Button>
        </Stack>
      );
      break;
    case 'table':
      preview = (
        <Table caption="Project activity" striped>
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Status</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Orbit workspace</th>
              <td>Ready</td>
              <td>Ada</td>
            </tr>
            <tr>
              <th scope="row">Dev Station studio</th>
              <td>In progress</td>
              <td>Bea</td>
            </tr>
            <tr>
              <th scope="row">Field notes</th>
              <td>Draft</td>
              <td>Cal</td>
            </tr>
          </tbody>
        </Table>
      );
      break;
    case 'form':
      preview = (
        <>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              setMessage('Subscribed: ' + new FormData(event.currentTarget).get('email'));
            }}
            onReset={() => setMessage('')}
          >
            <FormField label="Email address" required description="Used for workspace updates.">
              {(field) => (
                <Input {...field} name="email" type="email" placeholder="you@example.com" />
              )}
            </FormField>
            <Stack direction="row" wrap>
              <Button type="submit">Subscribe</Button>
              <Button type="reset" variant="outline">
                Reset form
              </Button>
            </Stack>
          </Form>
          <p role="status">{message}</p>
        </>
      );
      break;
    case 'form-field':
      preview = (
        <Stack>
          <FormField
            label="Workspace email"
            required
            description="Use an address you can access."
            error={invalid ? 'Enter a valid workspace email.' : undefined}
          >
            {(field) => <Input {...field} name="email" type="email" />}
          </FormField>
          <Button variant="outline" onClick={() => setInvalid((value) => !value)}>
            {invalid ? 'Clear field error' : 'Show field error'}
          </Button>
        </Stack>
      );
      break;
    case 'fieldset':
      preview = (
        <Stack>
          <Fieldset
            legend="Notifications"
            description="Choose your workspace updates."
            disabled={invalid}
          >
            <Label>
              <Checkbox name="product" defaultChecked /> Product updates
            </Label>
            <Label>
              <Checkbox name="releases" /> Release notes
            </Label>
          </Fieldset>
          <Button variant="outline" onClick={() => setInvalid((value) => !value)}>
            {invalid ? 'Enable notifications' : 'Disable notifications'}
          </Button>
        </Stack>
      );
      break;
    case 'number-input':
      preview = (
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setMessage('Reserved ' + new FormData(event.currentTarget).get('seats') + ' seats.');
          }}
          onReset={() => setMessage('')}
        >
          <FormField label="Seats" required description="Choose between 1 and 100 seats.">
            {(field) => (
              <NumberInput {...field} name="seats" min={1} max={100} step={1} defaultValue={3} />
            )}
          </FormField>
          <Stack direction="row" wrap>
            <Button type="submit">Reserve seats</Button>
            <Button type="reset" variant="outline">
              Reset seats
            </Button>
          </Stack>
          <p role="status">{message}</p>
        </Form>
      );
      break;
    case 'password-input':
      preview = (
        <FormField
          label="Workspace password"
          description="Use a unique password for this workspace."
        >
          {(field) => (
            <PasswordInput
              {...field}
              name="password"
              autoComplete="new-password"
              defaultValue="your-demo-password"
            />
          )}
        </FormField>
      );
      break;
    case 'search-field':
      preview = (
        <Stack>
          <Label htmlFor={id}>Find a project</Label>
          <SearchField
            id={id}
            label="Find a project"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
          />
          <ul>
            {projects
              .filter((project) => project.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
              .map((project) => (
                <li key={project}>{project}</li>
              ))}
          </ul>
          <p role="status">
            {
              projects.filter((project) =>
                project.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
              ).length
            }{' '}
            matching projects
          </p>
        </Stack>
      );
      break;
    case 'segmented-control':
      preview = (
        <Stack>
          <SegmentedControl
            label="Billing frequency"
            name="billing"
            value={plan === 'solo' ? 'yearly' : 'monthly'}
            onValueChange={(value) => setPlan(value === 'yearly' ? 'solo' : 'team')}
            items={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
          <p role="status">Billing: {plan === 'solo' ? 'yearly' : 'monthly'}</p>
        </Stack>
      );
      break;
    case 'color-picker':
      preview = (
        <Stack>
          <Label htmlFor={id}>Accent color</Label>
          <Stack direction="row" align="center">
            <ColorPicker
              id={id}
              label="Accent color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <code>{color}</code>
            <span
              className="midpoint-color-swatch"
              aria-hidden="true"
              style={{ backgroundColor: color }}
            />
          </Stack>
        </Stack>
      );
      break;
    case 'circular-progress':
      preview = (
        <Stack>
          <Stack direction="row" align="center" gap="1.5rem">
            <CircularProgress label="Preparing export" value={progress} showValue />
            <CircularProgress label="Connecting to workspace" size="sm" />
          </Stack>
          <p>Preparing export · {progress}%</p>
          <Button
            onClick={() => setProgress((value) => (value >= 100 ? 0 : Math.min(100, value + 15)))}
          >
            {progress >= 100 ? 'Restart export' : 'Advance export'}
          </Button>
        </Stack>
      );
      break;
    case 'spinner':
      preview = (
        <Stack>
          {loading ? (
            <Spinner label="Loading project details" size="lg" />
          ) : (
            <p role="status">Project details loaded.</p>
          )}
          <Button variant="outline" onClick={() => setLoading((value) => !value)}>
            {loading ? 'Finish loading' : 'Show loading'}
          </Button>
        </Stack>
      );
      break;
    case 'empty-state':
      preview = created ? (
        <Stack>
          <StatusIndicator label="Orbit workspace created" tone="brand" />
          <Button variant="outline" onClick={() => setCreated(false)}>
            Reset empty state
          </Button>
        </Stack>
      ) : (
        <EmptyState title="No projects yet" description="Create a workspace to get started.">
          <Button onClick={() => setCreated(true)}>Create project</Button>
        </EmptyState>
      );
      break;
    case 'status-indicator':
      preview = (
        <Stack>
          <StatusIndicator label="All systems operational" tone="brand" />
          <StatusIndicator label="Maintenance scheduled" />
          <StatusIndicator label="Connection needs attention" tone="danger" />
        </Stack>
      );
      break;
    case 'collapsible':
      preview = (
        <Collapsible summary="Advanced workspace settings" open={open} onOpenChange={setOpen}>
          <Label htmlFor={id}>Project alias</Label>
          <Input id={id} defaultValue="orbit" />
          <p>Only change this if your project needs a different alias.</p>
        </Collapsible>
      );
      break;
    case 'description-list':
      preview = (
        <DescriptionList
          items={[
            { term: 'Workspace', description: 'Orbit' },
            { term: 'Plan', description: 'Team' },
            { term: 'Region', description: 'Asia Pacific' },
            { term: 'Owner', description: 'Ada Rivera' },
          ]}
        />
      );
      break;
    case 'meter':
      preview = (
        <Stack>
          <Label htmlFor={id}>Storage used · {storage} of 100 GB</Label>
          <Meter
            id={id}
            label="Storage used"
            value={storage}
            min={0}
            max={100}
            low={20}
            high={80}
            optimum={10}
          />
          <Button
            variant="outline"
            onClick={() => setStorage((value) => (value >= 95 ? 15 : value + 10))}
          >
            Change storage use
          </Button>
        </Stack>
      );
      break;
    case 'copy-button':
      preview = (
        <Stack>
          <code>--dvy-brand: #087565;</code>
          <CopyButton text="--dvy-brand: #087565;">Copy theme token</CopyButton>
        </Stack>
      );
      break;
    default:
      throw new Error('Missing midpoint preview: ' + name);
  }
  return (
    <div className="midpoint-preview" data-component-preview={name}>
      {preview}
    </div>
  );
}
