// The stylesheet ships as `@manti-ui/styles/index.css`. Its import lives in
// `lib-entry.ts`, the Vite entry, so the emitted `index.d.ts` carries no
// side-effect `.css` import that a consumer's type checker cannot resolve.
export { mantiTokens, mantiTokenContract } from '@manti-ui/tokens';
export type {
  MantiBuiltinVariant,
  MantiTokens,
  MantiVariant,
} from '@manti-ui/tokens';
