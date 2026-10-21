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
