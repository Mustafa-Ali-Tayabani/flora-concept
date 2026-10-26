import { PtBlock, RichText } from '../../core/content/content.models';

/** Flattened inline run: what one Portable Text child renders as. */
export interface InlineRun {
  key: string;
  kind: 'text' | 'pending' | 'zone';
  text: string;
  strong: boolean;
  em: boolean;
  /** Internal path (router link), with optional fragment. */
  path?: string;
  fragment?: string;
  /** External, tel: or mailto: URL. */
  href?: string;
  action?: 'manageCookies';
}

export type RtNode =
  | { kind: 'p' | 'h3'; key: string; runs: InlineRun[] }
  | { kind: 'ul' | 'ol'; key: string; items: { key: string; runs: InlineRun[] }[] };

export function toRuns(block: PtBlock): InlineRun[] {
  const defs = new Map(block.markDefs.map((d) => [d._key, d]));
  return block.children.map((c) => {
    if (c._type === 'pending') return { key: c._key, kind: 'pending', text: c.note, strong: false, em: false };
    if (c._type === 'variable') return { key: c._key, kind: 'zone', text: '', strong: false, em: false };
    const run: InlineRun = { key: c._key, kind: 'text', text: c.text, strong: c.marks.includes('strong'), em: c.marks.includes('em') };
    for (const m of c.marks) {
      const d = defs.get(m);
      if (!d) continue;
      if (d._type === 'action') run.action = d.action;
      else if (/^\/(?!\/)/.test(d.href)) {
        const [path, fragment] = d.href.split('#');
        run.path = path;
        if (fragment) run.fragment = fragment;
      } else if (/^(https:|tel:|mailto:)/.test(d.href)) run.href = d.href;
    }
    return run;
  });
}

/** Groups consecutive list-item blocks into lists. */
export function toNodes(value: RichText | undefined | null): RtNode[] {
  const out: RtNode[] = [];
  for (const b of value ?? []) {
    if (b._type !== 'block') continue;
    if (b.listItem) {
      const kind = b.listItem === 'number' ? 'ol' : 'ul';
      const last = out[out.length - 1];
      const item = { key: b._key, runs: toRuns(b) };
      if (last && last.kind === kind) last.items.push(item);
      else out.push({ kind, key: b._key, items: [item] });
    } else out.push({ kind: b.style === 'h3' ? 'h3' : 'p', key: b._key, runs: toRuns(b) });
  }
  return out;
}

/** Plain text of a rich text value (used for splitting and meta). */
export function plainText(value: RichText | undefined | null): string {
  return (value ?? [])
    .map((b) => b.children.map((c) => (c._type === 'span' ? c.text : '')).join(''))
    .join(' ')
    .trim();
}
