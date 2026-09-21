import{cp,mkdir,readFile,rm,writeFile}from'node:fs/promises';import{dirname,join}from'node:path';import{fileURLToPath}from'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..'),source=join(root,'src'),output=join(root,'dist');
const config=JSON.parse(await readFile(join(root,'site.config.json'),'utf8'));const siteUrl=String(process.env.SITE_URL||config.siteUrl).replace(/\/$/,'');
if(siteUrl&&!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(siteUrl))throw new Error('siteUrl must be an https origin');
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});await cp(source,output,{recursive:true});
for(const file of['index.html','privacy/index.html','404.html','robots.txt','sitemap.xml']){const path=join(output,file);await writeFile(path,(await readFile(path,'utf8')).replaceAll('{{SITE_URL}}',siteUrl))}
if(!siteUrl){await writeFile(join(output,'robots.txt'),'User-agent: *\nAllow: /\n');await writeFile(join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n')}
await writeFile(join(output,'runtime-config.js'),`window.SITE_CONFIG=${JSON.stringify({analyticsId:config.analyticsId,adsenseClient:config.adsenseClient})};\n`);console.log(`Built static site in ${output}`);
