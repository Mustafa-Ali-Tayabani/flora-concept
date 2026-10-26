/**
 * Shared helpers: which strings of a content document are translatable, and how
 * to address them (stable JSON paths).
 */
/** Keys whose values are never translated (identifiers, URLs, enums, place-independent data). */
export const SKIP_KEYS = new Set(['_id', '_key', '_type', 'slug', 'href', 'src', 'template', 'zone', 'style', 'listItem', 'marks', 'variant', 'layout', 'tone', 'anchor', 'type', 'position', 'siteUrl', 'quoteEndpoint', 'e164', 'gtmId', 'siren', 'foundingDate', 'postalCode', 'country', 'key', 'badge', 'note', 'updatedAt', 'sameAs', 'width', 'height', 'level', 'action', 'name']);

/** Yields [path, value] for every translatable string. */
export function* translatable(node, path = []) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* translatable(node[i], [...path, i]);
  } else if (node && typeof node === 'object') {
    if (node._type === 'pending' || node._type === 'variable') return;
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEYS.has(k) && !(k === 'name' && path.length === 0)) continue;
      yield* translatable(v, [...path, k]);
    }
  } else if (typeof node === 'string' && /\p{L}/u.test(node)) {
    yield [path, node];
  }
}

export const pathKey = (path) => path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('').replace(/^\./, '');

export function setAt(obj, path, value) {
  let o = obj;
  for (let i = 0; i < path.length - 1; i++) o = o[path[i]];
  o[path[path.length - 1]] = value;
}
