import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import * as Manti from '@manti-ui/react';

import { Anatomy } from '../doc/Anatomy';
import { ColorRamps, ToneGallery } from '../doc/ColorRamps';
import { ComponentStatusGrid } from '../doc/ComponentStatusGrid';
import { Demo } from '../doc/Demo';
import { InstallTabs } from '../doc/InstallTabs';
import { LinkButton } from '../doc/LinkButton';
import { PropsTable } from '../doc/PropsTable';
import { ReleasesList } from '../doc/ReleasesList';
import { TokenTable } from '../doc/TokenTable';
import { TypeScale, WeightScale } from '../doc/TypeScale';
import { CodeBlock } from './CodeBlock';

/** Internal links use the router; external links open in a new tab. */
function Anchor({ href = '', children, ...rest }: ComponentProps<'a'>) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/i.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

// `@manti-ui/react` also exports a metadata object and a toaster factory; neither
// is a renderable component, so drop them before spreading into the MDX map.
const {
  mantiUi: _mantiUi,
  createToaster: _createToaster,
  ...mantiComponents
} = Manti;

/**
 * The MDXProvider map. Manti components are spread first so every page can use
 * `<Button>`, `<Card>`, … directly; the element + doc-primitive overrides follow
 * so they win.
 */
export const mdxComponents = {
  ...mantiComponents,
  a: Anchor,
  pre: CodeBlock,
  Demo,
  InstallTabs,
  LinkButton,
  PropsTable,
  Anatomy,
  TokenTable,
  ColorRamps,
  ToneGallery,
  TypeScale,
  WeightScale,
  ComponentStatusGrid,
  ReleasesList,
};
