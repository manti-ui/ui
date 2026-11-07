// Proves the published type files resolve for a consumer. Run after
// `pnpm build:packages`.
//
// 1. Every relative specifier in an emitted `dist/**/*.d.ts` names a .js file
//    (`./meta.js`, `./components/index.js`). NodeNext and Node16 resolution
//    cannot follow an extensionless path or a bare folder, so a consumer on
//    either setting would see no exports, and a side-effect `.css` import has
//    no declaration for a consumer's type checker to find.
// 2. The fixture in `scripts/consumer-types` imports a named export from every
//    typed package entry and type checks under NodeNext and Bundler
//    resolution, with `strict` and `skipLibCheck: false`.
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = process.cwd();
const packages = ['tokens', 'styles', 'folds', 'react', 'oklava'];
const fixtureDir = join(root, 'scripts/consumer-types');
const failures = [];

function declarationFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) declarationFiles(path, out);
    else if (entry.name.endsWith('.d.ts')) out.push(path);
  }
  return out;
}

function relativeSpecifiers(path) {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const found = [];
  const visit = (node) => {
    let literal;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      literal = node.moduleSpecifier;
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      literal = node.argument.literal;
    }
    if (literal && /^\.{1,2}(\/|$)/.test(literal.text)) {
      const { line } = source.getLineAndCharacterOfPosition(
        literal.getStart(source),
      );
      found.push({ specifier: literal.text, line: line + 1 });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

for (const name of packages) {
  const dist = join(root, 'packages', name, 'dist');
  if (!existsSync(dist)) {
    failures.push(
      `@manti-ui/${name}: no dist/ found; run \`pnpm build:packages\` first`,
    );
    continue;
  }
  for (const file of declarationFiles(dist)) {
    for (const { specifier, line } of relativeSpecifiers(file)) {
      if (!/\.(js|mjs|cjs|json)$/.test(specifier)) {
        failures.push(
          `${relative(root, file)}:${line}: '${specifier}' does not name a .js file, so NodeNext cannot resolve it`,
        );
      }
    }
  }
}

if (failures.length === 0) {
  // Link the packages into the fixture the way an install would, so the
  // fixture resolves them through their `exports` maps and not through the
  // workspace's source `paths`.
  const scope = join(fixtureDir, 'node_modules/@manti-ui');
  rmSync(join(fixtureDir, 'node_modules'), { recursive: true, force: true });
  mkdirSync(scope, { recursive: true });
  for (const name of packages) {
    symlinkSync(join(root, 'packages', name), join(scope, name), 'dir');
  }

  const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
  for (const config of ['tsconfig.json', 'tsconfig.bundler.json']) {
    const result = spawnSync(
      process.execPath,
      [tsc, '-p', join(fixtureDir, config)],
      { stdio: 'inherit' },
    );
    if (result.status !== 0) {
      failures.push(
        `scripts/consumer-types/${config}: the consumer fixture does not type check`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error('Published types do not resolve for a consumer:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Consumer types check passed (NodeNext and Bundler resolution).');
}
