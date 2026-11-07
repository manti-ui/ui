// A consumer of the published packages. `scripts/check-consumer-types.mjs`
// type checks this file against each package's emitted `dist` types, once
// under NodeNext resolution and once under Bundler resolution. Import a named
// export from every typed entry in the packages' `exports` maps.
import { mantiTokens, type MantiVariant } from '@manti-ui/tokens';
import { mantiTokenContract } from '@manti-ui/styles';
import { shortcut, tabs } from '@manti-ui/folds';
import { Button, type ButtonProps } from '@manti-ui/react';
import { useShortcut, type ShortcutMap } from '@manti-ui/react/shortcut';
import { Oklava, type OklavaProps } from '@manti-ui/oklava';

const variant: MantiVariant = 'primary';
const buttonProps: ButtonProps = { variant };
const shortcuts: ShortcutMap = {};
const oklavaProps: OklavaProps = {};

export const consumed = [
  mantiTokens,
  mantiTokenContract,
  shortcut.createShortcuts,
  tabs.machine,
  Button,
  useShortcut,
  Oklava,
  buttonProps,
  shortcuts,
  oklavaProps,
] as const;
