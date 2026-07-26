import { componentMeta } from '../data/componentMeta';

/** Renders the props table for a documented component. */
export function PropsTable({ component }: { component: string }) {
  const meta = componentMeta[component];
  if (!meta) return null;
  return (
    <div className="docs-props-table-scroll">
      <table className="docs-props-table">
        <colgroup>
          <col className="docs-props-table-name" />
          <col className="docs-props-table-type" />
          <col className="docs-props-table-default" />
          <col className="docs-props-table-description" />
        </colgroup>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {meta.props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>{prop.default ? <code>{prop.default}</code> : '—'}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
