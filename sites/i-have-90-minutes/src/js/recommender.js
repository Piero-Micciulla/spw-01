import { BUDGETS, CATEGORIES } from './catalog.js';

const idPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function normalizeTitle(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,' ');}

const titleStopWords=new Set(['a','an','and','at','for','from','in','of','on','one','or','the','to','with','your']);
export function findNearDuplicateTitles(items){
  const tokenSets=items.map(item=>new Set(normalizeTitle(item?.title).split(' ').filter(word=>word&&!titleStopWords.has(word))));
  const matches=[];
  for(let left=0;left<items.length;left++)for(let right=left+1;right<items.length;right++){
    const a=tokenSets[left],b=tokenSets[right];
    if(Math.min(a.size,b.size)<3)continue;
    const shared=[...a].filter(word=>b.has(word)).length;
    const similarity=shared/new Set([...a,...b]).size;
    if(similarity>=.8)matches.push([items[left].id,items[right].id]);
  }
  return matches;
}

export function coverageMatrix(items){
  return Object.fromEntries(CATEGORIES.map(category=>[category,Object.fromEntries(BUDGETS.map(budget=>[budget,eligibleActivities(items,budget,category).length]))]));
}

export function validateActivities(items,{minimumActivities=150,minimumCoverage=15}={}){
  const errors=[],ids=new Set(),titles=new Set();
  if(!Array.isArray(items)||!items.length)return ['catalog: must be a non-empty array'];
  if(items.length<minimumActivities)errors.push(`catalog: requires at least ${minimumActivities} activities`);
  items.forEach((item,index)=>{
    const at=`activity ${index+1}`;
    if(!item||typeof item!=='object'){errors.push(`${at}: must be an object`);return;}
    if(!idPattern.test(item.id||''))errors.push(`${at}: invalid id`);
    if(ids.has(item.id))errors.push(`${at}: duplicate id ${item.id}`); else ids.add(item.id);
    if(typeof item.title!=='string'||!item.title.trim()||/[<>\u0000-\u001f]/.test(item.title)||/lorem|todo|tbd|placeholder/i.test(item.title))errors.push(`${at}: invalid title`);
    const normalized=normalizeTitle(item.title);
    if(titles.has(normalized))errors.push(`${at}: duplicate normalized title`); else titles.add(normalized);
    if(!CATEGORIES.includes(item.category))errors.push(`${at}: invalid category`);
    if(![item.minMinutes,item.idealMinutes,item.maxMinutes].every(Number.isInteger)||item.minMinutes<=0||item.minMinutes>item.idealMinutes||item.idealMinutes>item.maxMinutes||item.maxMinutes>240)errors.push(`${at}: invalid durations`);
    if(typeof item.note!=='string'||!item.note.trim()||/[<>\u0000-\u001f]/.test(item.note)||/lorem|todo|tbd|placeholder/i.test(item.note))errors.push(`${at}: invalid note`);
  });
  if(!errors.length){
    for(const [left,right] of findNearDuplicateTitles(items))errors.push(`near-duplicate titles: ${left} and ${right}`);
    const matrix=coverageMatrix(items);
    for(const category of CATEGORIES)for(const budget of BUDGETS)if(matrix[category][budget]<minimumCoverage)errors.push(`${category} at ${budget} minutes: insufficient coverage`);
  }
  return errors;
}

export function eligibleActivities(items,minutes,category='anything'){
  if(!BUDGETS.includes(minutes))return [];
  const cleanCategory=category==='anything'||CATEGORIES.includes(category)?category:'anything';
  return items.filter(item=>minutes>=item.minMinutes&&minutes<=item.maxMinutes&&(cleanCategory==='anything'||item.category===cleanCategory));
}

export function pickActivity(pool,history=[],random=Math.random){
  if(!Array.isArray(pool)||!pool.length)return null;
  const poolIds=new Set(pool.map(item=>item.id));
  const seen=new Set(history.filter(id=>poolIds.has(id)));
  let choices=pool.filter(item=>!seen.has(item.id));
  if(!choices.length)choices=pool.filter(item=>item.id!==history.at(-1));
  if(!choices.length)choices=pool;
  const value=Math.max(0,Math.min(.999999,Number(random())||0));
  return choices[Math.floor(value*choices.length)];
}

export function nextHistory(history,id,poolSize){
  const clean=Array.isArray(history)?history.filter(value=>typeof value==='string'):[];
  return [...clean.slice(-Math.max(0,poolSize-1)).filter(value=>value!==id),id];
}

export function parseUrlState(search,items){
  const params=new URLSearchParams(search||'');
  const numeric=Number(params.get('minutes'));
  const minutes=BUDGETS.includes(numeric)?numeric:90;
  const rawCategory=params.get('category');
  const category=CATEGORIES.includes(rawCategory)?rawCategory:'anything';
  const rawActivity=params.get('activity');
  const activity=items.find(item=>item.id===rawActivity&&eligibleActivities(items,minutes,category).includes(item))||null;
  return {minutes,category,activity};
}

export function shareText(activity,minutes){
  return `I had ${minutes} minutes. The internet told me to ${activity.title.charAt(0).toLowerCase()}${activity.title.slice(1)}.`;
}
