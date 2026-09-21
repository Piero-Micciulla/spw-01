import { astronomicalEvent, durationParts, getSeasonState } from './seasons.js';

const $ = selector => document.querySelector(selector);
const controls = $('.season-controls');
const stored = (() => { try { return JSON.parse(localStorage.getItem('season-settings')) || {}; } catch { return {}; } })();
for (const [name, value] of Object.entries(stored)) {
  const input = controls.elements[name]?.value !== undefined && controls.querySelector(`[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
const utcDate = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', timeZone: 'UTC' });
const utcTime = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });

function options() {
  return { hemisphere: controls.elements.hemisphere.value, definition: controls.elements.definition.value };
}

function render() {
  const now = new Date();
  const { hemisphere, definition } = options();
  const state = getSeasonState(now, hemisphere, definition);
  const diff = state.status === 'autumn' ? +now - +state.transition : +state.target - +now;
  const parts = durationParts(diff);
  $('#days').textContent = parts.days.toLocaleString();
  $('#hours').textContent = parts.hours;
  $('#minutes').textContent = parts.minutes;
  $('#season-label').textContent = `${hemisphere === 'north' ? 'Northern' : 'Southern'} Hemisphere · ${definition[0].toUpperCase() + definition.slice(1)}`;
  $('#verdict').textContent = state.status === 'autumn' ? 'Yes.' : 'Not yet.';
  $('#verdict').classList.toggle('is-long', state.status !== 'autumn');
  $('#countdown').setAttribute('aria-label', state.status === 'autumn' ? 'Time since autumn began' : 'Time until autumn begins');
  $('#countdown').classList.toggle('is-yes', state.status === 'autumn');
  const formatted = `${dateFormatter.format(state.status === 'autumn' ? state.transition : state.target)} at ${timeFormatter.format(state.status === 'autumn' ? state.transition : state.target)}`;
  $('#context').textContent = state.status === 'autumn'
    ? `Autumn began ${parts.days ? `${parts.days} day${parts.days === 1 ? '' : 's'} ago` : 'today'}. Winter is in ${durationParts(+state.target - +now).days} days.`
    : `${parts.days ? `${parts.days} days` : 'Less than a day'} until autumn · ${formatted}`;
}

function renderTable() {
  const { hemisphere, definition } = options();
  const start = new Date().getFullYear();
  $('#table-caption').textContent = `${definition[0].toUpperCase() + definition.slice(1)} autumn starts — ${hemisphere === 'north' ? 'Northern' : 'Southern'} Hemisphere`;
  $('#date-rows').replaceChildren(...Array.from({ length: 6 }, (_, i) => {
    const year = start + i;
    let date;
    if (definition === 'astronomical') date = astronomicalEvent(year, hemisphere === 'north' ? 'september' : 'march');
    else date = new Date(year, hemisphere === 'north' ? 8 : 2, 1);
    const row = document.createElement('tr');
    const cells = [year, definition === 'astronomical' ? utcDate.format(date) : dateFormatter.format(date).replace(/^\w+, /, ''), definition === 'astronomical' ? utcTime.format(date) : 'Local midnight'];
    for (const value of cells) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
    return row;
  }));
}

controls.addEventListener('change', () => {
  localStorage.setItem('season-settings', JSON.stringify(options()));
  render(); renderTable();
});
render(); renderTable();
setInterval(render, 1_000);
