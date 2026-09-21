const HOUR = 3_600_000;
const DAY = 24 * HOUR;
export const RECENT_WINDOW_MS = 72 * HOUR;
export const SEARCH_HORIZON_MS = 3 * 366 * DAY;
const formatterCache = new Map();

function formatter(timeZone) {
  if (!formatterCache.has(timeZone)) formatterCache.set(timeZone, new Intl.DateTimeFormat('en-US', {
    timeZone, timeZoneName: 'shortOffset', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }));
  return formatterCache.get(timeZone);
}

export function isValidTimeZone(timeZone) {
  try { formatter(timeZone).format(0); return true; } catch { return false; }
}

export function offsetAt(instant, timeZone) {
  const parts = formatter(timeZone).formatToParts(new Date(instant));
  const label = parts.find(part => part.type === 'timeZoneName')?.value || '';
  if (label === 'GMT' || label === 'UTC') return 0;
  const match = label.match(/(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (match) return (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] || 0));
  const values = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  const represented = Date.UTC(+values.year, +values.month - 1, +values.day, +values.hour, +values.minute, +values.second);
  return Math.round((represented - Math.floor(+instant / 1000) * 1000) / 60_000);
}

function locateBoundary(low, high, oldOffset, timeZone) {
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (offsetAt(middle, timeZone) === oldOffset) low = middle;
    else high = middle;
  }
  return high;
}

export function findNextTransition(now, timeZone, horizonMs = SEARCH_HORIZON_MS) {
  const start = +now;
  const limit = start + horizonMs;
  let previousTime = start;
  let previousOffset = offsetAt(start, timeZone);
  for (let probe = start + 6 * HOUR; probe <= limit; probe += 6 * HOUR) {
    const currentOffset = offsetAt(probe, timeZone);
    if (currentOffset !== previousOffset) return transition(locateBoundary(previousTime, probe, previousOffset, timeZone), previousOffset, currentOffset);
    previousTime = probe; previousOffset = currentOffset;
  }
  return null;
}

export function findPreviousTransition(now, timeZone, horizonMs = SEARCH_HORIZON_MS) {
  const start = +now;
  const limit = start - horizonMs;
  let laterTime = start;
  let laterOffset = offsetAt(start, timeZone);
  for (let probe = start - 6 * HOUR; probe >= limit; probe -= 6 * HOUR) {
    const earlierOffset = offsetAt(probe, timeZone);
    if (earlierOffset !== laterOffset) return transition(locateBoundary(probe, laterTime, earlierOffset, timeZone), earlierOffset, laterOffset);
    laterTime = probe; laterOffset = earlierOffset;
  }
  return null;
}

function transition(at, beforeOffset, afterOffset) {
  const changeMinutes = afterOffset - beforeOffset;
  return { at: new Date(at), beforeOffset, afterOffset, changeMinutes, direction: changeMinutes > 0 ? 'forward' : 'back' };
}

export function getClockState(now, timeZone) {
  if (!isValidTimeZone(timeZone)) throw new RangeError(`Invalid time zone: ${timeZone}`);
  const instant = new Date(now);
  const previous = findPreviousTransition(instant, timeZone);
  const next = findNextTransition(instant, timeZone);
  const elapsed = previous ? +instant - +previous.at : Infinity;
  return { timeZone, now: instant, offsetMinutes: offsetAt(instant, timeZone), previous, next,
    recent: elapsed >= 0 && elapsed <= RECENT_WINDOW_MS };
}

export function countdownParts(milliseconds) {
  const safe = Math.max(0, milliseconds);
  return { days: Math.floor(safe / DAY), hours: Math.floor(safe % DAY / HOUR), minutes: Math.floor(safe % HOUR / 60_000), seconds: Math.floor(safe % 60_000 / 1000) };
}

export function humanDuration(minutes) {
  const amount = Math.abs(minutes);
  if (amount % 60 === 0) { const hours = amount / 60; return `${hours} hour${hours === 1 ? '' : 's'}`; }
  return `${amount} minutes`;
}
