# DEVVY UI 0.3.1 verification — 23 October 2026

This patch corrects stale package READMEs and implements automatic stable version display
on the documentation server. All six UI packages and the root are versioned at 0.3.1.
Component implementations, base styles and dependency versions are unchanged.

## Automatic release display

- The server reads only the six fixed public npm dist-tag endpoints. No credentials,
  custom URLs or browser requests to npm are used.
- All six `latest` tags must agree on a strict stable version. Prereleases, malformed or
  oversized responses and partial publications are rejected. Responses are bounded to
  8 KiB per package and requests to 2.5 seconds.
- Validated results use Next.js's server cache for 300 seconds. Request-driven ISR updates
  the landing, shared header/footer, installation label, metadata and structured version
  without rebuilding. A visitor can see the previous value during background refresh.
- Refresh failures retain cached successful data. A cold failure falls back to the
  independently verified npm 0.3.0 baseline, never the unpublished workspace version.
- Source API examples, historical notes and MCP's pinned 0.2.0 registry remain versioned
  independently. A displayed npm version does not upgrade those implementations.

## Candidate verification

- Production build: passed; all 114 pages build with five-minute ISR.
- Typecheck, lint and formatting: passed.
- Complete unit/protocol suite: passed (including 100 React cases and the five new docs
  release checks). Lockfile installation and moderate-level audit passed with no known
  vulnerabilities reported.
- Five automatic-release tests passed: future stable release discovery, incomplete
  publication, malformed/oversized input, offline fallback/recovery and actual timeout.
- Production browser regression verifies consistent header/hero/footer, title and
  structured version, with no browser requests to npm: passed in Chromium, Firefox and
  WebKit (three cases).
- All 100 canonical source/package parity checks passed. Bundle budgets passed; the
  React namespace remains 28,143 gzip bytes, unchanged by the docs-only feature.

Publication and deployment are separate maintainer actions. This candidate record does
not itself claim either has completed. The GitHub Actions run, release and live registry
must be checked before reporting completion.
