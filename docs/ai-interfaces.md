# AI interfaces with DEVVY UI

This is a proposed composition direction for the 100-component library, not a shipped AI
SDK, provider adapter or extra primary-component inventory. DEVVY UI currently supplies
React components, framework-independent core utilities and shared CSS. Other framework
adapters require their own implementation and tests.

References: the [shadcn/ui component catalog](https://ui.shadcn.com/docs/components) and
[AI Elements compositions](https://ui.shadcn.com/docs/ai-elements), reviewed on 2026-10-23.
The useful idea is composing owned interface source from smaller controls. DEVVY should
implement its own APIs, identity and behavior without copying their implementation or
adding their dependencies to the base library.

## Composition map

| Pattern               | Existing DEVVY building blocks                       | Application responsibility                           |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Conversation          | Avatar, Card, ScrollArea, MarkdownViewer, CopyButton | Message ids, persistence and stream state            |
| Prompt composer       | Textarea, FileUpload, Dropzone, IconButton, Tooltip  | Sending, stopping, uploading and server validation   |
| Model selection       | Combobox, Popover, Badge                             | Available models, permissions and provider routing   |
| Tool activity         | Collapsible, StatusIndicator, CodeBlock, Timeline    | Typed tool events and sanitized output               |
| Task plan             | Stepper, Checkbox, Progress                          | Actual task status and cancellation                  |
| Tool approval         | AlertDialog, Button                                  | Explicit approval/rejection and server authorization |
| Sources and citations | HoverCard, Popover, native links                     | Provenance, safe URLs and citation ids               |
| Artifacts             | Tabs, CodeBlock, Gallery, ResizablePanels            | Storage and isolated execution where required        |

Start with a documented chat/composer/tool-state example using these primitives. Keep it
inside DEVVY UI. A later `/ui/ai` area can host reviewed patterns after implementation and
testing; the current 0.3.1 Stable release does not claim that route exists.

## Integration boundary

Use application-owned callbacks and typed data for idle, streaming, complete, stopped and
error states. Streaming transport and optional AI SDK/provider/HTTP adapters belong outside
the base core and styles packages. Never put provider secrets in browser props.

Render supplied progress summaries and tool results. Do not imply access to private model
chain of thought. Approval UI must describe an action and wait for an explicit response;
displaying a confirmation component does not authorize execution.

## Interaction and content requirements

- Preserve drafts on errors; provide Retry and Stop generation callbacks.
- Follow new messages only while the user is near the end. Offer Jump to latest when they
  scroll away; preserve the text they are reading.
- Batch rendering and live announcements. Do not announce every streamed token. Preserve
  selectable text and stable message keys.
- Specify Enter/Shift+Enter and IME behavior. Label attachment actions, validate files on
  the server, and explain rejections.
- Treat model output as untrusted. MarkdownViewer escapes HTML and supports a documented
  subset; CodeBlock displays text. Preserve the playground sandbox and content policy.
- Verify keyboard focus, reduced motion, narrow layouts, long code and both themes. Cover
  loading, cancellation, empty results, denied tools and disconnected streams.

## Catalog improvements

Use consistent working previews, focused imports, source installation, typed APIs,
customization and interaction notes. Search by task as well as name. Distinguish native
primitives from application compositions. Document narrow editing, media and virtualization
contracts and actual compatibility results. These patterns preserve DEVVY's own structure.
