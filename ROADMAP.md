# DEVVY UI roadmap

The **0.3.0 source release** retains the full [100-component inventory](docs/roadmap-100.md)
and improves the documentation experience, customization and optional developer tooling.
npm's latest published version remains 0.2.0.
Each primary name has typed canonical source, focused package exports, source installation
and an interactive docs preview. See [verification](docs/verification-100.md) for actual results.

## Delivered

- Original core, token, CSS and React package boundaries; optional DEVVY GLASS.
- 100 primary components across forms, overlays, navigation, data, media and application UI.
- Source ownership, conflict-safe CLI installation and dependency/helper registry closure.
- Light/dark themes, responsive docs, sandboxed code customization and AI contributor guidance.
- Interactive landing workspace with table filtering, project creation, menus and a board.
- Fixed six-package 0.2.0 version preparation and an explicit latest release workflow.

## Release gates

- Run and review the complete CI matrix for this candidate; keep local and public CI evidence separate.
- Complete manual NVDA/VoiceOver, touch, zoom, forced-colors and target-device checks.
- Review npm scope, package provenance, license/brand rights and release contacts.
- Use maintainer-approved publishing on main; confirm all six npm versions and latest tags.
- Verify production docs separately from a local build and preview.

## Next work

- Optional AI interface compositions: conversation, prompt composer, tool activity, sources
  and explicit tool approval. See [AI interface direction](docs/ai-interfaces.md).
- Additional framework adapters only after working implementations and consumer validation.
- Richer content parsing, variable-height virtualization or scheduling features only as
  deliberate API extensions; the current documented contracts remain narrow.
- Measure real applications on representative hardware before making performance rankings.
