import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFiles, validateSpec } from '../src/generator.js';

const spec = { name: 'Demo', summary: 'A demo.', stack: ['Node.js'], commands: { test: 'npm test' }, conventions: ['Stay small.'], boundaries: ['No secrets.'], verification: ['Run tests.'], scope: 'src/**/*.js' };

test('generates all supported targets', () => {
  const files = generateFiles(spec);
  assert.deepEqual(Object.keys(files), ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md', '.cursor/rules/project.mdc']);
});

test('cursor output contains frontmatter and scope', () => {
  const file = generateFiles(spec, ['cursor'])['.cursor/rules/project.mdc'];
  assert.match(file, /^---\n/);
  assert.match(file, /globs: src\/\*\*\/\*\.js/);
});

test('content carries commands and boundaries', () => {
  const file = generateFiles(spec, ['agents'])['AGENTS.md'];
  assert.match(file, /\*\*test:\*\* `npm test`/);
  assert.match(file, /No secrets\./);
});

test('validates malformed policies', () => {
  assert.deepEqual(validateSpec({ name: '', stack: 'Node' }), ['name is required.', 'stack must be an array.']);
  assert.throws(() => generateFiles({ name: 'x' }, ['unknown']), /Unknown targets/);
});
