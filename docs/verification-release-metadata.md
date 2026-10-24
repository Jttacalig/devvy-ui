# Current release and discovery metadata — 24 October 2026

The live npm registry verified `@devvy-ui/registry@0.3.1` as the stable source, with
integrity `sha512-ETYuq3RftyClEzcO3ccbx9zFM4xJ33xYqVszIaXqo3BnN4x5MxywR+aOEgWpEeiAHpd+pmTe+fyM6nszMSiNtQ==`.
The MCP build dependency and lockfile now pin that exact immutable artifact. No SDK,
React or other dependency version changed; the release-age exception names only that
reviewed DEVVY registry version.

## Release accuracy

- MCP defaults, installation plans, resources, prompts and examples now use published
  0.3.1. Published row selection is correctly supported. Workspace remains explicitly
  unreleased with separate provenance; obsolete or unsupported version requests fail.
- The page reads the MCP pin from its package alias, not from the live npm label. Users
  must rebuild their local server; the website cannot replace installed snapshots.
- The docs fallback baseline is the verified 0.3.1 release. npm labels still use cached
  live validation. Current release guidance was corrected; changelogs and historical
  verification records retain their original version references.
- No component implementation, runtime package version or production React dependency
  changed. The MCP package remains private and independently versioned.

## Search and assistant-facing content

- Canonicals, Open Graph/Twitter descriptions, publisher identity and structured version
  facts match the visible content. A locally rendered 1200×630 social card retains the
  supplied logo and cached published release label.
- `/sitemap.xml` lists the 111 canonical pages, including all 100 component references.
  `/robots.txt` exposes the sitemap. No fabricated modification dates are emitted.
- `/llms.txt` supplies concise canonical references and explicitly distinguishes npm,
  documentation implementation and MCP source versions. It is an optional reference
  file, not a ranking or indexing requirement.
- Google states that existing SEO practices apply to AI Search features and that special
  AI text files or markup are not required. Structured data must reflect visible content.
  References: [AI features](https://developers.google.com/search/docs/appearance/ai-features),
  [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
  No indexing, ranking, citation or rich-result outcome is claimed.

## Verification

- Production build passed for 118 routes.
- The 18 MCP protocol/recipe/Inspector tests passed after updating the obsolete assumption
  that published table selection was unavailable.
- Eighteen browser checks passed across Chromium, Firefox and WebKit, covering MCP
  accessibility in light/dark modes, all 100 component SEO pages, canonical/social/schema
  consistency, crawler references, version labels and PNG dimensions/size.
- The generated social card was visually inspected for logo, typography and clipping.
- Typecheck, lint and moderate-level dependency audit passed. The isolated optional MCP
  archive passed modern and legacy stdio tests without React or repository source.
- Local formatting exposed Windows checkout line-ending differences in existing tracked
  files; normalized only the flagged tracked files, preserving unrelated editor settings.
