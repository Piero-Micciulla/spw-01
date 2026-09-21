import { activities, BUDGETS } from './catalog.js';
import { eligibleActivities, nextHistory, parseUrlState, pickActivity, shareText, validateActivities } from './recommender.js';
import { initializeOptionalIntegrations } from './integrations.js';

const errors=validateActivities(activities);if(errors.length)throw new Error(errors.join('\n'));
initializeOptionalIntegrations(window.SITE_CONFIG);

const els={
  times:[...document.querySelectorAll('[data-minutes]')],timeButtons:[...document.querySelectorAll('[data-budget]')],
  categoryButtons:[...document.querySelectorAll('[data-category]')],run:document.querySelector('#decide'),
  result:document.querySelector('#result'),title:document.querySelector('#activity-title'),note:document.querySelector('#activity-note'),
  allocation:document.querySelector('#allocation'),used:document.querySelector('#used-minutes'),pool:document.querySelector('#pool-count'),
  another:document.querySelector('#another'),share:document.querySelector('#share'),status:document.querySelector('#share-status'),track:document.querySelector('.time-track')
};
let state=parseUrlState(location.search,activities),history=[],current=null;

function setPressed(buttons,value,key){for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset[key]===String(value)));}
function syncControls(){
  for(const label of els.times)label.textContent=state.minutes;document.documentElement.style.setProperty('--budget',state.minutes/120);
  els.track.style.setProperty('--ticks',state.minutes===120?12:state.minutes===90?9:state.minutes===60?6:state.minutes===45?9:6);
  els.track.setAttribute('aria-label',`${state.minutes} minute time budget`);
  setPressed(els.timeButtons,state.minutes,'budget');setPressed(els.categoryButtons,state.category,'category');
  const count=eligibleActivities(activities,state.minutes,state.category).length;els.pool.textContent=`${count} possible calls`;
}
function updateUrl(){
  const params=new URLSearchParams({minutes:String(state.minutes)});if(state.category!=='anything')params.set('category',state.category);if(current)params.set('activity',current.id);
  historyApi.replaceState(null,'',`${location.pathname}?${params}`);
}
const historyApi=window.history;
function render(activity,{announce=true}={}){
  current=activity;const used=Math.min(activity.idealMinutes,state.minutes);const percent=Math.max(22,Math.round(used/state.minutes*100));
  els.title.textContent=activity.title;els.note.textContent=activity.note;els.used.textContent=`${used} min suggested`;
  els.allocation.style.setProperty('--used',`${percent}%`);els.allocation.dataset.category=activity.category;
  els.result.hidden=false;els.result.setAttribute('aria-live',announce?'polite':'off');els.run.textContent='DECIDE AGAIN';
  updateUrl();
}
function choose(){const pool=eligibleActivities(activities,state.minutes,state.category);const picked=pickActivity(pool,history);if(!picked)return;history=nextHistory(history,picked.id,pool.length);render(picked);els.result.scrollIntoView({behavior:'smooth',block:'start'});}
function changeFilter(patch){state={...state,...patch};history=[];current=null;els.result.hidden=true;els.run.textContent='SURPRISE ME';els.status.textContent='';syncControls();updateUrl();}

els.timeButtons.forEach(button=>button.addEventListener('click',()=>changeFilter({minutes:Number(button.dataset.budget)})));
els.categoryButtons.forEach(button=>button.addEventListener('click',()=>changeFilter({category:button.dataset.category})));
els.run.addEventListener('click',choose);els.another.addEventListener('click',choose);
els.share.addEventListener('click',async()=>{
  if(!current)return;const text=shareText(current,state.minutes),url=location.href;
  try{if(navigator.share)await navigator.share({title:'I Have 90 Minutes',text,url});else{await navigator.clipboard.writeText(`${text} ${url}`);els.status.textContent='Copied. Decision officially shared.';}}
  catch(error){if(error.name!=='AbortError')els.status.textContent='Sharing did not work. Try copying the address bar.';}
});
syncControls();if(state.activity){history=[state.activity.id];render(state.activity,{announce:false});}
