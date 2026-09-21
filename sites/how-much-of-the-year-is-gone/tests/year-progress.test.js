import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDayStates, calendarDayNumber, daysInYear, getYearProgress, isLeapYear, milestoneDates } from '../src/js/year-progress.js';

test('Gregorian leap-year rules',()=>{assert.equal(isLeapYear(2024),true);assert.equal(isLeapYear(2100),false);assert.equal(isLeapYear(2000),true);assert.equal(daysInYear(2024),366);assert.equal(daysInYear(2025),365)});
test('exact local Jan 1 starts at zero',()=>{const p=getYearProgress(new Date(2025,0,1));assert.equal(p.percentage,0);assert.equal(p.dayNumber,1);assert.equal(p.completedDays,0);assert.equal(p.daysAfterToday,364)});
test('percentage uses actual local year boundary milliseconds',()=>{const date=new Date(2025,6,2,12);const p=getYearProgress(date);assert.equal(p.progress,(date-new Date(2025,0,1))/(new Date(2026,0,1)-new Date(2025,0,1)))});
test('Jan 1 just after midnight remains near zero',()=>{const p=getYearProgress(new Date(2025,0,1,0,0,1));assert.ok(p.percentage>0&&p.percentage<0.001)});
test('Dec 31 is below 100 with no days after today',()=>{const p=getYearProgress(new Date(2025,11,31,23,59,59,999));assert.ok(p.percentage<100&&p.percentage>99.99);assert.equal(p.daysAfterToday,0);assert.ok(p.remainingMs>=0)});
test('rollover regenerates year data',()=>{const before=getYearProgress(new Date(2024,11,31,23,59,59,999));const after=getYearProgress(new Date(2025,0,1));assert.equal(before.year,2024);assert.equal(before.totalDays,366);assert.equal(after.year,2025);assert.equal(after.totalDays,365);assert.equal(after.percentage,0)});
test('normal-year boundary dates have correct day numbers',()=>{assert.equal(calendarDayNumber(new Date(2025,1,28,12)),59);assert.equal(calendarDayNumber(new Date(2025,2,1,12)),60)});
test('leap-year Feb 28, Feb 29 and Mar 1 are consecutive',()=>{assert.equal(calendarDayNumber(new Date(2024,1,28,12)),59);assert.equal(calendarDayNumber(new Date(2024,1,29,12)),60);assert.equal(calendarDayNumber(new Date(2024,2,1,12)),61)});
test('day-state grid has one cell per day and one today',()=>{const p=getYearProgress(new Date(2024,1,29,12));const states=buildDayStates(p);assert.equal(states.length,366);assert.equal(states.filter(x=>x==='complete').length,59);assert.equal(states.filter(x=>x==='today').length,1);assert.equal(states[59],'today')});
test('day semantics distinguish completed, current, and later days',()=>{const p=getYearProgress(new Date(2025,0,2,12));assert.equal(p.completedDays,1);assert.equal(p.dayNumber,2);assert.equal(p.daysAfterToday,363)});
test('milestones interpolate the same local boundaries',()=>{const m=milestoneDates(2025);const start=new Date(2025,0,1),end=new Date(2026,0,1);assert.equal(m[1].date.getTime(),start.getTime()+(end-start)*.5);assert.deepEqual(m.map(x=>x.fraction),[.25,.5,.75,.9])});
test('month progress respects actual local month boundaries',()=>{const p=getYearProgress(new Date(2025,2,1));assert.equal(p.monthProgress,0);assert.equal(getYearProgress(new Date(2025,2,31,23,59,59,999)).monthProgress<1,true)});
test('progress and remaining time are bounded for representative instants',()=>{for(const d of [new Date(2024,0,1),new Date(2024,5,1),new Date(2024,11,31,23,59,59)]){const p=getYearProgress(d);assert.ok(p.progress>=0&&p.progress<=1);assert.ok(p.remainingMs>=0)}});
test('DST does not break calendar day numbering',()=>{const before=new Date(2025,2,29,12),after=new Date(2025,2,31,12);assert.equal(calendarDayNumber(after)-calendarDayNumber(before),2)});
test('invalid dates are rejected',()=>assert.throws(()=>getYearProgress(new Date(NaN)),/valid date/));
