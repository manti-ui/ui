/** Vite inlines a `?inline` stylesheet import as a string. */
declare module '*.css?inline' {
  const css: string;
  export default css;
}
