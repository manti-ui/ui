#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Command } from 'commander';

const PACKAGES = ['@manti-ui/react', '@manti-ui/styles'];

async function create() {
  const dir = process.cwd();
  const pkgPath = join(dir, 'package.json');

  if (!existsSync(pkgPath)) {
    console.error('✖ package.json not found. Please run the command in a project folder');
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (!deps.react) {
    console.error('✖ This is not a React project. Manti UI currently supports React only');
    process.exit(1);
  }

  let pm = 'npm';
  if (pkg.packageManager) {
    pm = pkg.packageManager.split('@')[0];
  } else if (existsSync(join(dir, 'pnpm-lock.yaml'))) {
    pm = 'pnpm';
  } else if (existsSync(join(dir, 'yarn.lock'))) {
    pm = 'yarn';
  } else if (existsSync(join(dir, 'bun.lockb'))) {
    pm = 'bun';
  }
  console.log(`✔ Paket yoneticisi: ${pm}`);

  const addCommand = pm === 'npm' ? 'install' : 'add';
  console.log(`› ${pm} ${addCommand} ${PACKAGES.join(' ')}\n`);

  const child = spawn(pm, [addCommand, ...PACKAGES], { stdio: 'inherit', cwd: dir });

  child.on('close', (code) => {
    if (code === 0) {
      implementTokens()
      console.log('\n✔ Manti UI added!');
    }
    process.exit(code ?? 0);
  });
}

function implementTokens() {
  const dir = process.cwd()
  const candidates = [
    'src/index.css',
    'src/main.css',
    'src/styles/globals.css',
    'src/app/globals.css',
    'app/globals.css',       // Next.js app router
    'styles/globals.css',    // Next.js pages router
    'src/app.css',           // SvelteKit
    'src/App.css',
    'index.css',
  ];

  const result = candidates.map(path => join(dir, path)).find(existsSync)
  const tokens = readFileSync(join(dir, 'node_modules/@manti-ui/styles/dist/tokens.css'))
  if (result) {
    appendFileSync(result, tokens)
  } else {
    appendFileSync(join(dir, 'src/index.css'), tokens)
  }
}

const program = new Command();

program.name('manti').description('Manti UI cli.');

program
  .command('create')
  .description('Detects the framework and install Manti UI packages into your project.')
  .option('--tailwind', 'Initialize Manti UI with tailwind')
  .action(create);

  program.parse();
