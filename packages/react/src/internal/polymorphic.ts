import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
} from 'react';

export type PolymorphicRef<TElement extends ElementType> =
  ComponentPropsWithRef<TElement>['ref'];

export type PolymorphicProps<
  TElement extends ElementType,
  TOwnProps extends object,
> = TOwnProps & {
  as?: TElement;
} & Omit<ComponentPropsWithoutRef<TElement>, keyof TOwnProps | 'as'>;
