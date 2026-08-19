/**
 * Split a compound type size into its scale stop and its optional weight:
 * `'lg'` → `['lg', undefined]`, `'lg/semibold'` → `['lg', 'semibold']`.
 *
 * An omitted weight stays `undefined` so the attribute is never written at all.
 * That is what keeps a CSS-side default in charge — Heading's `data-level='1'`
 * bold, or a consumer who redefined the weight for a given stop.
 */
export function parseTypeSize(
  size: string | undefined,
): [scale: string | undefined, weight: string | undefined] {
  if (size === undefined) return [undefined, undefined];
  const slash = size.indexOf('/');
  if (slash === -1) return [size, undefined];
  return [size.slice(0, slash), size.slice(slash + 1)];
}
