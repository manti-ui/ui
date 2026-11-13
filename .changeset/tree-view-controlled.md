---
'@manti-ui/react': patch
---

TreeView: add controlled `expandedValue` and `selectedValue` props and an `onExpandedChange(value: string[])` callback, so a parent that owns the open and selected rows can drive the tree by changing props, without remounting it. `defaultExpandedValue` and `defaultSelectedValue` keep working for uncontrolled use.
