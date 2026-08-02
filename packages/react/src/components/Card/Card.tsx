import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactElement } from 'react';

import { cx, dataBool } from '../../internal/props';
import type {
  PolymorphicProps,
  PolymorphicRef,
} from '../../internal/polymorphic';

interface CardOwnProps {
  /** Strengthen the card's surface tint. */
  elevated?: boolean;
  /** Apply the smooth hover lift. Pair with real semantics (link, button, onClick). */
  interactive?: boolean;
}

export type CardProps<TElement extends ElementType = 'div'> = PolymorphicProps<
  TElement,
  CardOwnProps
>;

type CardSlotProps = HTMLAttributes<HTMLDivElement>;

/**
 * The signature pillowy surface — the most recognizable Manti UI shape.
 * Compose with `Card.Header`, `Card.Title`, `Card.Description`, `Card.Body`,
 * and `Card.Footer`.
 */
function CardImpl<TElement extends ElementType = 'div'>(
  { as, elevated, interactive, className, ...rest }: CardProps<TElement>,
  ref: PolymorphicRef<TElement>,
) {
  const Root = as ?? 'div';
  return (
    <Root
      {...rest}
      ref={ref}
      data-scope="card"
      data-part="root"
      data-elevated={dataBool(elevated)}
      data-interactive={dataBool(interactive)}
      className={cx(className)}
    />
  );
}

function CardHeader({ className, ...rest }: CardSlotProps) {
  return (
    <div
      data-scope="card"
      data-part="header"
      className={cx(className)}
      {...rest}
    />
  );
}

function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-scope="card"
      data-part="title"
      className={cx(className)}
      {...rest}
    />
  );
}

function CardDescription({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-scope="card"
      data-part="description"
      className={cx(className)}
      {...rest}
    />
  );
}

function CardBody({ className, ...rest }: CardSlotProps) {
  return (
    <div
      data-scope="card"
      data-part="body"
      className={cx(className)}
      {...rest}
    />
  );
}

function CardFooter({ className, ...rest }: CardSlotProps) {
  return (
    <div
      data-scope="card"
      data-part="footer"
      className={cx(className)}
      {...rest}
    />
  );
}

type CardComponent = (<TElement extends ElementType = 'div'>(
  props: CardProps<TElement> & { ref?: PolymorphicRef<TElement> },
) => ReactElement | null) & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

export const Card = forwardRef(CardImpl as never) as unknown as CardComponent;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;
