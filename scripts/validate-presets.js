#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { execFileSync as execFile } from 'child_process';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const presetsDir = join(root, 'public', 'presets');
const schemaPath = join(root, 'public', 'presets', 'schema.json');

// ── segment-catalog.json drift check ──────────────────────────
// The statusline-market Skill reads scripts/segment-catalog.json instead of
// importing TypeScript directly. Regenerate it and fail if it doesn't match
// what's committed, so src/lib/segment-defs.ts changes can't silently drift
// out of sync with the Skill's copy.
{
  const catalogPath = join(root, 'scripts', 'segment-catalog.json');
  const before = readFileSync(catalogPath, 'utf8');
  execFile('node', [join(root, 'scripts', 'gen-segment-catalog.mjs')], { stdio: 'pipe' });
  const after = readFileSync(catalogPath, 'utf8');
  if (before !== after) {
    console.error('FAIL: scripts/segment-catalog.json is stale.');
    console.error('  Run `node scripts/gen-segment-catalog.mjs` and commit the result.');
    process.exit(1);
  }
  console.log('OK: scripts/segment-catalog.json is up to date.');
}

// ── public/presets/index.json drift check ─────────────────────
// GitHub Pages can't list a directory, so the statusline-market Skill (and
// anything else browsing presets over plain HTTP) relies on this manifest.
{
  const indexPath = join(presetsDir, 'index.json');
  const before = readFileSync(indexPath, 'utf8');
  execFile('node', [join(root, 'scripts', 'gen-preset-index.mjs')], { stdio: 'pipe' });
  const after = readFileSync(indexPath, 'utf8');
  if (before !== after) {
    console.error('FAIL: public/presets/index.json is stale.');
    console.error('  Run `node scripts/gen-preset-index.mjs` and commit the result.');
    process.exit(1);
  }
  console.log('OK: public/presets/index.json is up to date.');
}

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

const files = readdirSync(presetsDir).filter(f => f.endsWith('.json') && f !== 'schema.json' && f !== 'index.json');

let errors = 0;
for (const file of files) {
  const data = JSON.parse(readFileSync(join(presetsDir, file), 'utf8'));
  const valid = validate(data);
  if (!valid) {
    console.error(`FAIL: ${file}`);
    for (const err of validate.errors ?? []) {
      console.error(`  ${err.instancePath} ${err.message}`);
    }
    errors++;
  } else {
    console.log(`OK: ${file}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} preset(s) failed validation.`);
  process.exit(1);
} else {
  console.log(`\nAll ${files.length} preset(s) valid.`);
}
