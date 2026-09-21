const DAY_MS = 86_400_000;

export function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

export function localYearBounds(date) {
  const year = date.getFullYear();
  return { year, start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) };
}

export function calendarDayNumber(date) {
  const year = date.getFullYear();
  return Math.floor((Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 1)) / DAY_MS) + 1;
}

export function monthProgress(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return Math.min(1, Math.max(0, (date - start) / (end - start)));
}

export function milestoneDates(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return [0.25, 0.5, 0.75, 0.9].map(fraction => ({ fraction, date: new Date(start.getTime() + (end - start) * fraction) }));
}

export function getYearProgress(input) {
  const now = input instanceof Date ? new Date(input) : new Date(input);
  if (Number.isNaN(now.getTime())) throw new TypeError('A valid date is required');
  const { year, start, end } = localYearBounds(now);
  const raw = (now - start) / (end - start);
  const progress = Math.min(1, Math.max(0, raw));
  const totalDays = daysInYear(year);
  const dayNumber = calendarDayNumber(now);
  return {
    now, year, start, end, progress, percentage: progress * 100,
    totalDays, dayNumber,
    completedDays: dayNumber - 1,
    daysAfterToday: Math.max(0, totalDays - dayNumber),
    remainingMs: Math.max(0, end - now),
    monthProgress: monthProgress(now),
    milestones: milestoneDates(year)
  };
}

export function buildDayStates(progress) {
  return Array.from({ length: progress.totalDays }, (_, index) => index + 1 < progress.dayNumber ? 'complete' : index + 1 === progress.dayNumber ? 'today' : 'future');
}
