import { componentMeta } from '../data/componentMeta';

/**
 * Renders the anatomy table — the public `data-scope` / `data-part` selectors
 * that are the stable customization contract for a component.
 */
export function Anatomy({ component }: { component: string }) {
  const meta = componentMeta[component];
  if (!meta) return null;
  return (
    <table>
      <thead>
        <tr>
          <th>Part</th>
          <th>Selector</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {meta.anatomy.map((part) => (
          <tr key={part.part}>
            <td>
              <code>{part.part}</code>
            </td>
            <td>
              <code>{`[data-scope="${meta.scope}"][data-part="${part.part}"]`}</code>
            </td>
            <td>{part.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
