#!/usr/bin/env node
/**
 * Lists every `{{A_FOURNIR}}` (client data still missing) per page, from the
 * report written by scripts/sync-content.mjs.
 *
 *   npm run content:guard             → report only
 *   npm run content:guard -- --strict → exit 1 if anything is pending
 *                                        (use for the production go-live build)
 *
 * Production builds never display placeholders (they are stripped), but a page
 * whose sentence depended on the missing value must not go live: that is what
 * --strict enforces, per the brief (« no page ships with a {{A_FOURNIR}} »).
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const report = JSON.parse(await readFile(join(ROOT, '.cache/pending-report.json'), 'utf8'));

/** Pages that cannot be published at all without their data (brief: « BLOQUANT »). */
const BLOCKING = ['/location-entretien-plantes-bureau-paris/', '/mentions-legales/', '/politique-de-confidentialite/', '/cookies/'];

const byPage = new Map();
for (const { where, note } of report.pending) {
  if (!byPage.has(where)) byPage.set(where, []);
  byPage.get(where).push(note);
}

if (!byPage.size) {
  console.log('Content guard: no pending client data.');
  process.exit(0);
}

console.log(`Content guard: ${report.pending.length} pending client values on ${byPage.size} page(s)\n`);
for (const [where, notes] of [...byPage].sort()) {
  console.log(`${BLOCKING.includes(where) ? '⛔' : '•'} ${where} (${notes.length})`);
  for (const n of [...new Set(notes)]) console.log(`    - ${n}`);
}
console.log('\n⛔ = page must not go live until completed.');
if (strict) {
  console.error('\nStrict mode: build stopped. Provide the data in Sanity (or content/seed) and rebuild.');
  process.exit(1);
}
