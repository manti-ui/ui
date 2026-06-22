import { Card } from '@manti-ui/react';
import { colorPrimitives, tones } from '@manti-ui/tokens';

/** Renders every primitive ramp (gray, orange, green, amber, red, blue). */
export function ColorRamps() {
  return (
    <div>
      {Object.entries(colorPrimitives).map(([name, steps]) => (
        <div key={name} style={{ marginBottom: 'var(--manti-space-6)' }}>
          <p
            className="docs-swatch-label"
            style={{ marginBottom: 'var(--manti-space-2)' }}
          >
            {name}
          </p>
          <div className="docs-swatch-grid">
            {Object.entries(steps).map(([step, value]) => (
              <div key={step} className="docs-swatch">
                <div
                  className="docs-swatch-chip"
                  style={{ background: value as string }}
                />
                <span className="docs-swatch-label">{step}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const swatch = (token: string) => ({
  display: 'inline-block',
  width: 'var(--manti-space-10)',
  height: 'var(--manti-space-10)',
  borderRadius: 'var(--manti-radius-md)',
  background: `var(${token})`,
  border: '1px solid var(--manti-border)',
});

/**
 * Renders the semantic tones. Each card sets `data-tone`, so the `--tone-*`
 * variables resolve theme-aware via `light-dark()`.
 */
export function ToneGallery() {
  return (
    <div className="docs-tone-grid">
      {tones.map((tone) => (
        <div key={tone} data-tone={tone}>
          <Card>
            <Card.Body>
              <div className="docs-cluster">
                <span style={swatch('--tone-solid')} aria-hidden />
                <span style={swatch('--tone-soft-bg')} aria-hidden />
                <strong style={{ textTransform: 'capitalize' }}>{tone}</strong>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}
