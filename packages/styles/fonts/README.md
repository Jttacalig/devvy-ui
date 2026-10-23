# Optional font assets

Included in the 0.3.0 GitHub source release. These files are not included in npm 0.2.0.

Import `@devvy-ui/styles/fonts/geist.css`, `fonts/manrope.css` or `fonts/geist-mono.css`
after the theme tokens. `@devvy-ui/styles/fonts.css` declares all three. Apply
`data-devvy-font="geist"`, `"manrope"` or `"geist-mono"` to your theme container.
These optional entries are never imported by base styles or React. No remote font service,
JavaScript loader or runtime dependency is required. A declared face loads only when used.
Keep system fonts as the default when no download is desired.

The unmodified variable WOFF2 files are the Latin subsets served by the official Google Fonts
CSS API (retrieved 2026-10-23). Other scripts and italic text use your fallback stack.
Geist and Geist Mono support weights 100–900; Manrope supports 200–800.

| File                   | Official asset URL                                                        | Bytes |
| ---------------------- | ------------------------------------------------------------------------- | ----- |
| geist-latin.woff2      | https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFU.woff2            | 29400 |
| geist-mono-latin.woff2 | https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2 | 23128 |
| manrope-latin.woff2    | https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2      | 24836 |

Geist and Geist Mono: Copyright 2024 The Geist Project Authors
(https://github.com/vercel/geist-font.git). Manrope: Copyright 2018 The Manrope Project Authors
(https://github.com/googlefonts/manrope). Fonts remain under SIL Open Font License 1.1,
independently of DEVVY UI's MIT code. Preserve all included OFL and FONTLOG files when copying.
License originals: https://github.com/google/fonts/tree/main/ofl/geist,
https://github.com/google/fonts/tree/main/ofl/geistmono,
https://github.com/google/fonts/tree/main/ofl/manrope.
