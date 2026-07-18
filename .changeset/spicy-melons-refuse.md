---
'@manti-ui/react': minor
'@manti-ui/styles': minor
---

**Breaking:** `TextField` is renamed to `Input`, and `PasswordInput` is folded
into it as `<Input type="password">`.

```diff
-import { TextField, PasswordInput } from '@manti-ui/react';
+import { Input } from '@manti-ui/react';

-<TextField label="Email" />
+<Input label="Email" />

-<PasswordInput label="Password" />
+<Input type="password" label="Password" />
```

The password affordances (show/hide toggle, Caps Lock warning) now belong to
Input and apply to `type="password"` only — the same rule the inherited native
attributes already follow, where `min`/`max` apply to `type="number"` and
`accept` to `type="file"`.

The password props are renamed to say which type they belong to, since names like
`visible` and `showLabel` are ambiguous next to Input's own `label`:

| `PasswordInput`        | `Input`                      |
| ---------------------- | ---------------------------- |
| `showVisibilityToggle` | `showPasswordToggle`         |
| `visible`              | `passwordVisible`            |
| `defaultVisible`       | `defaultPasswordVisible`     |
| `onVisibilityChange`   | `onPasswordVisibilityChange` |
| `showLabel`            | `showPasswordLabel`          |
| `hideLabel`            | `hidePasswordLabel`          |

`showCapsLockWarning` and `capsLockLabel` are unchanged.

**Breaking (CSS):** the `password-input` scope is gone; its two parts moved onto
the `field` scope that Input already renders.

```diff
-[data-scope='password-input'][data-part='visibility-trigger']
+[data-scope='field'][data-part='visibility-trigger']

-[data-scope='password-input'][data-part='caps-lock']
+[data-scope='field'][data-part='caps-lock']
```

The rest of the `field` anatomy, its component tokens (`--manti-field-*`), and
Textarea are unaffected.
