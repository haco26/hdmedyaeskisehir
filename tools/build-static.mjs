import { addSecurityPolicy } from './security-policy.mjs';
import { decorateArticleCategories } from './article-categories.mjs';
import { injectLeadConsent, legalIdentityHtml } from './lead-consent.mjs';
import { loadArticles } from './article-content.mjs';
import { pricingSection, insertAutomationPricing, insertSocialMediaPricing } from '../src/site/fiyat-bolumu.js';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const textExtensions = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.svg', '.md']);
const generatedFiles = new Set(['robots.txt', 'sitemap.xml', 'site-data.js', 'CNAME', '.nojekyll']);

function inside(root, target, name) {
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    throw new Error(`${name} must be a child directory of the project: ${target}`);
  }
  return target;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function json(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function normalizeBase(value = '') {
  if (!value || value === '/') return '';
  const normalized = `/${String(value).replace(/^\/+|\/+$/g, '')}`;
  if (!/^\/[A-Za-z0-9._~!$&'()+,;=@%/-]+$/.test(normalized) || normalized.split('/').includes('..')) {
    throw new Error(`Invalid base path: ${value}`);
  }
  return normalized;
}

function resolveValue(scope, root, token) {
  if (token === 'this') return scope;
  const lookup = object => token.split('.').reduce((value, key) => value == null ? undefined : value[key], object);
  const local = lookup(scope);
  return local === undefined ? lookup(root) : local;
}

// A small structural parser allows nested loops without eval or runtime templating.
function templateNodes(source) {
  const root = [];
  const stack = [root];
  const tags = /{{\s*([^{}]+?)\s*}}/g;
  let previous = 0, match;
  while ((match = tags.exec(source))) {
    stack.at(-1).push({ text: source.slice(previous, match.index) });
    const token = match[1].trim();
    if (token.startsWith('#each ')) {
      const node = { each: token.slice(6).trim(), children: [] };
      stack.at(-1).push(node);
      stack.push(node.children);
    } else if (token === '/each') {
      if (stack.length === 1) throw new Error('Unexpected {{/each}}');
      stack.pop();
    } else {
      stack.at(-1).push({ token });
    }
    previous = tags.lastIndex;
  }
  if (stack.length !== 1) throw new Error('Unclosed {{#each}} block');
  stack[0].push({ text: source.slice(previous) });
  return root;
}

function render(source, context, raw, filename) {
  function visit(nodes, scope) {
    return nodes.map(node => {
      if ('text' in node) return node.text;
      if (node.each) {
        const values = resolveValue(scope, context, node.each);
        if (!Array.isArray(values)) throw new Error(`${filename}: ${node.each} must be an array`);
        return values.map((item, index) => visit(node.children, {
          ...(item && typeof item === 'object' ? item : { value: item }),
          this: item, '@index': index, '@number': index + 1
        })).join('');
      }
      if (Object.hasOwn(raw, node.token)) return raw[node.token];
      const value = node.token === 'this' && Object.hasOwn(scope, 'this') ? scope.this : resolveValue(scope, context, node.token);
      if (value === undefined) throw new Error(`${filename}: unknown template token {{${node.token}}}`);
      if (value !== null && typeof value === 'object') throw new Error(`${filename}: {{${node.token}}} is an object; select a field or use an each block`);
      return escapeHtml(value);
    }).join('');
  }
  return visit(templateNodes(source), context);
}

function atBase(url, base) {
  if (!base || !url.startsWith('/') || url.startsWith('//') || url === base || url.startsWith(`${base}/`) || url.startsWith(`${base}#`) || url.startsWith(`${base}?`)) return url;
  return `${base}${url}`;
}

function rewritePaths(source, extension, base) {
  if (!base) return source;
  if (extension === '.html' || extension === '.svg') {
    source = source.replace(/\b(href|src|action|poster|data-src)=(['"])(\/[^'"<>]*?)\2/gi,
      (_, attribute, quote, url) => `${attribute}=${quote}${atBase(url, base)}${quote}`);
    source = source.replace(/\bsrcset=(['"])([^'"<>]+)\1/gi, (_, quote, value) => `srcset=${quote}${value.split(',').map(part => part.trim().split(/\s+/).map((piece, index) => index === 0 ? atBase(piece, base) : piece).join(' ')).join(', ')}${quote}`);
  }
  if (extension === '.css' || extension === '.html' || extension === '.svg') {
    source = source.replace(/url\(\s*(['"]?)(\/[^)'"\s]+)\1\s*\)/gi, (_, quote, url) => `url(${quote}${atBase(url, base)}${quote})`);
  }
  if (extension === '.js' || extension === '.mjs' || extension === '.json' || extension === '.html') {
    source = source.replace(/(['"])(\/(?!\/)[^'"\r\n]*?)\1/g, (_, quote, url) => `${quote}${atBase(url, base)}${quote}`);
  }
  return source;
}

function schemaContext(config, origin) {
  const business = config.business;
  const postal = address => Object.fromEntries(Object.entries({
    '@type': 'PostalAddress', streetAddress: address.streetAddress,
    addressLocality: address.addressLocality, addressRegion: address.addressRegion,
    addressCountry: address.addressCountry
  }).filter(([, value]) => value != null && value !== ''));
  const organization = {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${origin}/#organization`,
    name: business.name, description: business.description, url: `${origin}/`, telephone: business.phoneE164,
    ...(business.addresses?.length ? { address: business.addresses.map(postal) } : {}),
    ...([business.instagramUrl,business.xUrl,business.facebookUrl].some(Boolean) ? { sameAs: [business.instagramUrl,business.xUrl,business.facebookUrl].filter(Boolean) } : {}),
    ...(config.organization || {})
  };
  const softwareInput = config.softwareApplication || config.software;
  const software = softwareInput ? {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', ...softwareInput,
    publisher: softwareInput.publisher || { '@id': organization['@id'] }
  } : null;
  const addressesHtml = (business.addresses || []).map(address => `<address class="business-address">${address.label ? `<strong>${escapeHtml(address.label)}</strong>` : ''}<span>${escapeHtml(address.streetAddress)}</span><span>${escapeHtml(address.addressLocality)} / ${escapeHtml(address.addressRegion)}</span></address>`).join('\n');
  const faqHtml = (config.faq || []).map(item => `<details><summary>${escapeHtml(item.question)}<span aria-hidden="true">+</span></summary><p>${escapeHtml(item.answer)}</p></details>`).join('\n');
  return { organization, software, addressesHtml, faqHtml };
}

async function filesUnder(directory, root = directory) {
  const found = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported in the publish tree: ${absolute}`);
    if (entry.isDirectory()) found.push(...await filesUnder(absolute, root));
    else if (entry.isFile()) found.push(path.relative(root, absolute).split(path.sep).join('/'));
  }
  return found.sort();
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(['"])(.*?)\2/g)].map(match => [match[1].toLowerCase(), match[3]]));
}

function sitemapUrl(html, relative, origin) {
  if (relative === '404.html') return null;
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  if (meta.some(item => ['robots', 'googlebot'].includes((item.name || '').toLowerCase()) && /\bnoindex\b/i.test(item.content || ''))) return null;
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).find(item => (item.rel || '').toLowerCase() === 'canonical');
  const fallback = `/${relative.replace(/(^|\/)index\.html$/, '$1')}`;
  return canonical?.href || `${origin}${fallback}`;
}

function bundleStyles(html, styles, base) {
  if (!styles.length) return html;
  let inserted = false;
  return html.replace(/<link\b[^>]*>/gi, tag => {
    const attrs = attributes(tag);
    if ((attrs.rel || '').toLowerCase() !== 'stylesheet') return tag;
    const href = (attrs.href || '').split(/[?#]/)[0].replace(/^\.\//, '').replace(/^\//, '');
    if (!styles.includes(href)) return tag;
    if (inserted) return '';
    inserted = true;
    return `<link rel="stylesheet" href="${base}/site.css">`;
  });
}

export async function buildSite(options = {}) {
  const root = path.resolve(options.projectRoot || defaultRoot);
  const source = inside(root, path.resolve(root, options.sourceDir || 'src/site'), 'Source directory');
  const output = inside(root, path.resolve(root, options.outputDir || 'dist'), 'Output directory');
  if (source === output || source.startsWith(`${output}${path.sep}`) || output.startsWith(`${source}${path.sep}`)) throw new Error('Source and output directories must be separate');
  const configPath = path.join(root, 'bilgiler.js');
  const { default: config } = await import(`${pathToFileURL(configPath).href}?build=${randomUUID()}`);
  if (!config?.business?.name || !config.business.domain) throw new Error('bilgiler.js must export business.name and business.domain');
  const domain = new URL(/^https?:\/\//.test(config.business.domain) ? config.business.domain : `https://${config.business.domain}`);
  if (!['http:', 'https:'].includes(domain.protocol) || domain.pathname !== '/' || domain.search || domain.hash || domain.username || domain.password) throw new Error('business.domain must be a site origin, without a path or credentials');
  const origin = domain.origin;
  const base = normalizeBase(options.basePath ?? config.build?.basePath ?? '');
  const articleContent = await loadArticles({root,source,origin,businessName:config.business.name});
  const sourceFiles = [...await filesUnder(source), ...articleContent.pages.keys()].sort();
  for(const name of sourceFiles)if(/(?:^|\/)(?:\.env(?:\..*)?|id_rsa|[^/]+\.(?:pem|key|pfx|p12))$/i.test(name)||name.split('/').includes('.git'))throw new Error('Sensitive/non-public file in source: '+name);
  if (!sourceFiles.includes('index.html')) throw new Error('src/site/index.html is required; existing dist has not been changed');
  const styles = (config.build?.styles || []).map(name => String(name).replace(/^\.\//, '').replace(/^\//, ''));
  for (const style of styles) if (!sourceFiles.includes(style) || path.extname(style) !== '.css') throw new Error(`Missing CSS bundle input: ${style}`);
  const links = {
    phone: `tel:${config.business.phoneE164 || ''}`,
    whatsapp: `https://wa.me/${config.business.whatsappNumber || String(config.business.phoneE164 || '').replace(/\D/g, '')}`,
    instagram: config.business.instagramUrl || '',
    x: config.business.xUrl || '',
    facebook: config.business.facebookUrl || ''
  };
  const schemas = schemaContext(config, origin);
  const publicData = {
    business: config.business, references: config.references || [], pricing: config.pricing || [], automationPricing: config.automationPricing || null, socialMediaPricing: config.socialMediaPricing || null,
    services: config.services || [], faq: config.faq || [], links,
    softwareApplication: schemas.software,
    site: { origin, basePath: base }
  };
  const context = {
    ...config, links, site: publicData.site,
    software: config.softwareApplication || config.software || {},
    referencesById: Object.fromEntries((config.references || []).map(item => [item.id, item])),
    pricingById: Object.fromEntries((config.pricing || []).map(item => [item.id, item]))
  };
  const raw = {
    organizationSchema: json(schemas.organization),
    softwareSchema: schemas.software ? json(schemas.software) : 'null',
    addressesHtml: schemas.addressesHtml, faqHtml: schemas.faqHtml,
    pricingSection: pricingSection(config),
    articleCards: articleContent.cards,
    legalIdentityHtml: legalIdentityHtml(config),
    articleLatestCards: articleContent.latestCards,
    siteDataJson: json(publicData)
  };
  const working = inside(root, path.join(root, '.build'), 'Build work directory');
  const stage = inside(root, path.join(working, `stage-${randomUUID()}`), 'Build stage');
  const backup = inside(root, path.join(working, `previous-${randomUUID()}`), 'Build backup');
  await fs.mkdir(stage, { recursive: true });
  const urls = [], generated = [];
  let previousMoved = false;
  try {
    for (const relative of sourceFiles) {
      if (generatedFiles.has(relative) || styles.includes(relative) || ['AGENTS.md','README.md'].includes(path.basename(relative))) continue;
      const destination = path.join(stage, ...relative.split('/'));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      const extension = path.extname(relative).toLowerCase();
      if (textExtensions.has(extension)) {
        let content = render(articleContent.pages.get(relative) ?? await fs.readFile(path.join(source, ...relative.split('/')), 'utf8'), context, raw, relative);
        if (extension === '.html') {
          if(relative==='rehber/index.html') content = decorateArticleCategories(content);
          content = injectLeadConsent(content, config);
          if (relative!=='404.html' && !content.includes('data-shared-pricing')) content = content.replace(/<\/main>/i, pricingSection(config) + '\n</main>');
          content = insertAutomationPricing(content, config, relative);
          content = insertSocialMediaPricing(content, config, relative);
          if (config.pricing?.length) content = content.replace('</head>', '<link rel="stylesheet" href="/fiyat-bolumu.css">\n</head>');
          content = bundleStyles(content, styles, base);
          content = content.replace(/<head>([\s\S]*?)<\/head>/i, (_, head) => '<head>' + head.replace(/\r?\n(?:[ \t]*\r?\n)+/g, '\n') + '</head>');
        }
        content = rewritePaths(content, extension, base);
        if(extension==='.html')content=addSecurityPolicy(content);
        await fs.writeFile(destination, content, 'utf8');
        if (extension === '.html') {
          const url = sitemapUrl(content, relative, origin);
          if (url) urls.push(url);
        }
      } else {
        await fs.copyFile(path.join(source, ...relative.split('/')), destination);
      }
      generated.push(relative);
    }
    if (styles.length) {
      const chunks = [];
      for (const style of styles) chunks.push(`/* Source: ${style} */\n${render(await fs.readFile(path.join(source, ...style.split('/')), 'utf8'), context, raw, style)}`);
      await fs.writeFile(path.join(stage, 'site.css'), rewritePaths(chunks.join('\n\n'), '.css', base), 'utf8');
      generated.push('site.css');
    }
    const bots = config.bots || ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Googlebot', 'Bingbot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'CCBot', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'Amazonbot'];
    if (!Array.isArray(bots) || bots.some(bot => /[\r\n]/.test(String(bot)))) throw new Error('bots must be an array of crawler agent names');
    const robots = ['User-agent: *\nAllow: /', ...bots.filter(bot => bot !== '*').map(bot => `User-agent: ${bot}\nAllow: /`), `Sitemap: ${origin}/sitemap.xml`].join('\n\n') + '\n';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].sort().map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
    await fs.writeFile(path.join(stage, 'robots.txt'), robots, 'utf8');
    await fs.writeFile(path.join(stage, 'sitemap.xml'), sitemap, 'utf8');
    await fs.writeFile(path.join(stage, 'site-data.js'), `// Generated from bilgiler.js. Change the source file and rebuild.\nwindow.HD_MEDYA = Object.freeze(${json(publicData)});\n`, 'utf8');
    await fs.writeFile(path.join(stage, '.nojekyll'), '');
    generated.push('robots.txt', 'sitemap.xml', 'site-data.js', '.nojekyll');
    if (config.build?.cname !== false) {
      await fs.writeFile(path.join(stage, 'CNAME'), `${domain.hostname}\n`, 'utf8');
      generated.push('CNAME');
    }
    const result = { source, output, origin, articlePages: articleContent.pages.size, basePath: base, htmlPages: sourceFiles.filter(file => file.endsWith('.html')).length, sitemapUrls: [...new Set(urls)].sort(), files: generated.length };
    if (options.check) return { ...result, checkedOnly: true };
    // Both move targets were checked above to stay inside this named project.
    try { await fs.rename(output, backup); previousMoved = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await fs.rename(stage, output); } catch (error) {
      if (previousMoved) await fs.rename(backup, output);
      throw error;
    }
    if (previousMoved) await fs.rm(backup, { recursive: true, force: true });
    return result;
  } finally {
    // stage is an explicit UUID child of the verified project-local .build path.
    await fs.rm(stage, { recursive: true, force: true });
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2), options = {};
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--base-path') options.basePath = args[++index] ?? '';
    else if (args[index] === '--out-dir') options.outputDir = args[++index];
    else if (args[index] === '--check') options.check = true;
    else throw new Error(`Unknown option: ${args[index]}`);
  }
  try { console.log(JSON.stringify(await buildSite(options), null, 2)); }
  catch (error) { console.error(`Static build failed: ${error.message}`); process.exitCode = 1; }
}

