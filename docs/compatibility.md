# Compatibility matrix

Framework, tooling and browser compatibility are separate promises.

| Target                                            | Scope                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| React 18.3.1                                      | Isolated installed-tarball SSR/hydration and keyboard smoke fixture; CI matrix         |
| React 19.3.1                                      | Main test suite, Vite app, Next docs and isolated package consumer                     |
| React 18.2+ / 19.x                                | Declared peer range; exact tested versions above, not every minor                      |
| Next.js 16.4.2 App Router                         | Working docs app, production build and browser integration                             |
| Vite 8.3.5                                        | Working standalone React example and production build                                  |
| TypeScript 5.9.3                                  | Strict declaration and application checks                                              |
| JavaScript ESM                                    | Node installed-package fixtures; types optional                                        |
| Node 22.12+                                       | Build tools and CLI; CI configured for 22 and 24                                       |
| React 16/17                                       | Not supported; useId requires React 18. A future adapter needs an explicit ID strategy |
| Vue/Nuxt, Svelte/SvelteKit, Astro, Web Components | No adapter or framework support claim                                                  |
| Vanilla HTML                                      | Native controls with shared CSS; no interactive adapter shipped                        |

Browser CSS targets modern evergreen engines: custom properties, logical properties,
color-scheme, focus-visible and appearance. Docs also use color-mix and dynamic viewport
units. Older browsers require separate validation and are not promised by framework support.
Chromium, WebKit and Firefox have Playwright projects; see verification.md for which
actually ran locally. Keyboard and screen-reader checks remain a separate manual gate.

React package entry points are ESM and have client boundaries. Do not import event handlers
from server-only components. Global CSS belongs in the application root. Multiple React
copies can cause hook errors; use matching react/react-dom versions in your application.

DEVVY GLASS is optional CSS with an opaque fallback when backdrop filtering is unavailable.
The React scope conservatively reduces effects for available low-resource hints. CSS adapts
to reduced motion/transparency, higher contrast and forced colors. Native modal Dialog
requires showModal; unsupported browsers receive a named nonmodal inline panel. Use
returnFocusRef for reliable return to pointer-activated buttons in Safari. See glass.md
for the full fallback policy. React version support does not imply support for older browsers.
