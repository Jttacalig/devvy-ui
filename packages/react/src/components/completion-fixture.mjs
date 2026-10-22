export function createCompletionFixture(UI, h) {
  const noop = () => {};
  const actions = [{ id: 'save', label: 'Save', onSelect: noop }];
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vite', label: 'Vite', disabled: true },
  ];
  const images = [{ id: 'orbit', src: '/examples/orbit.svg', alt: 'Orbit study' }];
  const entries = {
    Tooltip: { content: 'Autosave details', children: 'About autosave' },
    Popover: { label: 'Fixture preferences', children: h('p', null, 'Preferences') },
    DropdownMenu: { label: 'Fixture actions', items: actions },
    Combobox: { label: 'Fixture framework', options, name: 'framework' },
    Toast: { open: false, onOpenChange: noop, message: 'Saved' },
    MultiSelect: { label: 'Fixture tools', options, name: 'tools' },
    Autocomplete: { label: 'Fixture suggestion', options },
    RangeSlider: { label: 'Fixture budget', defaultValue: [10, 90], name: 'budget' },
    OTPInput: { label: 'Fixture code', name: 'code' },
    Rating: { label: 'Fixture rating', name: 'rating' },
    TagInput: { label: 'Fixture tags', defaultValue: ['design'], name: 'tags' },
    ToggleGroup: { label: 'Fixture formatting', items: [{ value: 'bold', label: 'Bold' }] },
    FileUpload: { label: 'Fixture files', name: 'files' },
    Dropzone: { label: 'Fixture assets', name: 'assets' },
    Calendar: { label: 'Fixture calendar', month: '2026-10', onMonthChange: noop },
    DatePicker: { label: 'Fixture date', name: 'date' },
    DateRangePicker: { label: 'Fixture date interval', name: 'interval' },
    TimePicker: { label: 'Fixture time', name: 'time' },
    Stepper: { label: 'Fixture setup', current: 0, steps: [{ id: 'one', label: 'Profile' }] },
    Menubar: { label: 'Fixture editor', menus: [{ id: 'file', label: 'File', items: actions }] },
    ContextMenu: { label: 'Fixture card actions', items: actions, children: 'Project card' },
    CommandPalette: { title: 'Fixture commands', open: false, onOpenChange: noop, items: actions },
    NavigationMenu: { label: 'Fixture resources', items: [{ label: 'Guide', href: '/ui/docs' }] },
    TreeView: {
      label: 'Fixture files tree',
      items: [{ id: 'src', label: 'Source', children: [{ id: 'app', label: 'App.tsx' }] }],
    },
    ScrollArea: { label: 'Fixture history', children: h('p', null, 'History') },
    ResizablePanels: {
      label: 'Fixture resize',
      children: [h('p', { key: 'one' }, 'Files'), h('p', { key: 'two' }, 'Editor')],
    },
    TableOfContents: {
      label: 'Fixture contents',
      items: [{ id: 'fixture-section', label: 'Overview' }],
    },
    HoverCard: { label: 'Fixture profile', children: h('p', null, 'Profile details') },
    AlertDialog: {
      title: 'Fixture archive',
      open: false,
      onOpenChange: noop,
      confirmLabel: 'Archive',
      onConfirm: noop,
    },
    Drawer: {
      title: 'Fixture drawer',
      open: false,
      onOpenChange: noop,
      children: 'Workspace details',
    },
    FloatingActionButton: { label: 'Fixture create', children: '+' },
    OnboardingTour: {
      open: false,
      onOpenChange: noop,
      steps: [{ id: 'welcome', title: 'Welcome', description: 'Get started.' }],
    },
    LoadingOverlay: {
      loading: false,
      label: 'Fixture loading',
      children: h('p', null, 'Workspace content'),
    },
    DataTable: {
      label: 'Fixture records',
      rows: [{ id: 'one', name: 'Orbit' }],
      getRowId: (r) => r.id,
      columns: [{ key: 'name', label: 'Name', render: (r) => r.name, sortValue: (r) => r.name }],
    },
    Timeline: {
      label: 'Fixture releases',
      items: [{ id: 'launch', title: 'Launch', dateTime: '2026-10-23' }],
    },
    Stat: { label: 'Fixture components', value: 100 },
    CodeBlock: { label: 'Fixture code', code: 'const project = "Orbit";', copyable: false },
    Carousel: {
      label: 'Fixture slides',
      slides: [h('p', { key: 'one' }, 'Orbit'), h('p', { key: 'two' }, 'Field')],
    },
    Gallery: { label: 'Fixture studies', images },
    ImageCropper: { src: '/examples/orbit.svg', alt: 'Fixture crop source', onCrop: noop },
    VideoPlayer: {
      label: 'Fixture video',
      tracks: [{ src: '/examples/studio.vtt', srcLang: 'en', label: 'English' }],
      transcript: h('p', null, 'A silent shape study.'),
    },
    AudioPlayer: { label: 'Fixture audio', transcript: h('p', null, 'A quiet tone.') },
    MarkdownViewer: {
      source: '## Fixture section\n\n**Plain** _safe_ text and [a guide](/ui/docs).',
    },
    RichTextEditor: {
      label: 'Fixture release notes',
      defaultValue: '## Notes\n\nReady to build.',
      name: 'notes',
    },
    Lightbox: { images, open: false, onOpenChange: noop },
    VirtualList: {
      label: 'Fixture windowed records',
      items: [{ id: 'one', name: 'Orbit' }],
      getKey: (r) => r.id,
      renderItem: (r) => r.name,
    },
    InfiniteScroll: {
      label: 'Fixture activity',
      hasMore: false,
      onLoadMore: noop,
      children: h('p', null, 'Activity'),
    },
    KanbanBoard: {
      label: 'Fixture board',
      columns: [{ id: 'planned', label: 'Planned' }],
      items: [{ id: 'one', title: 'Review', columnId: 'planned' }],
      onItemsChange: noop,
    },
    SortableList: {
      label: 'Fixture order',
      items: [
        { id: 'one', label: 'Design' },
        { id: 'two', label: 'Build' },
      ],
      onItemsChange: noop,
    },
    MentionsInput: {
      label: 'Fixture comment',
      options: [{ id: 'ada', label: 'Ada', handle: 'ada' }],
      name: 'comment',
    },
  };
  return h(
    'section',
    { 'aria-label': 'Completion component fixtures' },
    Object.entries(entries).map(([name, props]) =>
      h('div', { key: name, 'data-fixture': name }, h(UI[name], props)),
    ),
  );
}
