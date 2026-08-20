import { ScrollArea, Text } from '@manti-ui/react';

const paragraphs = [
  'Mantı is a family of dumplings found from Central Asia to Anatolia. The Turkish kind is tiny — squares of thin dough pinched around a pinch of spiced lamb or beef, then boiled.',
  'They are served under a generous spoon of garlic yogurt and a drizzle of melted butter bloomed with Aleppo pepper and dried mint.',
  'Rolling them small is a point of pride: the saying goes that a good cook makes mantı small enough that forty fit on a single spoon.',
  'Across regions the shape shifts — boat-shaped and steamed, folded into purses, or left open at the top — but the yogurt-and-butter finish is the throughline.',
  'Freeze them raw on a floured tray, then bag them; they cook straight from frozen with just an extra minute in the pot.',
];

export default function ScrollAreaBasic() {
  return (
    <ScrollArea className="scroll-area">
      <div className="scroll-area-content">
        {paragraphs.map((p, i) => (
          <Text key={i}>{p}</Text>
        ))}
      </div>
    </ScrollArea>
  );
}
