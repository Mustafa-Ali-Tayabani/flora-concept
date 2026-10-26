#!/usr/bin/env node
/**
 * Writes/refreshes content/i18n/en/<doc>.json: one entry per translatable French
 * string ({ fr, en }), keyed by JSON path. Existing English is kept when the
 * French source is unchanged; changed French clears the English (to retranslate).
 *
 *   node scripts/i18n/extract.mjs
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { translatable, pathKey } from './strings.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'content/i18n/en');
await mkdir(OUT, { recursive: true });
const docs = [
  ...(await readdir(join(ROOT, 'content/seed/pages'))).map((f) => ['pages/' + f, f.replace('.json', '')]),
  ['settings.json', 'settings'],
];
let total = 0, todo = 0;
for (const [src, id] of docs) {
  const doc = JSON.parse(await readFile(join(ROOT, 'content/seed', src), 'utf8'));
  const file = join(OUT, `${id}.json`);
  const prev = JSON.parse(await readFile(file, 'utf8').catch(() => '{}'));
  const next = {};
  for (const [path, fr] of translatable(doc)) {
    const k = pathKey(path);
    next[k] = { fr, en: prev[k]?.fr === fr ? prev[k].en : '' };
    total++;
    if (!next[k].en) todo++;
  }
  await writeFile(file, JSON.stringify(next, null, 2) + '\n');
}
console.log(`${total} strings, ${todo} to translate → ${OUT}`);
