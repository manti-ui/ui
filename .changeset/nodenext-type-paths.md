---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
'@manti-ui/folds': patch
'@manti-ui/react': patch
'@manti-ui/oklava': patch
---

Types: the published `.d.ts` files now import each other by full paths (`./meta.js`, `./components/index.js`), so an app type checked with `"moduleResolution": "NodeNext"` or `"Node16"` sees every export. `@manti-ui/styles` no longer declares a side-effect `./index.css` import in its types; the stylesheet still ships as `@manti-ui/styles/index.css`. The runtime JavaScript is unchanged.
