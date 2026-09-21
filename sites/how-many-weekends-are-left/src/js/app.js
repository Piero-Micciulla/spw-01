import { durationParts, plural, weekendSnapshot, weekendState } from './weekends.js';

const $ = id => document.getElementById(id);
const els = Object.fromEntries(['weekends-left','weekend-word','current-year','weekend-days','completed-weekends','state-line','countdown-label','countdown','weekend-board','board-label','next-label','next-date','last-date','share-button','share-status','local-zone'].map(id => [id, $(id)]));
const dateRange = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
let boardKey = '';
const setText = (element, value) => { if (element.textContent !== String(value)) element.textContent = value; };

export function formatWeekend(item, year) {
  if (!item) return 'Next year';
  const inYear = [item.saturday, item.sunday].filter(date => date.getFullYear() === year);
  if (inYear.length === 1) return dateRange.format(inYear[0]);
  return `${dateRange.format(inYear[0])}–${new Intl.DateTimeFormat(undefined, { day: 'numeric' }).format(inYear[1])}`;
}

function formatCountdown(ms) {
  const p = durationParts(ms);
  return `${String(p.days).padStart(2,'0')}d ${String(p.hours).padStart(2,'0')}h ${String(p.minutes).padStart(2,'0')}m ${String(p.seconds).padStart(2,'0')}s`;
}

function makeToken(item, now, index) {
  const token = document.createElement('span');
  token.className = `weekend-token weekend-token--${weekendState(item, now)}`;
  token.style.setProperty('--i', index);
  token.setAttribute('aria-hidden', 'true');
  token.innerHTML = '<i></i><i></i>';
  return token;
}

export function render(now = new Date()) {
  const data = weekendSnapshot(now);
  setText(els['weekends-left'], data.weekendsLeft);
  setText(els['weekend-word'], data.weekendsLeft === 1 ? 'WEEKEND' : 'WEEKENDS');
  setText(els['current-year'], data.year);
  setText(els['weekend-days'], plural(data.weekendDaysLeft, 'weekend day'));
  setText(els['completed-weekends'], plural(data.completed.length, 'weekend'));
  setText(els['state-line'], data.isWeekend
    ? data.currentOwned ? `YOU’RE IN ONE. ${plural(data.weekendsLeft - 1, 'more')} after this.` : 'YOU’RE IN A CROSS-YEAR WEEKEND.'
    : data.weekendsLeft ? 'PLANS OPTIONAL. MEMORIES LIKELY.' : 'THAT’S THE LOT FOR THIS YEAR.');
  setText(els['countdown-label'], data.isWeekend ? 'This weekend ends in' : 'Next weekend starts in');
  setText(els.countdown, formatCountdown(data.countdownMs));
  const nextBoardKey = `${data.year}:${data.completed.length}:${data.currentOwned?.saturday.getTime() || ''}`;
  if (boardKey !== nextBoardKey) {
    els['weekend-board'].replaceChildren(...data.weekends.map((item,index) => makeToken(item, now, index)));
    boardKey = nextBoardKey;
  }
  setText(els['board-label'], `${plural(data.weekendsLeft, 'weekend')} remain in ${data.year}. ${plural(data.completed.length, 'weekend')} completed.${data.isWeekend ? ' A weekend is currently happening.' : data.next ? ` The next begins ${dateRange.format(data.next.saturday)}.` : ''}`);
  setText(els['next-label'], data.isWeekend ? 'Next future weekend' : 'Next weekend');
  setText(els['next-date'], formatWeekend(data.next, data.year));
  setText(els['last-date'], formatWeekend(data.last, data.year));
  return data;
}

async function share() {
  const data = weekendSnapshot(new Date());
  const text = `Only ${plural(data.weekendsLeft, 'weekend')} left in ${data.year}. Do with that information what you will.`;
  try {
    if (navigator.share) await navigator.share({ title: 'How Many Weekends Are Left?', text, url: location.href });
    else { await navigator.clipboard.writeText(`${text} ${location.href}`); els['share-status'].textContent = 'Copied to clipboard.'; }
  } catch (error) {
    if (error?.name !== 'AbortError') els['share-status'].textContent = 'Sharing did not work. You can copy the address above.';
  }
}

els['share-button'].addEventListener('click', share);
try { els['local-zone'].textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone'; } catch {}
render();
setInterval(() => render(new Date()), 1000);
