# QrCode — shelved

A QR code backed by the Zag.js `qr-code` machine: a `value` to encode, a pixel
`size`, and an optional `overlay` centered on top.

- **Scope:** `qr-code`
- **Kind:** Zag adapter (`@zag-js/qr-code@^1.41.2`)
- **Shelved at:** v0.3.0
- **Component tokens:** none

> **Why shelved:** _to fill in._

## Files

All frozen under `backlog/qr-code/`, mirroring their original paths. Restoring
them is `git mv backlog/qr-code/<path> <path>` for each:

```
packages/react/src/components/QrCode/QrCode.tsx
packages/react/src/components/QrCode/QrCode.stories.tsx
packages/styles/src/components/qr-code.css
packages/docs/src/content/components/qr-code.mdx
packages/docs/src/data/components/qr-code.ts
packages/docs/src/demos/qr-code/basic.tsx
```

The docs page (`content/**/*.mdx`) and the props table (`data/components/*.ts`)
are picked up by `import.meta.glob`, so moving those two files back is enough to
re-register them. Everything below is manual.

## Re-registration checklist

These lines were removed from shared files and must go back. Each list is kept
alphabetical — restore each line to its sorted position.

- [ ] `packages/react/src/components/index.ts` — before the `RadioGroup` block:

  ```ts
  export { QrCode } from './QrCode/QrCode';
  export type { QrCodeProps } from './QrCode/QrCode';
  ```

- [ ] `packages/styles/src/index.css` — after `carousel.css`:

  ```css
  @import './components/qr-code.css';
  ```

- [ ] `packages/folds/src/index.ts` — after the `carousel` export:

  ```ts
  export * as qrCode from '@zag-js/qr-code';
  ```

- [ ] `packages/folds/package.json` — under `dependencies`:

  ```json
  "@zag-js/qr-code": "^1.41.2",
  ```

  then `pnpm install`.

- [ ] `packages/docs/src/data/componentMeta.ts` — in `componentCatalog`, before
      the `RadioGroup` entry:

  ```ts
  entry('QrCode', 'qr-code', 'Rendered QR code.'),
  ```

- [ ] `docs/zag-coverage.md` and
      `packages/docs/src/content/reference/zag-coverage.mdx` — flip the QR Code
      row from 📦 back to ✅.

Then `pnpm verify`, and add a changeset — re-exporting `QrCode` from
`@manti-ui/react` is a public API change.
