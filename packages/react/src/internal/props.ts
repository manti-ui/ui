/** Internal helpers shared by the React adapter. Not part of the public API. */

export type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type WithDataAttributes<T> = T & DataAttributes;

/** Join truthy class names; returns `undefined` when empty so the attribute is omitted. */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string | undefined {
  const joined = parts.filter(Boolean).join(' ');
  return joined.length > 0 ? joined : undefined;
}

/** Render a boolean as a `data-*` attribute value, omitting it when false. */
export function dataBool(value: boolean | undefined): 'true' | undefined {
  return value ? 'true' : undefined;
}
