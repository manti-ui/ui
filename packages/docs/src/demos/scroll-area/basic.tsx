import { ScrollArea } from '@manti-ui/react';

const paragraphs = [
  'Mantı is a family of dumplings found from Central Asia to Anatolia. The Turkish kind is tiny — squares of thin dough pinched around a pinch of spiced lamb or beef, then boiled.',
  'They are served under a generous spoon of garlic yogurt and a drizzle of melted butter bloomed with Aleppo pepper and dried mint.',
  'Rolling them small is a point of pride: the saying goes that a good cook makes mantı small enough that forty fit on a single spoon.',
  'Across regions the shape shifts — boat-shaped and steamed, folded into purses, or left open at the top — but the yogurt-and-butter finish is the throughline.',
  'Freeze them raw on a floured tray, then bag them; they cook straight from frozen with just an extra minute in the pot.',
];

export default function ScrollAreaBasic() {
  return (
    <ScrollArea
      style={{
        height: '13rem',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
        border: '1px solid var(--manti-border)',
        borderRadius: 'var(--manti-radius-md)',
        background: 'var(--manti-surface)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 'var(--manti-space-3)',
          padding: 'var(--manti-space-4)',
          color: 'var(--manti-text-muted)',
          fontSize: 'var(--manti-text-sm)',
          lineHeight: 'var(--manti-leading-normal)',
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ margin: 0 }}>
            {p}
          </p>
        ))}
      </div>
    </ScrollArea>
  );
}
