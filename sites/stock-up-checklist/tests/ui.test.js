import test from'node:test';import assert from'node:assert/strict';import{readFile}from'node:fs/promises';
const html=await readFile(new URL('../src/index.html',import.meta.url),'utf8'),css=await readFile(new URL('../src/styles.css',import.meta.url),'utf8'),app=await readFile(new URL('../src/js/app.js',import.meta.url),'utf8');
test('page has semantic controls and live feedback',()=>{for(const token of['id="chooser-title"','id="progress-meter"','id="custom-input"','maxlength="80"','role="status"','id="reset"','id="print"','id="copy"','id="share"'])assert.ok(html.includes(token),token)});
test('app uses safe DOM text rendering',()=>{assert.ok(app.includes('.textContent='));assert.doesNotMatch(app,/\.innerHTML\s*=|insertAdjacentHTML/)});
test('responsive, reduced-motion and print rules exist',()=>{assert.match(css,/@media\(max-width:340px\)/);assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media print/);assert.match(css,/break-inside:avoid/)});
