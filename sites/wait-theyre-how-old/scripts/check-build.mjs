import{access,readFile,readdir,stat}from'node:fs/promises';
import{join}from'node:path';

const required=['index.html','privacy/index.html','404.html','robots.txt','sitemap.xml','styles.css','runtime-config.js','js/app.js','js/age.js','js/search.js','js/celebrities.js','js/integrations.js','js/year.js','assets/icon.svg','assets/social-card.svg','site.webmanifest'];
await Promise.all(required.map(file=>access(join('dist',file))));

async function filesIn(directory){
  const files=[];
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const path=join(directory,entry.name);
    if(entry.isDirectory())files.push(...await filesIn(path));
    else files.push(path);
  }
  return files;
}

for(const path of await filesIn('src')){
  const content=await readFile(path,'utf8');
  if(content.includes('{{CURRENT_YEAR}}'))throw new Error(`Current-year placeholder in ${path}`);
  const unexpected=content.match(/{{(?!SITE_URL}})[^{}]+}}/);
  if(unexpected)throw new Error(`Unresolved source template token ${unexpected[0]} in ${path}`);
}

const html=await readFile('dist/index.html','utf8');
for(const[name,re]of[['title',/<title>/],['description',/meta name="description"/],['canonical',/rel="canonical"/],['Open Graph',/property="og:title"/],['Twitter',/name="twitter:card"/],['structured data',/application\/ld\+json/],['combobox',/role="combobox"/],['listbox',/role="listbox"/],['privacy',/href="\/privacy\/"/]])if(!re.test(html))throw new Error(`Missing ${name}`);
for(const file of required.filter(file=>/\.(html|txt|xml|js)$/.test(file))){
  const content=await readFile(join('dist',file),'utf8');
  if(/{{[^{}]+}}/.test(content))throw new Error(`Unresolved template token in ${file}`);
  if(/example\.com|\.invalid|YOUR[_-](?:ID|KEY)/.test(content))throw new Error(`Placeholder in ${file}`);
}

const privacy=await readFile('dist/privacy/index.html','utf8');
const yearScript=await readFile('dist/js/year.js','utf8');
if((html.match(/data-current-year/g)||[]).length!==2)throw new Error('Main page year hooks are missing');
if(!privacy.includes('data-current-year')||!privacy.includes('src="/js/year.js"'))throw new Error('Privacy page dynamic year is missing');
if(!/new Date\(\)\.getFullYear\(\)/.test(yearScript))throw new Error('Dynamic current-year rendering is missing');
const app=await readFile('dist/js/app.js','utf8');
if(!app.includes("import'./year.js'"))throw new Error('Main app does not load current-year rendering');
if(/\.innerHTML\s*=|insertAdjacentHTML/.test(app))throw new Error('Unsafe HTML rendering');
const social=await readFile('dist/assets/social-card.svg','utf8');
if(!/width="1200" height="630"/.test(social))throw new Error('Bad social image size');
async function total(directory){let size=0;for(const entry of await readdir(directory,{withFileTypes:true}))size+=entry.isDirectory()?await total(join(directory,entry.name)):(await stat(join(directory,entry.name))).size;return size}
console.log(`Build checks passed. Dist size: ${(await total('dist')/1024).toFixed(1)} KiB.`);
