import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SEGMENT_DEFS, SEGMENT_GROUPS } from './segment-defs';

// scripts/segment-catalog.json is a generated JSON export of this same module,
// consumed by the statusline-market Skill (plain Node, no TS toolchain).
// `npm run validate` already regenerates + diffs it; this test gives the same
// guarantee inside `npm test` so drift is caught either way.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const catalogPath = path.join(root, 'scripts/segment-catalog.json');

describe('scripts/segment-catalog.json', () => {
  it('matches SEGMENT_DEFS / SEGMENT_GROUPS from segment-defs.ts', () => {
    const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
    expect(catalog.segments).toEqual(SEGMENT_DEFS);
    expect(catalog.groups).toEqual(SEGMENT_GROUPS);
  });
});
