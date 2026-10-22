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

The Select/Alert/Progress/Skeleton batch retains the existing JavaScript limits, including
the 5,500-byte gzip all-components limit. Its 21-component stylesheet is measured separately
from the unchanged 17-component CSS slice and the added feedback/control CSS. The old slice
keeps its 3,600-byte limit; the new slice has a 1,250-byte limit. The combined 21-component
stylesheet limit is 3,900 bytes to account for the additions (measured 3,656 bytes, versus
3,078 for the existing slice). Compression shares dictionaries, so slice sizes do not add.
See the batch verification record for exact fixtures, environment and remaining manual gates.

The 50-component milestone adds 29 implementations. It freezes the previous public surface
in `benchmarks/first21.js` and the previous CSS slice, retaining their 5,500/3,900-byte
ceilings along with older focused-import and stylesheet limits. The expanded namespace has
a 10,500-byte gzip ceiling and the expanded CSS a 6,200-byte ceiling; the added CSS slice
has its own 2,900-byte limit. These account for additional features, not a claimed reduction.

The [Windows Node 24 midpoint snapshot](../benchmarks/midpoint-win32-node24.json) measures
9,521 bytes for all 50 JavaScript entries, 5,540 bytes for component CSS, 5,261 bytes for the
frozen 21-component JavaScript fixture and the unchanged 3,656 bytes for its CSS. The new
CSS slice measures 2,596 bytes; new focused imports range from 207 to 833 gzip bytes,
including composed dependencies. No new dependency was added. Full CSS is shared, so a
focused JavaScript import does not imply its own isolated CSS bundle. Timing samples were
collected during development workloads and support no comparative performance claim.

## 100-component release

benchmarks/first50.js freezes the previous runtime surface. Its 10,500-byte JavaScript and
6,200-byte CSS ceilings remain unchanged, alongside every older focused-import budget.
The full inventory is measured separately: the initial sample measured 26,252 gzip bytes
for JavaScript and 8,399 for component CSS, versus 9,510 and 5,540 for the frozen first 50
in the same run. New focused imports include composed dependencies. New ceilings account
for added features; they do not mask regressions in the previous surface. No new runtime
dependency was added. Concurrent development timings are not idle-hardware baselines.

The final [100-component snapshot](../benchmarks/complete-win32-node24.json) records
27,684 gzip JavaScript bytes for the full namespace and 8,641 for shared CSS. The original
first-21 and first-50 ceilings still pass. The refined Chart is 1,649 bytes; optional
ChartInspector is 2,168. See [verification](verification-100.md) for feature cost and the
new-entry budget calibration, including viewport tooltips and keyboard-pinned hover cards.
