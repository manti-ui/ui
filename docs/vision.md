# Manti UI Vision

Manti UI takes its central metaphor from mantı, a food shared across many
regions and cultures.

## Product principles

- **Adaptable:** Mantı appears in many shapes. Components should support
  composition without forcing one product aesthetic.
- **Content-friendly:** Mantı accepts many fillings. Components should accept
  varied content and application needs without becoming brittle.
- **Smooth:** The eating experience and visual character feel soft and
  continuous. Interaction should feel calm, responsive, and predictable.
- **Familiar but distinctive:** The system should remain easy to understand
  while developing a recognizable Manti UI character.
- **Accessible by default:** Visual and interaction decisions should target
  WCAG 2.2 AA. Zag.js machines define shared interaction behavior, while each
  framework adapter remains responsible for correct DOM rendering.

## Current boundary

The first design-system release is implemented: color, typography, spacing,
radius, motion, and elevation tokens, plus a foundational React component set
(Button, Toggle, Switch, Checkbox, Input, Badge, Card, Alert, Spinner).
Iconography and additional framework adapters remain open. See
[`design-system.md`](./design-system.md) for the reference.
