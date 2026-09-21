import { countdownParts, getClockState, humanDuration, isValidTimeZone } from './transitions.js';
import { canonicalTimeZone, filterTimeZones, getTimeZones } from './timezones.js';

const $ = selector => document.querySelector(selector);
const dateFormat = timeZone => new Intl.DateTimeFormat(undefined, { timeZone, weekday:'short', year:'numeric', month:'short', day:'numeric', hour:'numeric', minute:'2-digit', timeZoneName:'short' });
const relative = milliseconds => {
  const hours = Math.floor(Math.max(0, milliseconds) / 3_600_000);
  if (hours < 24) return hours < 1 ? 'less than an hour ago' : `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24); return `${days} day${days === 1 ? '' : 's'} ago`;
};
let selectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
let state;
let nextRefresh = 0;
const timeZones = getTimeZones();

function render(now = new Date(), announce = false) {
  state = getClockState(now, selectedZone);
  const event = state.recent ? state.previous : state.next;
  $('#zone-name').textContent = selectedZone.replaceAll('_', ' ');
  $('#zone-input').value = selectedZone;
  if (state.recent) {
    $('#verdict').textContent = 'YES.';
    $('#verdict').className = 'verdict yes';
    $('#headline').textContent = `The clocks went ${event.direction} ${relative(+now - +event.at)}.`;
    $('#countdown').hidden = true;
  } else if (state.next) {
    $('#verdict').textContent = 'NOT YET.';
    $('#verdict').className = 'verdict waiting';
    $('#headline').textContent = `The clocks go ${event.direction} in`;
    $('#countdown').hidden = false;
    updateCountdown(now);
  } else {
    $('#verdict').textContent = 'NOPE.';
    $('#verdict').className = 'verdict nope';
    $('#headline').textContent = `This timezone doesn’t currently change its clocks.`;
    $('#countdown').hidden = true;
  }
  const detail = event ? `${event.direction === 'forward' ? 'FORWARD' : 'BACK'} · You ${event.direction === 'forward' ? 'lose' : 'gain'} ${humanDuration(event.changeMinutes)} of clock time.` : 'NO OFFSET CHANGES FOUND';
  $('#direction').textContent = detail;
  $('#direction').className = `direction ${event?.direction || 'steady'}`;
  renderTransitions();
  nextRefresh = state.next ? +state.next.at : now.getTime() + 3_600_000;
  if (announce) { $('#status').textContent = `${$('#verdict').textContent} ${$('#headline').textContent} ${detail}`; }
}

function updateCountdown(now = new Date()) {
  if (!state?.next || $('#countdown').hidden) return;
  const remaining = Math.max(0, +state.next.at - +now);
  const p = countdownParts(remaining);
  $('#days').textContent = p.days; $('#hours').textContent = String(p.hours).padStart(2,'0');
  $('#minutes').textContent = String(p.minutes).padStart(2,'0'); $('#seconds').textContent = String(p.seconds).padStart(2,'0');
}

function renderTransitions() {
  const format = dateFormat(selectedZone);
  $('#previous-change').textContent = state.previous ? `${format.format(state.previous.at)} · ${state.previous.direction} ${humanDuration(state.previous.changeMinutes)}` : 'None found in the past three years';
  $('#next-change').textContent = state.next ? `${format.format(state.next.at)} · ${state.next.direction} ${humanDuration(state.next.changeMinutes)}` : 'None found in the next three years';
}

const input = $('#zone-input');
const list = $('#zone-options');
let visibleZones = [];
let activeIndex = -1;

function closeOptions() {
  list.hidden = true; input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant'); activeIndex = -1;
}

function highlight(index) {
  if (!visibleZones.length) return;
  activeIndex = (index + visibleZones.length) % visibleZones.length;
  list.querySelectorAll('[role="option"]').forEach((option, optionIndex) => option.setAttribute('aria-selected', String(optionIndex === activeIndex)));
  const active = list.querySelector(`#zone-option-${activeIndex}`);
  input.setAttribute('aria-activedescendant', active.id); active.scrollIntoView({ block: 'nearest' });
}

function showOptions(query = '') {
  visibleZones = filterTimeZones(timeZones, query);
  list.replaceChildren(); activeIndex = -1;
  if (!visibleZones.length) {
    const empty = document.createElement('li'); empty.className = 'empty'; empty.textContent = 'No matching timezone'; list.append(empty);
  } else visibleZones.forEach((zone, index) => {
    const item = document.createElement('li');
    const option = document.createElement('button'); option.type = 'button'; option.setAttribute('role', 'option');
    option.id = `zone-option-${index}`; option.dataset.zone = zone; option.setAttribute('aria-selected', 'false');
    option.textContent = zone.replaceAll('_', ' '); item.append(option); list.append(item);
  });
  list.hidden = false; input.setAttribute('aria-expanded', 'true');
}

function selectZone(zone) {
  selectedZone = zone; input.value = zone; $('#zone-error').textContent = ''; closeOptions();
  try { localStorage.setItem('clock-timezone', zone); } catch {}
  render(new Date(), true);
}

input.addEventListener('focus', () => showOptions(''));
input.addEventListener('click', () => { if (list.hidden) showOptions(input.value === selectedZone ? '' : input.value); });
input.addEventListener('input', () => showOptions(input.value));
input.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault(); if (list.hidden) showOptions(''); highlight(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
  } else if (event.key === 'Enter' && activeIndex >= 0) {
    event.preventDefault(); selectZone(visibleZones[activeIndex]);
  } else if (event.key === 'Escape') { event.preventDefault(); closeOptions(); }
});
list.addEventListener('pointerdown', event => {
  const option = event.target.closest('[data-zone]');
  if (option) { event.preventDefault(); selectZone(option.dataset.zone); input.focus(); }
});
input.addEventListener('blur', () => setTimeout(closeOptions, 100));
$('#zone-form').addEventListener('submit', event => {
  event.preventDefault(); const value = canonicalTimeZone(timeZones, input.value) || input.value.trim();
  if (!isValidTimeZone(value)) { $('#zone-error').textContent = 'Choose a timezone from the list, such as Europe/London.'; return; }
  selectZone(value);
});
try { const saved = localStorage.getItem('clock-timezone'); if (saved && isValidTimeZone(saved)) selectedZone = saved; } catch {}
render(new Date());
setInterval(() => { const now = new Date(); if (+now >= nextRefresh) render(now, true); else updateCountdown(now); }, 1000);
$('#current-year').textContent = new Date().getFullYear();
