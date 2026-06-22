import { componentTokens } from '@manti-ui/tokens';

import { componentMeta } from '../data/componentMeta';

const registry = componentTokens as Record<string, readonly string[]>;

/**
 * Lists a component's Tier-3 component tokens, read straight from the
 * `componentTokens` registry in @manti-ui/tokens (the source of truth).
 */
export function TokenTable({ component }: { component: string }) {
  const scope = componentMeta[component]?.scope ?? component;
  const tokens = registry[scope];

  if (!tokens || tokens.length === 0) {
    return (
      <p>
        This component has no dedicated component tokens yet. Theme it through
        the semantic tokens and the <code>--tone-*</code> vocabulary, or
        override its anatomy selectors directly.
      </p>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Controls</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <tr key={token}>
            <td>
              <code>{`--manti-${scope}-${token}`}</code>
            </td>
            <td>{token.replace(/-/g, ' ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
