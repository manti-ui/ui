---
'@manti-ui/tokens': patch
---

Export `contrastPairs`, the foreground/background token pairs Manti checks its palette's contrast on, also available as `mantiTokens.color.contrastPairs`. Each pair carries `label`, `fg`, `bg`, `kind` (`'text'` at 4.5:1 or `'ui'` at 3:1), `gate` and `scope` (`'root'` or `'variant'`), so an app that themes Manti can check its own resolved values against the same list. The styles package's contrast check now reads this export; the pairs, their thresholds and which of them are gated are unchanged.
