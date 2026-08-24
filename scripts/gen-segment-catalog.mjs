#!/usr/bin/env node
// gen-segment-catalog.mjs — export src/lib/segment-defs.ts's SEGMENT_DEFS/SEGMENT_GROUPS
// as scripts/segment-catalog.json, so the statusline-market Skill (plain Node, no
// TypeScript toolchain) can read the exact same catalog the browser builder uses,
// instead of hand-maintaining a second copy that could drift.
//
// Run: node scripts/gen-segment-catalog.mjs
// CI: validate.yml runs this and fails the build if the committed JSON is stale.

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import esbuild from 'esbuild';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'src/lib/segment-defs.ts');
const out = path.join(root, 'scripts/segment-catalog.json');

const bundle = await esbuild.build({
  entryPoints: [src],
  bundle: false,
  write: false,
  format: 'esm',
  target: 'node18',
});
const code = bundle.outputFiles[0].text;
const dataUrl = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
const mod = await import(dataUrl);

const catalog = {
  groups: mod.SEGMENT_GROUPS,
  segments: mod.SEGMENT_DEFS,
};

const json = JSON.stringify(catalog, null, 2) + '\n';
writeFileSync(out, json);
console.log(`Wrote ${mod.SEGMENT_DEFS.length} segments across ${Object.keys(mod.SEGMENT_GROUPS).length} groups to ${path.relative(root, out)}`);
