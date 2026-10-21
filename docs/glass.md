# DEVVY GLASS

DEVVY GLASS is an optional material within DEVVY UI. It adds frosted surfaces, lighting
and restrained motion to existing components. It is not a separate package or a proprietary
Apple implementation. It uses original CSS and ordinary platform APIs, with no new dependency.

## Use the material

```tsx
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import '@devvy-ui/styles/glass.css';
import { Glass, Card, CardContent, Button } from '@devvy-ui/react';

<Glass theme="dark" quality="auto" className="my-material">
  <Card>
    <CardContent>
      <h2>Your workspace</h2>
      <Button>Save</Button>
    </CardContent>
  </Card>
</Glass>;
```

The base style entry does not import glass.css. Consumers pay for the material only when
they opt in. Independent React entries exist at /glass, /dialog and /dock. A Button import
does not pull in capability detection or dialog logic; the benchmark asserts this.

`Glass` is a div with enabled (default true), theme (inherited/light/dark/system),
quality (auto/full/reduced), native attributes and a forwarded ref. Toggle enabled without
losing child form state. Automatic mode SSR-renders opaque and enhances after hydration.
It installs no global event listeners, mouse tracking loop, runtime CSS engine or canvas.

## Customize

Set these on the Glass container's class or inline custom properties:

| Token                   | Default            | Purpose                                                         |
| ----------------------- | ------------------ | --------------------------------------------------------------- |
| --dvy-glass-blur        | 14px               | Bounded background frost; tune rather than animate continuously |
| --dvy-glass-opacity     | .86                | Surface opacity; verify contrast over real backgrounds          |
| --dvy-glass-saturation  | 1.2                | Backdrop color intensity                                        |
| --dvy-glass-light-angle | 135deg             | Static highlight direction                                      |
| --dvy-glass-radius      | 1.25rem            | Material surface corners                                        |
| --dvy-glass-tint        | theme RGB channels | Surface tint, supplied by light/dark tokens                     |
| --dvy-glass-duration    | 180ms              | Hover/entrance feedback; preferences can disable it             |

Brand, typography, size and density continue using existing DEVVY tokens. Solid button
tones retain their semantic colors. Material hover lighting animates an overlay's opacity;
button and dialog feedback use transform/opacity. No blur, large shadow, background mesh,
width or height animation runs continuously. No always-on will-change layers are allocated.
Buttons inside frosted cards/dialogs share the parent's backdrop instead of adding nested blur.

## Fallback policy

- CSS without backdrop-filter support starts with an opaque, readable surface.
- React auto mode reduces effects when backdrop support is missing, save-data is true,
  reported hardware concurrency is at most 4, or reported device memory is at most 4 GB.
  Missing signals are not treated as measured low GPU capability. These hints are read
  on enhancement; CSS media preferences adapt live without JavaScript listeners.
- quality="reduced" removes backdrop filtering and makes surfaces opaque. full is an
  explicit enhancement request, but cannot bypass reduced-transparency, higher-contrast
  or forced-color CSS rules.
- prefers-reduced-motion removes entrance and hover movement. Forced colors restores
  system colors/borders. A reduced-transparency preference disables backdrop filters.
- A CSS-only consumer can wrap markup in data-devvy-material="glass" with
  data-devvy-quality="reduced". Automatic hardware detection requires the React scope
  or another adapter implementing the same DOM-free core policy.

Older framework support is separate from browser feature support. The shared CSS works
with ordinary HTML; React 18 and 19 use one adapter. Vue/Svelte/Web Components integrations
are future work. No claim of a shipped adapter for those frameworks is made.

## Dialog and dock

Dialog is a controlled native dialog: open, onOpenChange and title are required.
Optional description connects supporting text; initialFocusRef selects the initial target;
closeLabel localizes its visible close control. Native showModal provides background inertness,
document focus containment, Escape and focus restoration. Browser chrome remains reachable.
returnFocusRef explicitly identifies the invoker for pointer activation in browsers that
do not focus clicked buttons, including Safari. Set this ref on the opening button.
Cleanup closes a modal when unmounted, including StrictMode's effect cleanup.
SSR markup stays closed until hydration. In browsers without showModal, the content becomes
an explicitly nonmodal inline region with a visible close control. It does not emulate a modal.
Use controlled submit handlers for form actions. Avoid calling dialog.show() manually.

Dock is a native nav with a required label. Use links for destinations and buttons for actions,
aria-current for the current route, and accessible names for icon-only controls. Items keep
ordinary Tab behavior and wrap. floating pins to the viewport safe area; the consumer must
reserve space so no content or keyboard focus is covered. Glass does not require a fixed dock.

## Main-site route and deployment

The independent Next.js docs app implements **/ui/glass** with interactive dark/light,
atmosphere, frost, opacity, lighting and quality previews. The Vite example has an optional
material toggle. The Dev Station production repository and deployment have not been modified.

The material studio has consistent native dropdown controls and a reset action. Open the
linked code playground to go beyond its sliders: edit HTML/CSS, apply a preview and export
the result. Component pages also support editing and downloading their React implementation.
See customization.md for the distinction between live styling and exported React source.

To mount this docs app on www.dev-station.dev, the existing hosting owner must configure
the /ui routes and asset routing together. Do not proxy only /ui while leaving the docs'
/\_next scripts or /devvy-logo.png pointing at an unrelated main application. Use a dedicated
docs asset prefix/origin or merge the reviewed routes/assets into that app, then verify
navigation, CSP, images, cache behavior and direct page loads. Keep the current main
application untouched until that concrete routing configuration has been reviewed.
No DNS, deployment, external service or publication was performed by this implementation.

## Verification

Unit tests cover deterministic SSR, opt-out without remount, capability profiles, native
controls, controlled dismissal, initial focus, StrictMode cleanup and the inline fallback.
Playwright checks the actual material, keyboard/native modal behavior, contrast, mobile
layouts, reduced effects and real computed filtering in Chromium and WebKit. Firefox remains
a CI target; its local engine previously failed to launch on this host. Manual NVDA/VoiceOver,
older-device profiling and deployed main-site validation remain release gates.

Reference patterns: [native dialog technique](https://www.w3.org/WAI/WCAG22/Techniques/html/H102),
[backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter).
These informed platform behavior; they are not sources of copied component implementations.
