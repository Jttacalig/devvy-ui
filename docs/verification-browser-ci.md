# Browser CI repair — 23 October 2026

The failed main revision was `c49da209a81aa57689beccfa7fec299636d8f8ae`.
The two failing runs were [CI](https://github.com/Jttacalig/devvy-ui/actions/runs/39911889196)
and [npm publishing](https://github.com/Jttacalig/devvy-ui/actions/runs/39911984768).
The browser suites took about 32 minutes each; publication stopped before the npm step.

## Causes and changes

- The DataTable browser assertion selected the first table header after the demo added a
  checkbox column. It now finds the named Project column and checks the actual sorted rows.
- WebKit observed independently animated theme colors with inadequate intermediate contrast
  on buttons and sidebar links. Documentation now changes those palette colors together,
  retaining opacity/transform feedback. Accessibility checks and iframe isolation are intact.
- All three engines previously ran sequentially in one job, retrying failures twice. CI now
  runs each engine across two parallel shards, retains one retry and bounds each shard to
  twelve minutes of Playwright execution / fifteen minutes for the job. Coverage is unchanged
  apart from a new immediate theme-palette regression test.
- Blob reports from each shard are merged into one HTML report. Publishing checks successful
  CI for the exact main SHA and no longer duplicates the complete browser suite.

## Verification

The corrected production build, typecheck and lint pass locally. All six targeted checks
(table sorting and immediate theme colors in Chromium, Firefox and WebKit) pass without
retries in 21 seconds. Formatting and shard coverage are checked before pushing.

Linux browser results are available on the fix pull request's CI checks. Local Windows
checks cannot substitute for the Linux WebKit result that originally failed; all six shards
and the merged report must pass before merging. No npm workflow is dispatched by this fix.
