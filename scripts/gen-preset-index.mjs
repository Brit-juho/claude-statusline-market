#!/usr/bin/env node
// gen-preset-index.mjs — build public/presets/index.json, a lightweight manifest
// of all presets (id/title/description/category/tags, no ccstatusline_settings).
//
// GitHub Pages serves static files only — it can't list a directory — so
// anything that wants to browse presets without shipping the whole repo
// (e.g. the statusline-market Skill, run over WebFetch) needs one URL that
// enumerates them. This is that URL: /presets/index.json.
//
// Run: node scripts/gen-preset-index.mjs
// CI: validate.yml runs this and fails the build if the committed file is stale.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const presetsDir = join(root, 'public', 'presets');
const outPath = join(presetsDir, 'index.json');

const files = readdirSync(presetsDir)
  .filter(f => f.endsWith('.json') && f !== 'schema.json' && f !== 'index.json');

const index = files
  .map(f => {
    const data = JSON.parse(readFileSync(join(presetsDir, f), 'utf8'));
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags ?? [],
      author: data.author,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

writeFileSync(outPath, JSON.stringify(index, null, 2) + '\n');
console.log(`Wrote ${index.length} preset(s) to public/presets/index.json`);
