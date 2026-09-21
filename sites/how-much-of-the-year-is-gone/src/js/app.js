import { buildDayStates, getYearProgress } from './year-progress.js';

const $ = id => document.getElementById(id);
const els = {
  percentage: $('percentage'), year: $('current-year'), accessibleSummary: $('accessible-summary'),
  completed: $('completed-days'), remaining: $('remaining-days'), grid: $('year-grid'),
  gridLabel: $('grid-label'), facts: $('live-facts'), milestones: $('milestones'), share: $('share-button'),
  shareStatus: $('share-status'), localZone: $('local-zone')
};
let renderedYear = null;

function formatMoment(date) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(date);
}

export function render(now = new Date()) {
  const data = getYearProgress(now);
  els.percentage.textContent = data.percentage.toFixed(6);
  els.year.textContent = data.year;
  els.completed.textContent = data.completedDays;
  els.remaining.textContent = data.daysAfterToday;
  els.localZone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your local time';
  const summary = `${data.percentage.toFixed(2)}% of ${data.year} has elapsed. Today is day ${data.dayNumber} of ${data.totalDays}. ${data.completedDays} full calendar days are complete and ${data.daysAfterToday} begin after today.`;
  els.gridLabel.textContent = summary;
  els.accessibleSummary.textContent = summary;

  if (renderedYear !== data.year) {
    els.grid.replaceChildren(...buildDayStates(data).map((state, index) => {
      const cell = document.createElement('i');
      cell.className = `day day--${state}`;
      cell.dataset.day = String(index + 1);
      cell.setAttribute('aria-hidden', 'true');
      return cell;
    }));
    renderedYear = data.year;
  } else {
    for (const cell of els.grid.children) {
      const day = Number(cell.dataset.day);
      cell.className = `day day--${day < data.dayNumber ? 'complete' : day === data.dayNumber ? 'today' : 'future'}`;
    }
  }

  const month = new Intl.DateTimeFormat(undefined, { month: 'long' }).format(now);
  els.facts.innerHTML = `
    <li><strong>Day ${data.dayNumber}</strong><span>of ${data.totalDays}</span></li>
    <li><strong>${data.daysAfterToday}</strong><span>days begin after today</span></li>
    <li><strong>${(data.monthProgress * 100).toFixed(1)}%</strong><span>of ${month} elapsed</span></li>
    <li><strong>${data.totalDays}</strong><span>days in ${data.year}${data.totalDays === 366 ? ' · leap year' : ''}</span></li>`;
  els.milestones.replaceChildren(...data.milestones.map(({ fraction, date }) => {
    const item = document.createElement('li');
    const status = now >= date ? 'passed' : 'upcoming';
    item.className = `milestone milestone--${status}`;
    item.innerHTML = `<strong>${fraction * 100}%</strong><span>${formatMoment(date)}</span><small>${status}</small>`;
    return item;
  }));
  document.documentElement.style.setProperty('--progress', `${data.percentage}%`);
  return data;
}

async function share() {
  const data = getYearProgress(new Date());
  const text = `${data.percentage.toFixed(2)}% of ${data.year} is already gone.`;
  try {
    if (navigator.share) await navigator.share({ title: 'How Much of the Year Is Gone?', text, url: location.href });
    else {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      els.shareStatus.textContent = 'Copied to clipboard.';
    }
  } catch (error) {
    if (error?.name !== 'AbortError') els.shareStatus.textContent = 'Could not share. You can copy the address above.';
  }
}

els.share.addEventListener('click', share);
render();
setInterval(() => render(), 1000);
