/** Canonical source closure, preserving deterministic order and rejecting invalid graphs. */
export function componentSources(inventory, name) {
  const byName = new Map(inventory.map((item) => [item.name, item]));
  const seen = new Set();
  const sources = [];
  function visit(current, path) {
    if (path.includes(current))
      throw new Error('Circular component dependency: ' + [...path, current].join(' -> '));
    if (seen.has(current)) return;
    const item = byName.get(current);
    if (!item) throw new Error('Unknown component dependency: ' + current);
    seen.add(current);
    sources.push(current);
    for (const dependency of item.dependencies ?? []) visit(dependency, [...path, current]);
  }
  visit(name, []);
  return sources;
}
