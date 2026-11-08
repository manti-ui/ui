import { Button, Card, Text } from '@manti-ui/react';
import { colorPrimitives, colorScales, variants } from '@manti-ui/tokens';

/**
 * Renders every primitive ramp (gray, orange, green, amber, red, blue), each
 * labelled with the Radix Colors scale it is taken from. Every chip is the
 * step's `light-dark()` pair, so the ramp follows the page's color scheme.
 */
export function ColorRamps() {
  return (
    <div>
      {Object.entries(colorPrimitives).map(([name, steps]) => {
        const radix = colorScales[name as keyof typeof colorScales].radix;
        return (
          <div key={name} style={{ marginBottom: 'var(--manti-space-6)' }}>
            <Text
              className="docs-swatch-label"
              style={{ marginBottom: 'var(--manti-space-2)' }}
            >
              {radix === name ? name : `${name} (Radix ${radix})`}
            </Text>
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
        );
      })}
    </div>
  );
}

/**
 * Renders the semantic variants as real Buttons. tertiary/outline share the same
 * neutral palette — what sets them apart is the *treatment* (ghost / bordered)
 * the component applies, not the color tokens. A live Button per variant shows
 * that difference; raw color swatches cannot.
 */
export function VariantGallery() {
  return (
    <div className="docs-variant-grid">
      {variants.map((variant) => (
        <Card key={variant}>
          <Card.Body>
            <div className="docs-cluster">
              <Button variant={variant} style={{ textTransform: 'capitalize' }}>
                {variant}
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
