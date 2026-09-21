export const pointsFor=hints=>Math.max(0,6-hints);
export function shuffled(items,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
export function createSession(puzzles,random=Math.random){
 const state={puzzles,random,category:'Everything',deck:[],seen:new Set(),current:null,hint:0,phase:'intro',intent:null,stats:{played:0,solved:0,score:0,hintsTotal:0,best:null}};
 const categoryPool=()=>state.category==='Everything'?state.puzzles:state.puzzles.filter(p=>p.category===state.category);const eligible=()=>categoryPool().filter(p=>!state.seen.has(p.id));
 const refill=avoid=>{let pool=eligible();if(!pool.length){state.seen.clear();pool=categoryPool()}state.deck=shuffled(pool,state.random);if(state.deck.length>1&&state.deck.at(-1)?.id===avoid){[state.deck[0],state.deck[state.deck.length-1]]=[state.deck.at(-1),state.deck[0]]}};
 const begin=puzzle=>{state.current=puzzle||state.deck.pop();state.seen.add(state.current.id);state.hint=1;state.phase='playing';state.intent=null;return state.current};
 return Object.assign(state,{
  start(puzzle){if(puzzle)return begin(puzzle);if(!state.deck.length)refill(state.current?.id);return begin()},
  nextHint(){if(state.phase==='playing'&&state.hint<5)state.hint++;return state.hint},
  know(){if(state.phase==='playing'){state.phase='reveal';state.intent='claim'}},
  giveUp(){if(state.phase==='playing'&&state.hint===5){state.phase='result';state.intent='gave-up';state.stats.played++}},
  judge(correct){if(state.phase!=='reveal'||state.intent!=='claim')return;state.stats.played++;if(correct){const points=pointsFor(state.hint);state.stats.solved++;state.stats.score+=points;state.stats.hintsTotal+=state.hint;state.stats.best=state.stats.best===null?state.hint:Math.min(state.stats.best,state.hint);state.intent='solved'}else state.intent='missed';state.phase='result'},
  setCategory(category){state.category=category;state.deck=[];state.seen.clear();state.current=null;state.hint=0;state.phase='intro';state.intent=null},
  shareText(url=globalThis.location?.href||''){const marks=state.intent==='solved'?`${'💡'.repeat(state.hint)}${'▫️'.repeat(5-state.hint)}`:'▫️▫️▫️▫️▫️';const result=state.intent==='solved'?`Got it after ${state.hint} hint${state.hint===1?'':'s'}.`:'This one got me.';return `One More Hint\n${marks}\n${result}\nCan you?\n${url}`}
 })
}
