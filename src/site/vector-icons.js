// Shared by the static builder and browser: never rely on OS emoji fonts for UI.
const paths = {
  '↗': 'M5 19 19 5M5 5h14v14', '↑': 'M12 21V3M4 11l8-8 8 8',
  '↓': 'M12 3v18M4 13l8 8 8-8', '→': 'M3 12h18M13 4l8 8-8 8',
  '←': 'M21 12H3M11 4l-8 8 8 8', '↘': 'M5 5l14 14M5 19h14V5',
  '↺': 'M4 10a8 8 0 1 1 1 8M4 4v6h6',
  '↻': 'M20 10a8 8 0 1 0-1 8M20 4v6h-6',
  '✓': 'm4 12 5 5L20 6', '✔': 'm4 12 5 5L20 6',
  '✕': 'm5 5 14 14M19 5 5 19', '✖': 'm5 5 14 14M19 5 5 19',
  '➡': 'M3 12h18M13 4l8 8-8 8', '⬆': 'M12 21V3M4 11l8-8 8 8',
  '⬇': 'M12 3v18M4 13l8 8 8-8'
};
const pattern = /[↗↑↓→←↘↺↻✓✔✕✖➡⬆⬇][\uFE0E\uFE0F]?/gu;
export function iconMarkup(symbol) {
  return `<svg class="hd-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[symbol[0]]}"/></svg>`;
}
export function vectorizeHtml(html) {
  // Skip attributes, comments, script, style and existing SVG content.
  return html.replace(/<!--[\s\S]*?-->|<(script|style|svg|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]*>|[^<]+/gi,
    token => token.startsWith('<') ? token : token.replace(pattern, iconMarkup));
}
export function vectorizeCss(css) {
  return css.replace(/content\s*:\s*(['"])([↗↑↓→←↘↺↻✓✔✕✖➡⬆⬇])[\uFE0E\uFE0F]?\1\s*;?/gu, (_, quote, symbol) => {
    const svg = iconMarkup(symbol).replace('stroke="currentColor"', 'stroke="black"');
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    return `content:"";display:inline-block;width:1em;height:1em;background:currentColor;-webkit-mask:${url} center/contain no-repeat;mask:${url} center/contain no-repeat;`;
  });
}
if (typeof document !== 'undefined') {
  const excluded = 'svg,script,style,textarea,input,pre,code,[contenteditable]';
  const convert = root => {
    if (root.nodeType === 1 && root.closest(excluded)) return;
    const nodes = [];
    if (root.nodeType === 3) nodes.push(root);
    else {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
    }
    for (const node of nodes) {
      if (!node.parentElement || node.parentElement.closest(excluded)) continue;
      pattern.lastIndex = 0;
      if (!pattern.test(node.data)) continue;
      const template = document.createElement('template');
      // Preserve literal text safely; insert only fixed, trusted SVG paths.
      let offset = 0;
      pattern.lastIndex = 0;
      for (const match of node.data.matchAll(pattern)) {
        template.content.append(document.createTextNode(node.data.slice(offset, match.index)));
        const icon = document.createElement('template');
        icon.innerHTML = iconMarkup(match[0]);
        template.content.append(icon.content);
        offset = match.index + match[0].length;
      }
      template.content.append(document.createTextNode(node.data.slice(offset)));
      node.replaceWith(template.content);
    }
  };
  convert(document.body);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') convert(record.target);
      else for (const node of record.addedNodes) convert(node);
    }
  }).observe(document.body, {childList: true, subtree: true, characterData: true});
}
