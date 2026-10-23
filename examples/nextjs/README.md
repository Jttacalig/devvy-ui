# Next.js example

The complete runnable Next.js App Router integration lives in `apps/docs` to avoid
duplicating an application. It includes server-rendered documentation, an interactive
client preview and global token/style imports in its root layout.

```sh
pnpm build
pnpm --filter devvy-ui-docs start
```

Open /ui. See apps/docs/components/Workbench.tsx for the client boundary and
apps/docs/app/layout.tsx for the global CSS imports. This independent app is not
connected to the private Dev Station production application.

The 0.3.0 source release includes 100 component routes, a searchable directory, a project
workspace landing, optional chart inspection and sandboxed code customization. The
verification record distinguishes local builds from production publication/deployment.
