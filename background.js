browser.runtime.onInstalled.addListener(paintIcon);
browser.runtime.onStartup.addListener(paintIcon);

// Toolbar icon: drawn in the theme's own icon color. Built-in themes that
// don't declare colors fall back to the light/dark theme_icons in the manifest.

const ICON = color => `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2.5v11M1.5 11l2.5 2.5L6.5 11"/><path d="M9 4h2.5M9 8h4M9 12h5.5"/></svg>`;

async function paintIcon() {
  const { colors } = await browser.theme.getCurrent();
  let color = colors?.icons || colors?.toolbar_text || colors?.bookmark_text;
  if (Array.isArray(color)) color = `rgb(${color.join(",")})`;
  if (!color) return browser.action.setIcon({ path: null });

  const img = new Image();
  img.src = "data:image/svg+xml," + encodeURIComponent(ICON(color));
  await img.decode();
  const imageData = {};
  for (const size of [16, 32]) {
    const ctx = new OffscreenCanvas(size, size).getContext("2d");
    ctx.drawImage(img, 0, 0, size, size);
    imageData[size] = ctx.getImageData(0, 0, size, size);
  }
  browser.action.setIcon({ imageData });
}
browser.theme.onUpdated.addListener(paintIcon);

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
  const count = new Map();
  for (const tab of run) count.set(domain(tab), (count.get(domain(tab)) ?? 0) + 1);
  const size = tab => (domain(tab) ? count.get(domain(tab)) : 0);
  return run.toSorted((a, b) => size(a) - size(b) || collator.compare(domain(a), domain(b)) || collator.compare(a.title, b.title));
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
    if (run[0].groupId !== -1) await browser.tabs.group({ groupId: run[0].groupId, tabIds: ids });
    else {
      const moved = await Promise.all(ids.map(id => browser.tabs.get(id)));
      const regrouped = moved.filter(t => t.groupId !== -1).map(t => t.id);
      if (regrouped.length) await browser.tabs.ungroup(regrouped);
    }
  }
});
