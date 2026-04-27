#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const presetsDir = join(root, 'presets');
const schemaPath = join(presetsDir, 'schema.json');

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

const files = readdirSync(presetsDir).filter(f => f.endsWith('.json') && f !== 'schema.json');

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
