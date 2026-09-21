const DAY = 86_400_000;

function valid(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('A valid date is required');
}

export function generateWeekends(year) {
  if (!Number.isInteger(year)) throw new TypeError('A calendar year is required');
  const first = new Date(year, 0, 1);
  const offset = (6 - first.getDay() + 7) % 7;
  const weekends = [];
  for (let day = 1 + offset; ; day += 7) {
    const saturday = new Date(year, 0, day);
    if (saturday.getFullYear() !== year) break;
    const sunday = new Date(year, 0, day + 1);
    const end = new Date(year, 0, day + 2);
    weekends.push({ saturday, sunday, end });
  }
  return weekends;
}

export function weekendDaysRemaining(now) {
  valid(now);
  const year = now.getFullYear();
  const start = new Date(year, now.getMonth(), now.getDate());
  const end = new Date(year + 1, 0, 1);
  let count = 0;
  for (let date = start; date < end; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
    if (date.getDay() === 0 || date.getDay() === 6) count += 1;
  }
  return count;
}

export function weekendSnapshot(now) {
  valid(now);
  const year = now.getFullYear();
  const weekends = generateWeekends(year);
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const currentStart = isWeekend
    ? new Date(year, now.getMonth(), now.getDate() - (day === 0 ? 1 : 0))
    : null;
  const currentEnd = isWeekend
    ? new Date(year, now.getMonth(), now.getDate() + (day === 6 ? 2 : 1))
    : null;
  const remaining = weekends.filter(item => item.end > now);
  const completed = weekends.filter(item => item.end <= now);
  const currentOwned = currentStart?.getFullYear() === year
    ? weekends.find(item => item.saturday.getTime() === currentStart.getTime()) || null
    : null;
  const next = weekends.find(item => item.saturday > now) || null;
  const countdownTarget = isWeekend ? currentEnd : next?.saturday || new Date(year + 1, 0, 1);
  return {
    year, weekends, remaining, completed, weekendsLeft: remaining.length,
    weekendDaysLeft: weekendDaysRemaining(now), isWeekend, currentOwned,
    currentStart, currentEnd, next, last: weekends.at(-1) || null,
    countdownTarget, countdownMs: Math.max(0, countdownTarget - now)
  };
}

export function weekendState(item, now) {
  valid(now);
  if (item.end <= now) return 'completed';
  if (item.saturday <= now && item.end > now) return 'current';
  return 'future';
}

export function durationParts(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
}

export function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export function calendarHours(start, end) {
  valid(start); valid(end);
  return (end - start) / (60 * 60 * 1000);
}

export { DAY };
