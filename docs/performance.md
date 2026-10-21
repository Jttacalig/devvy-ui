# Reproducible measurements

Run `pnpm build && pnpm bench`. The harness writes raw JSON to benchmarks/results.json
and fails if Button, Tabs, Glass, Dialog, Dock, the component barrel or a CSS entry exceeds
the checked-in gzip budget. It also checks that Button excludes optional material/dialog logic.
React is external to all bundle cases, so these are incremental library bytes, not total app size.
CSS and tokens are reported separately. esbuild minifies for browser ESM/es2020; Node zlib
uses its default gzip/Brotli settings. Every result records the exact Node, platform and React.

The comparator is development-only @radix-ui/react-tabs 1.2.1. The two-tab SSR fixtures
have labels, tab lists and mounted panels. DEVVY has a compact items API; Radix exposes
more composition and behavior. Bundle and SSR numbers do not establish equivalent product
capabilities, WCAG conformance or interaction speed. Never turn these into a blanket
"faster than" claim. CSS is not included in the comparator bundle number.

SSR uses production React, 100 warmups and five batches of 1,000 renders; the median and
samples are recorded. Run timings on idle, fixed hardware without concurrent test workloads
before publishing comparisons. Node heap differences are too noisy for a meaningful per-component
memory claim at this scale and are deliberately not reported.

Browser interaction latency, hydration timings, style recalculation and memory profiles need
controlled, repeatable browser experiments before performance claims. Functional browser tests
verify hydration and interaction correctness, not a timing score. See verification.md for actual
local runs. Budget ceilings are regression limits, not advertised sizes.
