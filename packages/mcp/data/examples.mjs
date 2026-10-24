// Canonical MCP compositions. Tests compile each version against its registry source.
// These examples are original DEVVY UI MIT code, not upstream framework templates.
const settings = `'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@devvy-ui/react/card';
import { Label } from '@devvy-ui/react/label';
import { Input } from '@devvy-ui/react/input';
import { Switch } from '@devvy-ui/react/switch';
import { Button } from '@devvy-ui/react/button';
import { Alert } from '@devvy-ui/react/alert';

export default function WorkspaceSettings() {
  const [saved, setSaved] = useState(false);
  return <Card>
    <CardHeader><CardTitle>Workspace settings</CardTitle></CardHeader>
    <CardContent>
      <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
        <Label htmlFor="workspace-name">Workspace name</Label>
        <Input id="workspace-name" name="workspaceName" required defaultValue="Orbit" />
        <label htmlFor="weekly-updates"><Switch id="weekly-updates" name="updates" defaultChecked /> Weekly updates</label>
        <Button type="submit">Save preferences</Button>
      </form>
      {saved && <Alert>Preferences saved in this demo. Connect your application persistence.</Alert>}
    </CardContent>
  </Card>;
}
`;

const dashboard = (withSelection) => `'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@devvy-ui/react/card';
import { DataTable } from '@devvy-ui/react/data-table';
import { Badge } from '@devvy-ui/react/badge';
import { Progress } from '@devvy-ui/react/progress';
${withSelection ? "import { Button } from '@devvy-ui/react/button';\n" : ''}
const rows = [{ id: 'orbit', name: 'Orbit workspace', state: 'In progress' }, { id: 'atlas', name: 'Atlas website', state: 'Ready' }];
export default function ProjectDashboard() {
  return <Card>
    <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
    <CardContent>
      <Progress label="Weekly capacity" value={68} />
      <DataTable label="Workspace projects" rows={rows} getRowId={(row) => row.id}
        filterText={(row) => row.name} pageSize={5}
        columns={[
          { key: 'name', label: 'Project', render: (row) => row.name, sortValue: (row) => row.name },
          { key: 'state', label: 'Status', render: (row) => <Badge>{row.state}</Badge> },
        ]}${
          withSelection
            ? `
        rowSelection={{ getRowLabel: (row) => row.name,
          renderActions: (selected, clear) => <Button onClick={clear}>Clear {selected.length} selected</Button>
        }}`
            : ''
        }
      />
    </CardContent>
  </Card>;
}
`;

const glass = `'use client';
import { useState } from 'react';
import { Glass } from '@devvy-ui/react/glass';
import { Card, CardContent, CardHeader, CardTitle } from '@devvy-ui/react/card';
import { Button } from '@devvy-ui/react/button';

export default function GlassWorkspace() {
  const [created, setCreated] = useState(false);
  return <Glass quality="auto" theme="light" style={{ padding: '2rem', background: 'linear-gradient(120deg, #bfe4d4, #dbe6f4)' }}>
    <Card>
      <CardHeader><CardTitle>Your next workspace</CardTitle></CardHeader>
      <CardContent><p>Adaptive material with an opaque fallback.</p><Button onClick={() => setCreated(true)}>Create workspace</Button>{created && <p role="status">Workspace created in this demo. Connect your own persistence.</p>}</CardContent>
    </Card>
  </Glass>;
}
`;

export const recipeDefinitions = [
  {
    id: 'settings-form',
    title: 'Workspace settings',
    description: 'Native labeled form, optional updates and save feedback.',
    primary: 'input',
    accessibility: [
      'Use unique form IDs when rendering multiple instances.',
      'Keep native validation and connect real persistence in your application.',
    ],
    makeCode: () => settings,
  },
  {
    id: 'project-dashboard',
    title: 'Project dashboard',
    description: 'Sortable, filterable and paginated project data with optional row selection.',
    primary: 'data-table',
    accessibility: [
      'Supply a meaningful table label and text status.',
      'Supply a distinct accessible row label; select-all affects eligible rows on the current page.',
    ],
    makeCode: () => dashboard(true),
  },
  {
    id: 'glass-workspace',
    title: 'Adaptive Glass workspace',
    description: 'An optional material scope over a real card and action.',
    primary: 'glass',
    accessibility: [
      'Keep automatic quality and reduced-effects fallbacks.',
      'Maintain contrast over your own background and preserve reduced-motion preferences.',
    ],
    makeCode: () => glass,
  },
];

export function examplesFor(version) {
  return recipeDefinitions.map(({ makeCode, ...entry }) => ({
    ...entry,
    code: makeCode(version),
    origin:
      'Original DEVVY MCP composition, type-checked against this version’s canonical registry source.',
    license: 'MIT',
  }));
}
