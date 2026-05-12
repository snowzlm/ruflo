#!/usr/bin/env node
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = [
  'bin/cli.js',
  'v3/@claude-flow/cli/bin/cli.js',
  'v3/@claude-flow/cli/dist/src/index.js',
  'v3/@claude-flow/cli/dist/src/mcp-client.js',
];

for (const file of required) {
  try {
    await access(file, constants.R_OK);
    console.log(`✓ ${file}`);
  } catch (error) {
    console.error(`✗ missing required runtime file: ${file}`);
    console.error(error?.message || error);
    process.exit(1);
  }
}

for (const file of ['bin/cli.js', 'v3/@claude-flow/cli/bin/cli.js']) {
  const syntax = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (syntax.status !== 0) process.exit(syntax.status ?? 1);
  console.log(`✓ syntax ${file}`);
}
