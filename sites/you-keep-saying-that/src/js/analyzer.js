import{STOP_WORDS}from'./stop-words.js';

export const MIN_INSIGHT_WORDS=40;
const WORD_RE=/[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*/gu;
const SENTENCE_END=/[.!?。！？]+(?:[”’"')\]]+)?(?=\s|$)/gu;
const PHRASE_CONNECTORS=new Set(['a','an','and','as','at','by','for','from','i','in','into','of','on','or','that','the','to','with','you']);

export function normalizeWord(value){return value.normalize('NFKC').toLocaleLowerCase('en-US').replaceAll('’',"'")}

export function tokenize(text){
  return[...text.matchAll(WORD_RE)].map((match,index)=>({raw:match[0],normalized:normalizeWord(match[0]),start:match.index,end:match.index+match[0].length,index}));
}

export function basicStats(text,tokens=tokenize(text)){
  const words=tokens.length,trimmed=text.trim();
  let sentences=0;
  if(trimmed){sentences=[...trimmed.matchAll(SENTENCE_END)].length;if(!sentences)sentences=trimmed.split(/\n\s*\n|\n(?=[\p{Lu}\p{Lt}\p{N}])/u).filter(Boolean).length||1}
  return{words,characters:text.length,sentences,readingMinutes:words?Math.max(1,Math.ceil(words/225)):0,uniqueWords:new Set(tokens.map(token=>token.normalized)).size};
}

function isMeaningful(token){return token.normalized.length>1&&!STOP_WORDS.has(token.normalized)&&!/^[\p{N}]+$/u.test(token.normalized)}

export function rankWords(tokens,totalWords=tokens.length){
  const groups=new Map();
  for(const token of tokens){if(!isMeaningful(token))continue;const item=groups.get(token.normalized)||{type:'word',key:token.normalized,label:token.raw.toLocaleLowerCase('en-US'),count:0,positions:[],ranges:[]};item.count++;item.positions.push(token.index);item.ranges.push([token.start,token.end]);groups.set(token.normalized,item)}
  return[...groups.values()].filter(item=>item.count>=2).map(item=>{
    const gaps=item.positions.slice(1).map((position,index)=>position-item.positions[index]);
    const density=item.count/Math.max(totalWords,1);
    // Count establishes evidence; density and tight spacing break ties toward noticeable habits.
    const concentration=gaps.length?1/(Math.min(...gaps)+4):0;
    return{...item,percent:density*100,every:Math.round(totalWords/item.count),score:item.count*(1+density*12+concentration*5)}
  }).sort((a,b)=>b.score-a.score||b.count-a.count||a.key.localeCompare(b.key));
}

function crossesBoundary(text,left,right){return/[.!?。！？;:\n]/u.test(text.slice(left.end,right.start))}
function usefulPhrase(words){const meaningful=words.filter(word=>!STOP_WORDS.has(word)).length;return meaningful>=1&&(meaningful/words.length>=.34||words.some(word=>!PHRASE_CONNECTORS.has(word)))}

export function rankPhrases(text,tokens,totalWords=tokens.length){
  const groups=new Map();
  for(let size=2;size<=4;size++)for(let index=0;index<=tokens.length-size;index++){
    const span=tokens.slice(index,index+size);let broken=false;for(let cursor=1;cursor<span.length;cursor++)if(crossesBoundary(text,span[cursor-1],span[cursor]))broken=true;
    const words=span.map(token=>token.normalized);if(broken||!usefulPhrase(words))continue;
    const key=words.join(' '),item=groups.get(key)||{type:'phrase',key,label:span.map(token=>token.raw).join(' '),size,count:0,positions:[],ranges:[]};
    item.count++;item.positions.push(index);item.ranges.push([span[0].start,span.at(-1).end]);groups.set(key,item);
  }
  const candidates=[...groups.values()].filter(item=>item.count>=3).map(item=>({...item,percent:item.count*item.size/Math.max(totalWords,1)*100,every:Math.round(totalWords/item.count),score:item.count*item.size*(1+item.count*item.size/Math.max(totalWords,1))})).sort((a,b)=>b.score-a.score||b.size-a.size||b.count-a.count);
  const selected=[];
  for(const candidate of candidates){
    const redundant=selected.some(chosen=>chosen.count===candidate.count&&(chosen.key.includes(candidate.key)||candidate.key.includes(chosen.key)));
    if(!redundant)selected.push(candidate);
  }
  return selected.sort((a,b)=>b.score-a.score||b.size-a.size).slice(0,5);
}

export function nearbyRepeats(tokens,maxGap=12){
  const previous=new Map(),results=[];
  for(const token of tokens){if(!isMeaningful(token))continue;const prior=previous.get(token.normalized);if(prior!==undefined){const distance=token.index-prior;if(distance<=maxGap)results.push({word:token.normalized,distance,first:prior,second:token.index})}previous.set(token.normalized,token.index)}
  return results.sort((a,b)=>a.distance-b.distance||a.first-b.first).slice(0,3);
}

export function analyzeText(text){
  const tokens=tokenize(text),stats=basicStats(text,tokens),eligible=stats.words>=MIN_INSIGHT_WORDS;
  const words=eligible?rankWords(tokens,stats.words).slice(0,8):[];
  const phrases=eligible?rankPhrases(text,tokens,stats.words):[];
  const nearby=eligible?nearbyRepeats(tokens):[];
  const top=[...words,...phrases].sort((a,b)=>b.score-a.score)[0]||null;
  return{text,tokens,stats,eligible,words,phrases,nearby,top};
}

export function rangesFor(result){return result?.ranges||[]}

export function summaryFor(analysis){
  const lines=['You Keep Saying That','',`${analysis.stats.words} words`];
  if(analysis.words.length){lines.push('','Most repeated meaningful words:');for(const item of analysis.words.slice(0,5))lines.push(`${item.label} — ${item.count}×`)}
  if(analysis.phrases.length){lines.push('','Repeated phrases:');for(const item of analysis.phrases)lines.push(`“${item.label}” — ${item.count}×`)}
  return lines.join('\n');
}
