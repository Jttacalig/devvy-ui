'use client';
import { useRef, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CodeBlock,
  ChartInspector,
  DataTable,
  Drawer,
  DropdownMenu,
  Form,
  FormField,
  Input,
  KanbanBoard,
  Stat,
  Tabs,
  Timeline,
} from '@devvy-ui/react';

const initialProjects = [
  {
    id: 'orbit',
    name: 'Orbit workspace',
    category: 'Product design',
    status: 'In progress',
    members: 8,
  },
  { id: 'field', name: 'Field notes', category: 'Editorial system', status: 'Ready', members: 3 },
  {
    id: 'atlas',
    name: 'Atlas library',
    category: 'Design infrastructure',
    status: 'In review',
    members: 5,
  },
];
export function LandingStudio() {
  const [projects, setProjects] = useState(initialProjects),
    [open, setOpen] = useState(false),
    [message, setMessage] = useState(''),
    [cards, setCards] = useState([
      { id: 'tokens', title: 'Refine the tokens', columnId: 'done' },
      { id: 'forms', title: 'Build the project form', columnId: 'building' },
      { id: 'review', title: 'Review with the team', columnId: 'planned' },
    ]);
  const invoker = useRef<HTMLButtonElement>(null);
  return (
    <Card className="landing-studio landing-card">
      <div className="studio-toolbar">
        <div className="studio-identity">
          <span className="studio-mark" aria-hidden="true">
            o
          </span>
          <div>
            <strong>Orbit workspace</strong>
            <span>Sample workspace · Built with DEVVY UI</span>
          </div>
        </div>
        <AvatarGroup label="Sample team" max={3}>
          <Avatar name="Ada Rivera" size="sm" />
          <Avatar name="Bea Cruz" size="sm" />
          <Avatar name="Cal Lee" size="sm" />
        </AvatarGroup>
      </div>
      <div className="studio-body">
        <div className="studio-heading">
          <div>
            <p className="studio-overline">MONDAY, A LITTLE MORE ORGANIZED</p>
            <h3>A place for your next idea.</h3>
            <p>Everything you need. Room to make it yours.</p>
          </div>
          <Button ref={invoker} onClick={() => setOpen(true)}>
            New project <span aria-hidden="true">+</span>
          </Button>
        </div>
        <div className="studio-stats">
          <Stat
            label="Projects"
            value={projects.length}
            description="A few good things in progress"
          />
          <Stat label="People" value="8" description="Working better together" />
          <Stat
            label="Ready for review"
            value={projects.filter((project) => project.status === 'In review').length}
            description="One step closer to shipping"
          />
        </div>
        <Tabs
          label="Sample workspace views"
          defaultValue="projects"
          items={[
            {
              value: 'insights',
              label: 'Insights',
              content: (
                <ChartInspector
                  title="A little progress, every day"
                  description="Fictional completed tasks · Last seven days"
                  type="area"
                  curve="smooth"
                  inspectionLabel="Inspect completed tasks"
                  data={[
                    { label: 'Mon', value: 12 },
                    { label: 'Tue', value: 19 },
                    { label: 'Wed', value: 16 },
                    { label: 'Thu', value: 28 },
                    { label: 'Fri', value: 24 },
                    { label: 'Sat', value: 36 },
                    { label: 'Sun', value: 42 },
                  ]}
                />
              ),
            },
            {
              value: 'projects',
              label: 'Projects',
              content: (
                <DataTable
                  rowSelection={{
                    getRowLabel: (row) => row.name,
                    renderActions: (selectedRows, clear) => (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const ids = new Set(selectedRows.map((row) => row.id));
                          setProjects((list) =>
                            list.map((project) =>
                              ids.has(project.id) ? { ...project, status: 'In review' } : project,
                            ),
                          );
                          setMessage(`${selectedRows.length} projects are ready for review.`);
                          clear();
                        }}
                      >
                        Send selected for review
                      </Button>
                    ),
                  }}
                  label="Your projects"
                  rows={projects}
                  getRowId={(row) => row.id}
                  filterText={(row) => row.name}
                  pageSize={4}
                  columns={[
                    {
                      key: 'name',
                      label: 'Project',
                      render: (row) => (
                        <div className="studio-project-name">
                          <strong>{row.name}</strong>
                          <small>{row.category}</small>
                        </div>
                      ),
                      sortValue: (row) => row.name,
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      render: (row) => <Badge tone="neutral">{row.status}</Badge>,
                      sortValue: (row) => row.status,
                    },
                    {
                      key: 'actions',
                      label: 'Actions',
                      render: (row) => (
                        <DropdownMenu
                          label={'Actions for ' + row.name}
                          trigger="•••"
                          triggerProps={{ 'aria-label': 'Actions for ' + row.name }}
                          items={[
                            {
                              id: 'duplicate',
                              label: 'Duplicate project',
                              onSelect: () => {
                                setProjects((list) => [
                                  ...list,
                                  {
                                    ...row,
                                    id: row.id + '-' + list.length,
                                    name: row.name + ' copy',
                                  },
                                ]);
                                setMessage('Project duplicated.');
                              },
                            },
                            {
                              id: 'review',
                              label: 'Mark ready for review',
                              onSelect: () => {
                                setProjects((list) =>
                                  list.map((project) =>
                                    project.id === row.id
                                      ? { ...project, status: 'In review' }
                                      : project,
                                  ),
                                );
                                setMessage(row.name + ' is ready for review.');
                              },
                            },
                          ]}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              value: 'board',
              label: 'Board',
              content: (
                <KanbanBoard
                  label="Sample project board"
                  columns={[
                    { id: 'planned', label: 'Planned' },
                    { id: 'building', label: 'Building' },
                    { id: 'done', label: 'Done' },
                  ]}
                  items={cards}
                  onItemsChange={setCards}
                />
              ),
            },
            {
              value: 'code',
              label: 'The code',
              content: (
                <CodeBlock
                  label="A component you can own"
                  language="tsx"
                  code={
                    'import { Stat } from "@devvy-ui/react/stat";\n\n<Stat\n  label="Projects"\n  value={projects.length}\n  description="A few good things in progress"\n/>'
                  }
                />
              ),
            },
          ]}
        />
        <p role="status" className="studio-feedback">
          {message ||
            'Try the tabs, filter projects, or create something new. This is a local demo.'}
        </p>
      </div>
      <Drawer
        title="A new beginning."
        description="Give your project a name. You can change everything later."
        open={open}
        onOpenChange={setOpen}
        returnFocusRef={invoker}
      >
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            const name = String(new FormData(event.currentTarget).get('project')).trim();
            if (!name) return;
            setProjects((list) => [
              ...list,
              {
                id: 'project-' + list.length,
                name,
                category: 'Your next idea',
                status: 'In progress',
                members: 1,
              },
            ]);
            setMessage(name + ' created.');
            setOpen(false);
          }}
        >
          <FormField
            label="Project name"
            required
            description="Something memorable, something yours."
          >
            {(field) => (
              <Input {...field} name="project" placeholder="My next idea" maxLength={80} />
            )}
          </FormField>
          <Button type="submit">Create project</Button>
        </Form>
      </Drawer>
    </Card>
  );
}

export function LandingDetails() {
  return (
    <div className="landing-detail-grid">
      <Card className="landing-card">
        <CardHeader>
          <Badge tone="neutral">01 / A LITTLE STRUCTURE</Badge>
          <CardTitle>Good defaults, open doors.</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline
            label="A considered workflow"
            items={[
              {
                id: 'compose',
                title: 'Compose the interface',
                content: <p>Start with native behavior and clear, typed props.</p>,
              },
              {
                id: 'customize',
                title: 'Make it feel like you',
                content: <p>Adjust a token, add a class, or change the source.</p>,
              },
              {
                id: 'ship',
                title: 'Build with confidence',
                content: <p>Use the documented tests and supported framework paths.</p>,
              },
            ]}
          />
        </CardContent>
      </Card>
      <Card className="landing-card landing-source-card">
        <CardHeader>
          <Badge tone="neutral">Source ownership</Badge>
          <CardTitle>A small change. A different feel.</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            label="Your design language"
            language="css"
            code={
              '/* Ordinary CSS. Every detail yours. */\n[data-devvy-theme="light"] {\n  --dvy-brand: #282724;\n  --dvy-radius-md: 0.5rem;\n  --dvy-font: "Your font", sans-serif;\n}\n\n/* Glass is an optional import. */\n/* Your components keep their behavior. */'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
