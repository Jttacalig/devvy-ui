'use client';
import * as UI from '@devvy-ui/react';
import { useId, useRef, useState, type ReactNode } from 'react';
import type { CompletionName } from '../lib/completion-catalog';

export const studioImages = [
  {
    id: 'orbit',
    src: '/examples/orbit.svg',
    alt: 'Orbit geometric study',
    caption: '01 / Orbit study',
  },
  {
    id: 'field',
    src: '/examples/field.svg',
    alt: 'Field notes geometric study',
    caption: '02 / Field notes',
  },
  {
    id: 'studio',
    src: '/examples/studio.svg',
    alt: 'Studio spaces geometric study',
    caption: '03 / Studio spaces',
  },
] as const;
const choices = [
  { value: 'react', label: 'React' },
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'future', label: 'Future adapter', disabled: true },
];
const projects = [
  { id: 'orbit', name: 'Orbit workspace', members: 12 },
  { id: 'field', name: 'Field notes', members: 4 },
  { id: 'studio', name: 'Dev Station studio', members: 8 },
  { id: 'atlas', name: 'Atlas design', members: 2 },
];
export function CompletionPreview({ name }: { name: CompletionName }) {
  const [open, setOpen] = useState(false),
    [selected, setSelected] = useState(''),
    [values, setValues] = useState<readonly string[]>([]),
    [text, setText] = useState(''),
    [range, setRange] = useState<readonly [number, number]>([20, 80]),
    [dateRange, setDateRange] = useState<readonly [string, string]>(['', '']),
    [month, setMonth] = useState('2026-10'),
    [message, setMessage] = useState(''),
    [step, setStep] = useState(0),
    [count, setCount] = useState(3),
    [failure, setFailure] = useState(false),
    [order, setOrder] = useState([
      { id: 'design', label: 'Design the interface' },
      { id: 'build', label: 'Build the components' },
      { id: 'review', label: 'Review and ship' },
    ]),
    [cards, setCards] = useState([
      { id: 'a', title: 'Review components', columnId: 'planned' },
      { id: 'b', title: 'Publish release notes', columnId: 'planned' },
      { id: 'c', title: 'Design tokens', columnId: 'done' },
    ]);
  const invoker = useRef<HTMLButtonElement>(null),
    id = useId();
  const actions = [
    {
      id: 'save',
      label: 'Save project',
      shortcut: '⌘S',
      onSelect: () => setMessage('Project saved.'),
    },
    {
      id: 'duplicate',
      label: 'Duplicate project',
      onSelect: () => setMessage('Project duplicated.'),
    },
    {
      id: 'archive',
      label: 'Archive project',
      disabled: true,
      onSelect: () => setMessage('Archived.'),
    },
  ];
  const launch = (label: string) => (
    <UI.Button ref={invoker} onClick={() => setOpen(true)}>
      {label}
    </UI.Button>
  );
  let preview: ReactNode;
  switch (name) {
    case 'tooltip':
      preview = (
        <UI.Tooltip content="Your changes stay in this workspace.">About autosave</UI.Tooltip>
      );
      break;
    case 'popover':
      preview = (
        <UI.Popover label="Project settings">
          <UI.FormField label="Project name">
            {(field) => <UI.Input {...field} defaultValue="Orbit workspace" />}
          </UI.FormField>
          <p>Changes belong to this project.</p>
        </UI.Popover>
      );
      break;
    case 'dropdown-menu':
      preview = <UI.DropdownMenu label="Project actions" items={actions} />;
      break;
    case 'combobox':
      preview = (
        <UI.Combobox
          label="Framework"
          name="framework"
          options={choices}
          value={selected}
          onValueChange={setSelected}
          placeholder="Choose a framework"
        />
      );
      break;
    case 'autocomplete':
      preview = (
        <UI.Autocomplete
          label="Framework suggestion"
          options={choices}
          value={selected}
          onValueChange={setSelected}
          placeholder="Choose or write your own"
        />
      );
      break;
    case 'multi-select':
      preview = (
        <UI.MultiSelect
          label="Project tools"
          name="tools"
          options={choices}
          value={values}
          onValueChange={setValues}
        />
      );
      break;
    case 'range-slider':
      preview = (
        <UI.RangeSlider label="Budget range" name="budget" value={range} onValueChange={setRange} />
      );
      break;
    case 'otp-input':
      preview = (
        <UI.Form
          onSubmit={(event) => {
            event.preventDefault();
            setMessage('Code entered: ' + new FormData(event.currentTarget).get('code'));
          }}
        >
          <UI.OTPInput
            label="Verification code"
            name="code"
            length={6}
            required
            onComplete={(code) => setMessage('Code ready: ' + code)}
          />
          <UI.Button type="submit">Check code</UI.Button>
          <UI.Button type="reset" variant="outline">
            Reset code
          </UI.Button>
        </UI.Form>
      );
      break;
    case 'rating':
      preview = (
        <UI.Rating
          label="Your experience"
          name="rating"
          value={step || undefined}
          onValueChange={setStep}
        />
      );
      break;
    case 'tag-input':
      preview = (
        <UI.TagInput
          label="Project tags"
          name="tags"
          value={values}
          onValueChange={setValues}
          placeholder="Write a tag and press Enter"
        />
      );
      break;
    case 'toggle-group':
      preview = (
        <UI.ToggleGroup
          label="Text formatting"
          multiple
          value={values}
          onValueChange={setValues}
          items={[
            { value: 'bold', label: 'Bold' },
            { value: 'italic', label: 'Italic' },
            { value: 'underline', label: 'Underline' },
          ]}
        />
      );
      break;
    case 'file-upload':
      preview = (
        <UI.Form onReset={() => setMessage('File selection reset.')}>
          <UI.FileUpload
            label="Project files"
            name="files"
            accept=".txt,image/*"
            maxSize={4096}
            multiple
            onFilesChange={(files) => setMessage(files.length + ' files selected.')}
          />
          <UI.Button type="reset" variant="outline">
            Reset files
          </UI.Button>
        </UI.Form>
      );
      break;
    case 'dropzone':
      preview = (
        <UI.Dropzone
          label="Project assets"
          name="assets"
          accept=".txt,image/*"
          maxSize={4096}
          multiple
          onFilesChange={(files) => setMessage(files.length + ' assets selected.')}
        />
      );
      break;
    case 'calendar':
      preview = (
        <UI.Calendar
          label="Release date"
          month={month}
          onMonthChange={setMonth}
          value={selected}
          onValueChange={setSelected}
          min="2026-01-01"
          max="2027-12-31"
        />
      );
      break;
    case 'date-picker':
      preview = (
        <UI.FormField label="Start date" required>
          {(field) => (
            <UI.DatePicker
              {...field}
              label="Start date"
              name="start"
              min="2026-01-01"
              defaultValue="2026-10-23"
            />
          )}
        </UI.FormField>
      );
      break;
    case 'date-range-picker':
      preview = (
        <UI.Form
          onSubmit={(event) => {
            event.preventDefault();
            setMessage('Travel dates saved.');
          }}
          onReset={() => setDateRange(['', ''])}
        >
          <UI.DateRangePicker
            label="Travel dates"
            name="travel"
            value={dateRange}
            onValueChange={setDateRange}
            required
          />
          <UI.Button type="submit">Save dates</UI.Button>
          <UI.Button type="reset" variant="outline">
            Reset dates
          </UI.Button>
        </UI.Form>
      );
      break;
    case 'time-picker':
      preview = (
        <UI.FormField label="Reminder time">
          {(field) => (
            <UI.TimePicker {...field} label="Reminder time" name="time" defaultValue="09:30" />
          )}
        </UI.FormField>
      );
      break;
    case 'stepper':
      preview = (
        <UI.Stepper
          label="Workspace setup"
          current={step}
          onStepChange={setStep}
          steps={[
            { id: 'project', label: 'Project', description: 'Name your workspace' },
            { id: 'team', label: 'Team', description: 'Invite collaborators' },
            { id: 'review', label: 'Review', description: 'Check the details' },
          ]}
        />
      );
      break;
    case 'menubar':
      preview = (
        <UI.Menubar
          label="Editor actions"
          menus={[
            { id: 'file', label: 'File', items: actions },
            {
              id: 'edit',
              label: 'Edit',
              items: [
                {
                  id: 'undo',
                  label: 'Undo changes',
                  onSelect: () => setMessage('Changes undone.'),
                },
              ],
            },
          ]}
        />
      );
      break;
    case 'context-menu':
      preview = (
        <UI.ContextMenu label="Card actions" items={actions}>
          <p>Orbit workspace · Right click or use the actions button.</p>
        </UI.ContextMenu>
      );
      break;
    case 'navigation-menu':
      preview = (
        <UI.NavigationMenu
          label="Resources"
          items={[
            { label: 'Components', href: '/ui/components' },
            {
              label: 'Learn',
              children: [
                { label: 'Getting started', href: '/ui/getting-started' },
                { label: 'Themes and tokens', href: '/ui/themes' },
              ],
            },
          ]}
        />
      );
      break;
    case 'command-palette':
      preview = (
        <>
          {launch('Open quick actions')}
          <UI.CommandPalette
            title="Quick actions"
            open={open}
            onOpenChange={setOpen}
            returnFocusRef={invoker}
            items={actions.map((action) => ({ ...action, description: 'Workspace command' }))}
          />
        </>
      );
      break;
    case 'tree-view':
      preview = (
        <UI.TreeView
          label="Project files"
          value={selected}
          onValueChange={setSelected}
          defaultExpanded={['src']}
          items={[
            {
              id: 'src',
              label: 'Source',
              children: [
                { id: 'app', label: 'App.tsx' },
                { id: 'styles', label: 'Styles', children: [{ id: 'theme', label: 'theme.css' }] },
              ],
            },
            { id: 'readme', label: 'README.md' },
            { id: 'locked', label: 'Private config', disabled: true },
          ]}
        />
      );
      break;
    case 'scroll-area':
      preview = (
        <UI.ScrollArea label="Activity history" style={{ maxHeight: 180 }}>
          <UI.Timeline
            label="Activity events"
            items={Array.from({ length: 12 }, (_, i) => ({
              id: String(i),
              title: 'Project update ' + (i + 1),
              dateTime: '2026-10-23',
              content: <span>A small improvement to your workspace.</span>,
            }))}
          />
        </UI.ScrollArea>
      );
      break;
    case 'resizable-panels':
      preview = (
        <UI.ResizablePanels label="Resize workspace panels">
          {[
            <div key="files">
              <strong>Files</strong>
              <p>
                README.md
                <br />
                theme.css
                <br />
                App.tsx
              </p>
            </div>,
            <div key="editor">
              <strong>Editor</strong>
              <p>Focus the divider and use the arrow keys.</p>
            </div>,
          ]}
        </UI.ResizablePanels>
      );
      break;
    case 'table-of-contents':
      preview = (
        <>
          <UI.TableOfContents
            items={[
              { id: id + '-overview', label: 'Overview' },
              { id: id + '-usage', label: 'Usage' },
            ]}
          />
          <section id={id + '-overview'}>
            <h3>Overview</h3>
            <p>Native links make navigation predictable.</p>
          </section>
          <section id={id + '-usage'}>
            <h3>Usage</h3>
            <p>Keep section ids stable across renders.</p>
          </section>
        </>
      );
      break;
    case 'hover-card':
      preview = (
        <UI.HoverCard label="About Dev Station">
          <UI.Avatar name="Dev Station" />
          <h3>Dev Station</h3>
          <p>Independent tools for thoughtful builders.</p>
          <a href="https://www.dev-station.dev">Visit Dev Station</a>
        </UI.HoverCard>
      );
      break;
    case 'toast':
      preview = (
        <>
          <UI.Button onClick={() => setOpen(true)}>Save project</UI.Button>
          <UI.Toast
            open={open}
            onOpenChange={setOpen}
            message="Project saved successfully."
            duration={5000}
          />
        </>
      );
      break;
    case 'alert-dialog':
      preview = (
        <>
          {launch('Archive project')}
          <UI.AlertDialog
            title="Archive this project?"
            description="You can restore it from your workspace archive."
            open={open}
            onOpenChange={setOpen}
            returnFocusRef={invoker}
            confirmLabel="Archive project"
            onConfirm={() => {
              setMessage('Project archived.');
              setOpen(false);
            }}
          />
        </>
      );
      break;
    case 'drawer':
      preview = (
        <>
          {launch('Open workspace details')}
          <UI.Drawer
            title="Workspace details"
            description="Project information and settings."
            open={open}
            onOpenChange={setOpen}
            returnFocusRef={invoker}
          >
            <UI.DescriptionList
              items={[
                { term: 'Workspace', description: 'Orbit' },
                { term: 'Plan', description: 'Team' },
              ]}
            />
            <UI.Button onClick={() => setOpen(false)}>Done</UI.Button>
          </UI.Drawer>
        </>
      );
      break;
    case 'floating-action-button':
      preview = (
        <UI.FloatingActionButton
          label="Create project"
          onClick={() => setMessage('New project created.')}
        >
          +
        </UI.FloatingActionButton>
      );
      break;
    case 'onboarding-tour':
      preview = (
        <>
          <div id={id + '-target'}>
            <UI.Stat label="Your workspace" value="Orbit" description="Ready for your next idea" />
          </div>
          {launch('Start workspace tour')}
          <UI.OnboardingTour
            open={open}
            onOpenChange={setOpen}
            returnFocusRef={invoker}
            steps={[
              {
                id: 'welcome',
                title: 'Welcome to your workspace',
                description: 'This is where your projects live.',
                targetId: id + '-target',
              },
              {
                id: 'next',
                title: 'Make it your own',
                description: 'Customize tokens or edit the source.',
              },
            ]}
            onComplete={() => setMessage('Workspace tour completed.')}
          />
        </>
      );
      break;
    case 'loading-overlay':
      preview = (
        <>
          <UI.LoadingOverlay loading={open} label="Refreshing projects">
            <UI.Card>
              <UI.CardContent>
                <p>Orbit workspace · Last updated just now.</p>
              </UI.CardContent>
            </UI.Card>
          </UI.LoadingOverlay>
          <UI.Button onClick={() => setOpen(!open)}>
            {open ? 'Finish refresh' : 'Refresh projects'}
          </UI.Button>
        </>
      );
      break;
    case 'data-table':
      preview = (
        <UI.DataTable
          rowSelection={{ getRowLabel: (row) => row.name }}
          label="Project directory"
          rows={projects}
          getRowId={(row) => row.id}
          filterText={(row) => row.name}
          pageSize={2}
          columns={[
            {
              key: 'name',
              label: 'Project',
              render: (row) => row.name,
              sortValue: (row) => row.name,
            },
            {
              key: 'members',
              label: 'Members',
              render: (row) => row.members,
              sortValue: (row) => row.members,
            },
          ]}
        />
      );
      break;
    case 'timeline':
      preview = (
        <UI.Timeline
          label="Release history"
          items={[
            {
              id: 'design',
              title: 'Design complete',
              dateTime: '2026-10-21',
              content: <p>Tokens and component contracts reviewed.</p>,
            },
            {
              id: 'build',
              title: 'Ready to build',
              dateTime: '2026-10-23',
              content: <p>Reusable pieces, ordinary CSS.</p>,
            },
          ]}
        />
      );
      break;
    case 'stat':
      preview = (
        <UI.Stat
          label="Components in this checkout"
          value="100"
          change="50 new additions"
          description="Independent React building blocks"
        />
      );
      break;
    case 'code-block':
      preview = (
        <UI.CodeBlock
          label="Theme customization"
          language="css"
          lineNumbers
          code={':root {\n  --dvy-brand: #282724;\n  --dvy-radius-md: 0.5rem;\n}'}
        />
      );
      break;
    case 'carousel':
      preview = (
        <UI.Carousel
          label="Design studies"
          slides={studioImages.map((image) => (
            <figure key={image.id}>
              <img src={image.src} alt={image.alt} />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        />
      );
      break;
    case 'gallery':
      preview = <UI.Gallery label="Design studies" images={studioImages} />;
      break;
    case 'image-cropper':
      preview = (
        <UI.ImageCropper
          src="/examples/orbit.svg"
          alt="Orbit geometric study"
          onCrop={(blob) => setMessage('PNG crop ready: ' + blob.size + ' bytes.')}
        />
      );
      break;
    case 'video-player':
      preview = (
        <UI.VideoPlayer
          label="Studio shape study"
          sources={[
            { src: '/examples/studio.mp4', type: 'video/mp4' },
            { src: '/examples/studio.webm', type: 'video/webm' },
          ]}
          poster="/examples/studio.svg"
          tracks={[{ src: '/examples/studio.vtt', srcLang: 'en', label: 'English', default: true }]}
          transcript={
            <p>
              Transcript: A quiet study in shape and motion. This two-second clip has no speech.
            </p>
          }
        />
      );
      break;
    case 'audio-player':
      preview = (
        <UI.AudioPlayer
          label="Studio reference tone"
          src="/examples/studio.wav"
          transcript={<p>Transcript: A short, quiet reference tone fades in and out. No speech.</p>}
        />
      );
      break;
    case 'markdown-viewer':
      preview = (
        <UI.MarkdownViewer
          source={
            '## Release notes\n\n**Thoughtful defaults**, _ordinary CSS_.\n\n- Native controls\n- Source ownership\n\n[Read the guide](/ui/getting-started)\n\n```css\n--dvy-brand: #282724;\n```'
          }
        />
      );
      break;
    case 'rich-text-editor':
      preview = (
        <UI.RichTextEditor
          label="Release notes"
          name="notes"
          defaultValue={'## Ready to build\n\nMake **every detail** your own.'}
        />
      );
      break;
    case 'lightbox':
      preview = (
        <>
          {launch('Inspect design studies')}
          <UI.Lightbox
            open={open}
            onOpenChange={setOpen}
            returnFocusRef={invoker}
            images={studioImages}
          />
        </>
      );
      break;
    case 'virtual-list':
      preview = (
        <UI.VirtualList
          label="Project records"
          items={Array.from({ length: 500 }, (_, i) => ({
            id: String(i),
            name: 'Project record ' + (i + 1),
          }))}
          getKey={(item) => item.id}
          renderItem={(item) => (
            <button type="button" onClick={() => setMessage('Opened ' + item.name)}>
              {item.name}
            </button>
          )}
          height={240}
        />
      );
      break;
    case 'infinite-scroll':
      preview = (
        <>
          <label htmlFor={id + '-failure'} className="completion-failure-toggle">
            <UI.Checkbox
              id={id + '-failure'}
              checked={failure}
              onChange={(event) => setFailure(event.target.checked)}
            />
            Simulate loading error
          </label>
          <UI.InfiniteScroll
            label="Workspace activity"
            hasMore={count < 12}
            onLoadMore={async () => {
              if (failure) throw new Error('Preview error');
              await Promise.resolve();
              setCount((value) => value + 3);
            }}
          >
            <ul>
              {Array.from({ length: count }, (_, i) => (
                <li key={i}>Activity record {i + 1}</li>
              ))}
            </ul>
          </UI.InfiniteScroll>
        </>
      );
      break;
    case 'kanban-board':
      preview = (
        <UI.KanbanBoard
          label="Release board"
          columns={[
            { id: 'planned', label: 'Planned' },
            { id: 'done', label: 'Done' },
          ]}
          items={cards}
          onItemsChange={setCards}
        />
      );
      break;
    case 'sortable-list':
      preview = (
        <UI.SortableList label="Release checklist" items={order} onItemsChange={setOrder} />
      );
      break;
    case 'mentions-input':
      preview = (
        <UI.MentionsInput
          label="Team comment"
          name="comment"
          value={text}
          onValueChange={setText}
          options={[
            { id: 'ada', label: 'Ada Rivera', handle: 'ada' },
            { id: 'bea', label: 'Bea Cruz', handle: 'bea' },
            { id: 'cal', label: 'Cal Lee', handle: 'cal', disabled: true },
          ]}
          placeholder="Write a comment. Type @ to mention someone."
        />
      );
      break;
  }
  return (
    <div className="completion-preview" data-component-preview={name}>
      {preview}
      {(message || selected) && (
        <p role="status" className="completion-result">
          {message || 'Selected: ' + selected}
        </p>
      )}
    </div>
  );
}
