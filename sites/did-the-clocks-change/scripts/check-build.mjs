import { access, readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const required = ['index.html','privacy/index.html','404.html','robots.txt','sitemap.xml','styles.css','runtime-config.js','js/app.js','js/transitions.js','js/timezones.js','assets/icon.svg','assets/social-card.jpg','site.webmanifest'];
await Promise.all(required.map(file => access(join('dist', file))));
const html = await readFile('dist/index.html','utf8');
for (const [name, pattern] of [
  ['title',/<title>[^<]+<\/title>/],['description',/<meta name="description" content="[^"]+"/],['canonical',/<link rel="canonical" href="(?:https:\/\/[^"}]+|\/)"/],
  ['Open Graph',/property="og:title"/],['Twitter card',/name="twitter:card"/],['main heading',/<h1[ >]/],['structured data',/application\/ld\+json/],['timezone control',/id="zone-input"/]
]) if (!pattern.test(html)) throw new Error(`Missing ${name}`);

for (const file of required.filter(file => /\.(?:html|txt|xml|js)$/.test(file))) {
  const content = await readFile(join('dist',file),'utf8');
  if (/{{(?:SITE_URL|CURRENT_YEAR)}}/.test(content)) throw new Error(`Unresolved build token in ${file}`);
  if (/localhost|127\.0\.0\.1|example\.com|\.invalid/.test(content)) throw new Error(`Placeholder/local URL in ${file}`);
  if (/G-[A-Z0-9]{8,}|ca-pub-\d+/.test(content)) throw new Error(`Unexpected tracking or advertising identifier in ${file}`);
}
const config = JSON.parse(await readFile('site.config.json','utf8'));
if (!config.siteUrl) {
  if (/(?:rel="canonical" href|property="og:(?:url|image)" content|name="twitter:image" content)="https:\/\//.test(html)) throw new Error('Unconfigured build contains an absolute production metadata URL');
  if ((await readFile('dist/sitemap.xml','utf8')).includes('<loc>')) throw new Error('Unconfigured sitemap contains a URL');
}
const social = await stat('dist/assets/social-card.jpg');
if (social.size < 20_000 || social.size > 500_000) throw new Error('Social image appears incomplete or insufficiently optimized');
async function total(dir) { let bytes=0; for (const entry of await readdir(dir,{withFileTypes:true})) bytes += entry.isDirectory() ? await total(join(dir,entry.name)) : (await stat(join(dir,entry.name))).size; return bytes; }
console.log(`Build checks passed: required files, metadata, placeholders, and integrations verified. Dist size: ${(await total('dist')/1024).toFixed(1)} KiB.`);
