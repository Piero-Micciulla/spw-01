import{puzzles,categories,puzzleById}from'../src/js/puzzles.js';
const fail=message=>{throw new Error(message)},allowed=new Set(categories.slice(1)),difficulties=new Set(['easy','medium','hard']),ids=new Set(),answers=new Set(),allHints=new Map(),categoryCounts={},difficultyCounts={};let earlyLeaks=0;
const normalize=value=>value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
if(puzzles.length<200)fail(`Need at least 200 puzzles, found ${puzzles.length}`);
for(const puzzle of puzzles){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(puzzle.id)||ids.has(puzzle.id))fail(`Invalid or duplicate ID: ${puzzle.id}`);ids.add(puzzle.id);
 const answer=normalize(puzzle.answer);if(!answer||answers.has(answer))fail(`Empty or duplicate answer: ${puzzle.answer}`);answers.add(answer);
 if(!allowed.has(puzzle.category))fail(`Invalid category: ${puzzle.id}`);if(!difficulties.has(puzzle.difficulty))fail(`Invalid difficulty: ${puzzle.id}`);
 if(!puzzle.descriptor?.trim())fail(`Missing descriptor: ${puzzle.id}`);if(!Array.isArray(puzzle.hints)||puzzle.hints.length!==5)fail(`Expected five hints: ${puzzle.id}`);
 const local=new Set();for(const[hintIndex,hint]of puzzle.hints.entries()){const text=normalize(hint);if(text.length<10)fail(`Suspiciously short hint ${hintIndex+1}: ${puzzle.id}`);if(/todo|tbd|placeholder|lorem ipsum|insert |\{\{/i.test(hint))fail(`Placeholder in ${puzzle.id}`);if(local.has(text))fail(`Duplicate hint in ${puzzle.id}`);local.add(text);if(hintIndex<3&&new RegExp(`\\b${answer.replaceAll(' ','\\s+')}\\b`,'i').test(text)){earlyLeaks++;fail(`Answer leaked in early hint ${hintIndex+1}: ${puzzle.id}`)}if(allHints.has(text))fail(`Duplicate clue shared by ${puzzle.id} and ${allHints.get(text)}`);allHints.set(text,puzzle.id)}
 categoryCounts[puzzle.category]=(categoryCounts[puzzle.category]||0)+1;difficultyCounts[puzzle.difficulty]=(difficultyCounts[puzzle.difficulty]||0)+1;
 if(puzzleById.get(puzzle.id)!==puzzle)fail(`Share lookup failed: ${puzzle.id}`)
}
for(const category of allowed)if((categoryCounts[category]||0)<15)fail(`Category is underweight: ${category}`);for(const difficulty of difficulties)if((difficultyCounts[difficulty]||0)<35)fail(`Difficulty is underweight: ${difficulty}`);
let similarPairs=0;const tokenSets=puzzles.flatMap(p=>p.hints.map(h=>new Set(normalize(h).split(' ').filter(w=>w.length>3))));for(let i=0;i<tokenSets.length;i++)for(let j=i+1;j<tokenSets.length;j++){const a=tokenSets[i],b=tokenSets[j],common=[...a].filter(word=>b.has(word)).length,ratio=common/Math.max(a.size,b.size);if(ratio>.82)similarPairs++}if(similarPairs>8)fail(`Too many nearly identical clues: ${similarPairs}`);
console.log(JSON.stringify({totalPuzzles:puzzles.length,categoryCounts,difficultyCounts,uniqueIds:ids.size,uniqueAnswers:answers.size,totalHints:allHints.size,earlyAnswerLeaks:earlyLeaks,nearDuplicateHintPairs:similarPairs,allShareIdsResolve:puzzleById.size===puzzles.length},null,2));console.log('Puzzle data validation passed.');
