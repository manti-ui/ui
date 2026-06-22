import { fontSize, fontWeight } from '@manti-ui/tokens';

const SAMPLE = 'The smooth folded dough';

/** Renders the type scale (xs → 5xl) with the live size applied. */
export function TypeScale() {
  return (
    <div>
      {Object.entries(fontSize).map(([name, value]) => (
        <div key={name} className="docs-type-row">
          <span className="docs-type-meta">
            {name} · {value}
          </span>
          <span style={{ fontSize: value }}>{SAMPLE}</span>
        </div>
      ))}
    </div>
  );
}

/** Renders the font-weight scale at a fixed size. */
export function WeightScale() {
  return (
    <div>
      {Object.entries(fontWeight).map(([name, value]) => (
        <div key={name} className="docs-type-row">
          <span className="docs-type-meta">
            {name} · {value}
          </span>
          <span style={{ fontWeight: value, fontSize: 'var(--manti-text-xl)' }}>
            {SAMPLE}
          </span>
        </div>
      ))}
    </div>
  );
}
