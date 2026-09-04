#!/usr/bin/env node
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generateFiles, TARGETS } from './generator.js';

function help() {
  console.log(`ruleport — portable instructions for coding agents

Usage:
  ruleport [policy.json] [options]

Options:
  -o, --out <dir>       Output directory (default: current directory)
  -t, --target <names>  Comma-separated: agents,claude,copilot,cursor
      --check           Exit non-zero when generated files are stale
      --dry-run         Print generated files without writing
      --init            Create a starter ruleport.json
  -h, --help            Show help`);
}

function parse(argv) {
  const out = { file: 'ruleport.json', outDir: '.', targets: Object.keys(TARGETS) };
  const args = [...argv];
  if (args[0] && !args[0].startsWith('-')) out.file = args.shift();
  while (args.length) {
    const flag = args.shift();
    if (flag === '-h' || flag === '--help') out.help = true;
    else if (flag === '-o' || flag === '--out') out.outDir = args.shift();
    else if (flag === '-t' || flag === '--target') out.targets = args.shift().split(',').map((x) => x.trim()).filter(Boolean);
    else if (flag === '--check') out.check = true;
    else if (flag === '--dry-run') out.dryRun = true;
    else if (flag === '--init') out.init = true;
    else throw new Error(`Unknown option: ${flag}`);
  }
  return out;
}

const starter = {
  name: 'My project',
  summary: 'Describe what this repository does and who it serves.',
  stack: ['Node.js 22'],
  commands: { test: 'npm test', check: 'npm run check' },
  conventions: ['Prefer small, focused modules.', 'Add tests for behavior changes.'],
  boundaries: ['Do not commit secrets.', 'Do not edit generated files directly.'],
  verification: ['Run the test suite.', 'Summarize user-visible changes.'],
  scope: '**/*'
};

try {
  const options = parse(process.argv.slice(2));
  if (options.help) help();
  else if (options.init) {
    await writeFile(options.file, `${JSON.stringify(starter, null, 2)}\n`, { flag: 'wx' });
    console.log(`Created ${options.file}`);
  } else {
    const spec = JSON.parse(await readFile(options.file, 'utf8'));
    const files = generateFiles(spec, options.targets);
    let stale = false;
    for (const [relative, content] of Object.entries(files)) {
      const destination = path.resolve(options.outDir, relative);
      if (options.dryRun) console.log(`\n=== ${relative} ===\n${content}`);
      else if (options.check) {
        const current = await readFile(destination, 'utf8').catch(() => '');
        if (current !== content) { console.error(`stale: ${relative}`); stale = true; }
      } else {
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, content);
        console.log(`wrote: ${relative}`);
      }
    }
    if (stale) process.exitCode = 2;
  }
} catch (error) {
  console.error(`ruleport: ${error.message}`);
  process.exitCode = 1;
}
