# Accessibility

Implementation patterns follow native HTML and the
[WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
[React useId](https://react.dev/reference/react/useId) supplies deterministic hydration IDs.
Original implementation code lives here; no third-party component source was copied.

Button retains its name when loading and disables repeat activation. Inputs and textareas
accept native invalid, required and description attributes. Always provide a visible Label.
Checkbox uses a native input with optional mixed state; Switch adds the switch role to a
native checkbox. Both retain form reset and submission. A disabled component must have
nearby explanation if the user needs to know why it is unavailable.

Tabs has one keyboard entry, linked panels, automatic/manual activation, Home/End, wrapping,
disabled-item skipping, vertical orientation and explicit RTL navigation. Supply unique
values and meaningful labels. Panels remain mounted and hidden, retaining local state.
Avoid tabs for navigation and avoid expensive work in inactive panels.

The automated suite covers semantics with axe and real-browser contrast with styles loaded.
These tests do not prove full WCAG conformance. Manual release procedure:

1. Tab and Shift+Tab through every example. Focus is visible and follows reading order.
2. Activate buttons, checkbox and switch with Space; buttons and tabs also support Enter.
3. Check both tab activation modes, disabled tabs, Home/End, vertical keys and explicit RTL.
4. With NVDA + Firefox/Chrome and VoiceOver + Safari, check names, roles, selection and errors.
5. Increase zoom to 200% and 400%, test 320px reflow, long text and translated labels.
6. Test system forced colors, high contrast, reduced motion and scoped light/dark themes.
7. Check custom palette text contrast (4.5:1 normal text) and control/focus contrast (3:1).

CardTitle defaults to h3; provide an appropriate h2 section, or compose your own heading.
Decorative separators are hidden from assistive technology by default. Neither badge color
nor a spinner should be the only way to understand status. Do not remove native focus styles.

Select uses the native [select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select),
including option groups, multiple selection and form validation/reset. Its numeric size is
the native visible-option count; controlSize only changes appearance. Provide a visible label
and connect validation messages with aria-describedby.

Alert defaults to role="status" for polite updates. Choose role="alert" only for urgent
changes, or role="note" for static guidance; do not rely on initial live-region content being
announced. Its icon is decorative. Keep actions in message content and manage dismissal focus
in the caller. Progress uses native [progress semantics](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress)
and needs an accessible label. Omitted/nonfinite value is indeterminate. Provide visible task
context and announce milestones separately when appropriate.

Skeleton is aria-hidden and has no interaction or children API. Put aria-busy on the content
region, with one readable loading status outside it. Reduced motion and forced colors disable
the opacity pulse. Match the expected content dimensions to reduce layout movement.

## Completion component contracts

Popover is nonmodal: Escape returns to its trigger; outside interaction dismisses it.
Menus skip disabled actions and support arrows, Home/End and typeahead. HoverCard supports
explicit keyboard/click activation. Tooltip content must remain noninteractive. Modal
compositions reuse native Dialog and its explicit inline fallback.

Calendar requires an explicit initial month and uses ISO civil dates with UTC formatting.
PageUp/PageDown move months (Shift moves years); arrows move days/weeks. Native date/time
input appearance depends on the browser. ResizablePanels follows the
[ARIA window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).
SortableList and KanbanBoard retain button/select alternatives to dragging. VirtualList
offers Show all items and retains focused rows. MentionsInput remains a native multiline
textbox with suggestions, avoiding an unsupported combobox role on textarea.

Provide captions and readable transcripts for media. RichTextEditor is a Markdown source
textarea with safe preview, not a full WYSIWYG editor. Review new patterns with actual
assistive technology; automated results are not certification.
