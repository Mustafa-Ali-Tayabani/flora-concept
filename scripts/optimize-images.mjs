#!/usr/bin/env node
/**
 * Builds responsive WebP variants for every local image:
 *   content/media/originals/<name>.(png|jpg)  →  web/public/img/<name>-<w>.webp
 * and records intrinsic sizes in content/media/manifest.json.
 *
 * Widths match IMAGE_BREAKPOINTS in web/src/app/core/media/image-loader.ts.
 * Images are never upscaled: widths above the original reuse the largest size.
 *
 *   npm run images            (new images only)
 *   npm run images -- --force (regenerate all)
 */
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, parse, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'content/media/originals');
const OUT = join(ROOT, 'web/public/img');
export const WIDTHS = [320, 480, 768, 1080, 1440, 1920];
/** Hero photos always displayed under a dark gradient: stronger compression is invisible. */
const DARKENED = new Set(['hero-equipe', 'hero-cover', 'banner-contact', 'banner-espaces-verts', 'banner-paysagisme', 'banner-evenementiel']);

await mkdir(OUT, { recursive: true });
const manifest = {};
for (const file of (await readdir(SRC)).sort()) {
  const { name, ext } = parse(file);
  if (!/^\.(png|jpe?g|webp)$/i.test(ext)) continue;
  const input = join(SRC, file);
  const meta = await sharp(input).metadata();
  manifest[name] = { width: meta.width, height: meta.height };
  for (const w of WIDTHS) {
    const out = join(OUT, `${name}-${w}.webp`);
    // Existing variants are kept; --force regenerates everything (e.g. after a quality change).
    const exists = await stat(out).then(() => true, () => false);
    if (exists && !process.argv.includes('--force')) continue;
    await sharp(input)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: name === 'flora-logo' ? 90 : DARKENED.has(name) ? 58 : 72, effort: 6 })
      .toFile(out);
  }
  // Logo: small PNG fallback for social cards / JSON-LD.
  if (name === 'flora-logo') await sharp(input).resize({ width: 256 }).png().toFile(join(OUT, 'flora-logo-256.png'));
}
await writeFile(join(ROOT, 'content/media/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Optimised ${Object.keys(manifest).length} images × ${WIDTHS.length} widths → ${OUT}`);
