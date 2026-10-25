// Sorting: domains with fewer tabs first, then by hostname without "www.",
// then by title. Pages without a web domain (about:, file:, moz-extension:…)
// come first. Pinned tabs stay put, and each tab group (or run of ungrouped
// tabs) is sorted on its own.

const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });

function domain(tab) {
  const url = URL.parse(tab.url);
  return url && /^https?:$/.test(url.protocol) ? url.hostname.replace(/^www\./, "") : "";
}

function sorted(run) {
  const domains = new Map(run.map(tab => [tab.id, domain(tab)]));
  const count = new Map();
  for (const d of domains.values()) count.set(d, (count.get(d) ?? 0) + 1);
  const size = tab => (domains.get(tab.id) ? count.get(domains.get(tab.id)) : 0);
  return run.toSorted((a, b) =>
    size(a) - size(b) || collator.compare(domains.get(a.id), domains.get(b.id)) || collator.compare(a.title, b.title));
}

browser.action.onClicked.addListener(async ({ windowId }) => {
  const tabs = await browser.tabs.query({ windowId, pinned: false });
  const runs = [];
  for (const tab of tabs) {
    const run = runs.at(-1);
    if (run?.[0].groupId === tab.groupId) run.push(tab);
    else runs.push([tab]);
  }

  for (const run of runs) {
    const ids = sorted(run).map(t => t.id);
    if (ids.every((id, i) => id === run[i].id)) continue;
    await browser.tabs.move(ids, { index: run[0].index });
    // tabs.move may change group membership at a group's edges; restore it.
    if (run[0].groupId !== -1) {
      await browser.tabs.group({ groupId: run[0].groupId, tabIds: ids });
    } else {
      const moved = await Promise.all(ids.map(id => browser.tabs.get(id)));
      const regrouped = moved.filter(t => t.groupId !== -1).map(t => t.id);
      if (regrouped.length) await browser.tabs.ungroup(regrouped);
    }
  }
});
