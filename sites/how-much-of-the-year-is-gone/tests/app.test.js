import test from 'node:test';
import assert from 'node:assert/strict';

class FakeElement {
  constructor(){this.textContent='';this.innerHTML='';this.children=[];this.dataset={};this.className='';this.attributes={};this.listeners={}}
  replaceChildren(...children){this.children=children}
  setAttribute(name,value){this.attributes[name]=value}
  addEventListener(name,handler){this.listeners[name]=handler}
}

test('rendered UI updates percentage, facts, day grid, and New Year state',async()=>{
  const ids=['percentage','current-year','accessible-summary','completed-days','remaining-days','year-grid','grid-label','live-facts','milestones','share-button','share-status','local-zone'];
  const elements=Object.fromEntries(ids.map(id=>[id,new FakeElement()]));
  const rootStyle={value:'',setProperty(name,value){if(name==='--progress')this.value=value}};
  globalThis.document={getElementById:id=>elements[id],createElement:()=>new FakeElement(),documentElement:{style:rootStyle}};
  let shared;
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{share:async payload=>{shared=payload}}});
  Object.defineProperty(globalThis,'location',{configurable:true,value:{href:'https://year.test/'}});
  const originalInterval=globalThis.setInterval;
  globalThis.setInterval=()=>0;
  const {render}=await import('../src/js/app.js');
  const first=render(new Date(2024,1,29,12));
  assert.equal(elements['current-year'].textContent,2024);
  assert.equal(elements['year-grid'].children.length,366);
  assert.equal(elements['year-grid'].children.filter(cell=>cell.className==='day day--today').length,1);
  assert.match(elements['live-facts'].innerHTML,/leap year/);
  const shown=Number(elements.percentage.textContent);
  render(new Date(2024,1,29,12,0,1));
  assert.ok(Number(elements.percentage.textContent)>shown);
  const next=render(new Date(2025,0,1));
  assert.equal(first.year,2024);assert.equal(next.year,2025);
  assert.equal(elements['current-year'].textContent,2025);
  assert.equal(elements['year-grid'].children.length,365);
  assert.equal(elements['year-grid'].children[0].className,'day day--today');
  assert.equal(elements['completed-days'].textContent,0);
  assert.equal(elements['remaining-days'].textContent,364);
  assert.match(elements['accessible-summary'].textContent,/0\.00% of 2025/);
  assert.equal(rootStyle.value,'0%');
  assert.equal(typeof elements['share-button'].listeners.click,'function');
  await elements['share-button'].listeners.click();
  assert.match(shared.text,/\d+\.\d{2}% of \d{4} is already gone/);
  assert.equal(shared.url,'https://year.test/');
  globalThis.setInterval=originalInterval;
});
