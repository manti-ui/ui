---
'@manti-ui/styles': patch
---

fix(tabs): scope trigger/indicator styles to the list's direct children (#50)

Tabs variant rules matched any descendant `[data-part='trigger']`/`[data-part='indicator']` under the root, so components rendered inside tab content (e.g. a Clipboard's icon wrappers) leaked the sliding-thumb chrome. Both parts are now anchored through `> [data-part='list'] >`, leaving embedded components untouched with no visual change to the tabs themselves.
