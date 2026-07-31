import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = process.cwd();
const componentsDir = join(root, 'packages/react/src/components');
const indexPath = join(componentsDir, 'index.ts');

function sourceFile(path) {
  return ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

function isExported(node) {
  return node.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
}

function exportedDeclarations(path) {
  const names = new Set();
  for (const statement of sourceFile(path).statements) {
    if (!isExported(statement)) continue;
    if (
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement) ||
      ts.isEnumDeclaration(statement)
    ) {
      if (statement.name) names.add(statement.name.text);
      continue;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    }
  }
  return names;
}

function barrelExports() {
  const byModule = new Map();
  for (const statement of sourceFile(indexPath).statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) {
      continue;
    }
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const moduleName = statement.moduleSpecifier.text;
    const names = byModule.get(moduleName) ?? new Set();
    if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        names.add(element.name.text);
      }
    }
    byModule.set(moduleName, names);
  }
  return byModule;
}

const actual = barrelExports();
const failures = [];

for (const directory of readdirSync(componentsDir, { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  const moduleName = `./${directory.name}/${directory.name}`;
  const path = join(componentsDir, directory.name, `${directory.name}.tsx`);
  let expected;
  try {
    expected = exportedDeclarations(path);
  } catch {
    continue;
  }
  const exported = actual.get(moduleName) ?? new Set();
  const missing = [...expected].filter((name) => !exported.has(name));
  if (missing.length > 0) {
    failures.push(`${moduleName}: ${missing.join(', ')}`);
  }
}

if (failures.length > 0) {
  console.error('React component exports missing from the root barrel:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('React component export parity check passed.');
}
