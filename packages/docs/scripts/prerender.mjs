import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from 'vite';

/**
 * The docs build: static generation, no framework.
 *
 * Three passes, in order:
 *
 *   1. the normal client build -> `dist/` (assets, CSS, index.html template);
 *   2. an SSR build of `src/entry-server.tsx` -> `dist-ssr/` (Node-targeted, no
 *      CSS, never deployed);
 *   3. import that bundle, render every route to a string, and write a real
 *      HTML document per route back into `dist/`.
 *
 * The result is one static file per route whose <div id="root"> already holds
 * the full page — crawlers, AI bots and no-JS browsers read the content without
 * running a line of JavaScript, and `entry-client.tsx` hydrates it in place
 * rather than rendering from scratch.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const clientOutDir = join(root, 'dist');
const ssrOutDir = join(root, 'dist-ssr');

const SEO_START = '<!-- seo:start -->';
const SEO_END = '<!-- seo:end -->';
const ROOT_MARKER = '<div id="root"></div>';

/** Swap the managed <head> block for this route's tags. */
function injectHead(template, head) {
  const start = template.indexOf(SEO_START);
  const end = template.indexOf(SEO_END);
  if (start === -1 || end === -1) {
    throw new Error(
      `[prerender] index.html is missing the ${SEO_START} … ${SEO_END} markers`,
    );
  }
  return (
    template.slice(0, start + SEO_START.length) +
    '\n    ' +
    head +
    '\n    ' +
    template.slice(end)
  );
}

function injectApp(template, html) {
  if (!template.includes(ROOT_MARKER)) {
    throw new Error(
      `[prerender] index.html is missing the ${ROOT_MARKER} mount point`,
    );
  }
  return template.replace(ROOT_MARKER, `<div id="root">${html}</div>`);
}

async function main() {
  await build({ root, configFile: join(root, 'vite.config.ts') });

  await build({
    root,
    configFile: join(root, 'vite.config.ts'),
    build: {
      ssr: join(root, 'src', 'entry-server.tsx'),
      outDir: ssrOutDir,
      emptyOutDir: true,
      // Node reads this bundle once and throws it away; minifying it only makes
      // the stack traces of a failed render harder to read.
      minify: false,
    },
  });

  const { prerender } = await import(
    pathToFileURL(join(ssrOutDir, 'entry-server.js')).href
  );

  const indexPath = join(clientOutDir, 'index.html');
  const template = await readFile(indexPath, 'utf8');
  const { pages, sitemap } = await prerender();

  for (const page of pages) {
    const html = injectApp(injectHead(template, page.head), page.html);
    // `/components/button` -> dist/components/button/index.html, the pretty URL
    // Netlify serves as a real file before the SPA catch-all ever applies.
    const target =
      page.slug === '/'
        ? indexPath
        : join(clientOutDir, page.slug.replace(/^\//, ''), 'index.html');
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
  }

  await writeFile(join(clientOutDir, 'sitemap.xml'), sitemap);
  await rm(ssrOutDir, { recursive: true, force: true });

  console.log(
    `\nprerendered ${pages.length} route(s) + sitemap.xml -> ${clientOutDir}`,
  );
}

await main();
