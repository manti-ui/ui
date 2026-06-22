import { Collapsible } from '@manti-ui/react';

export default function CollapsibleBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <Collapsible trigger="Show chef's note">
        <p
          style={{
            padding: 'var(--manti-space-3) var(--manti-space-1) 0',
            color: 'var(--manti-text-muted)',
          }}
        >
          Rest the dough for 30 minutes so it rolls out smooth and thin.
        </p>
      </Collapsible>
    </div>
  );
}
