import { movies } from './catalog.js';
import { movieFromQuery, nextHistory, pickMovie, resolvePool } from './picker.js';

const form = document.querySelector('#picker-form');
const pickButton = document.querySelector('#pick-button');
const anotherButton = document.querySelector('#another-button');
const result = document.querySelector('#result');
const title = document.querySelector('#movie-title');
const facts = document.querySelector('#movie-facts');
const moodLine = document.querySelector('#movie-moods');
const decision = document.querySelector('#decision-line');
const fallback = document.querySelector('#fallback-note');
const shareButton = document.querySelector('#share-button');
const copyButton = document.querySelector('#copy-button');
const shareStatus = document.querySelector('#share-status');
const pickStatus = document.querySelector('#pick-status');
const storageKey = 'just-pick-a-movie:history-v1';
const phrases = ['The decision is made.', 'No more browsing.', 'This is the one.', 'Tonight is sorted.'];
let currentMovie = null;

function readHistory() {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value.filter(item => typeof item === 'string').slice(-250) : [];
  } catch { return []; }
}

function writeHistory(history) {
  try { sessionStorage.setItem(storageKey, JSON.stringify(history)); } catch { /* Storage may be unavailable. */ }
}

function selectedFilters() {
  return { time: new FormData(form).get('time'), mood: new FormData(form).get('mood') };
}

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${String(remainder).padStart(2, '0')}m`;
}

function announce(message) {
  shareStatus.textContent = '';
  window.setTimeout(() => { shareStatus.textContent = message; }, 20);
}

function showMovie(movie, relaxed = false, updateUrl = true) {
  currentMovie = movie;
  title.textContent = movie.title;
  facts.textContent = `${movie.year} · ${formatRuntime(movie.runtimeMinutes)} · ${movie.genres.join(' / ')}`;
  moodLine.textContent = movie.moods.map(mood => mood.toUpperCase()).join(' · ');
  decision.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  fallback.hidden = !relaxed;
  result.hidden = false;
  result.classList.remove('reveal');
  requestAnimationFrame(() => result.classList.add('reveal'));
  pickStatus.textContent = `Decision made. You’re watching ${movie.title}, ${movie.year}, ${formatRuntime(movie.runtimeMinutes)}.`;
  anotherButton.focus({ preventScroll: true });
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('movie', movie.id);
    history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
}

function choose() {
  const { pool, relaxed } = resolvePool(movies, selectedFilters());
  const history = readHistory();
  const movie = pickMovie(pool, history);
  if (!movie) return;
  writeHistory(nextHistory(history, movie.id, pool.length));
  showMovie(movie, relaxed);
}

async function copyResult() {
  if (!currentMovie) return;
  const text = `Stop scrolling. You’re watching ${currentMovie.title} (${currentMovie.year}) tonight. ${location.href}`;
  try {
    await navigator.clipboard.writeText(text);
    announce('Recommendation copied.');
  } catch {
    const area = document.createElement('textarea');
    area.value = text; area.setAttribute('readonly', ''); area.className = 'copy-helper';
    document.body.append(area); area.select();
    const copied = document.execCommand('copy'); area.remove();
    announce(copied ? 'Recommendation copied.' : 'Could not copy. Select the address bar to share this page.');
  }
}

form.addEventListener('submit', event => { event.preventDefault(); choose(); });
anotherButton.addEventListener('click', choose);
copyButton.addEventListener('click', copyResult);
if (navigator.share) {
  shareButton.hidden = false;
  shareButton.addEventListener('click', async () => {
    if (!currentMovie) return;
    try {
      await navigator.share({ title: 'Just Pick a Movie', text: `You’re watching ${currentMovie.title} (${currentMovie.year}) tonight.`, url: location.href });
      announce('Shared. Decision delivered.');
    } catch (error) { if (error.name !== 'AbortError') copyResult(); }
  });
}

const linkedMovie = movieFromQuery(movies, location.search);
if (linkedMovie) showMovie(linkedMovie, false, false);
else if (new URLSearchParams(location.search).has('movie')) history.replaceState({}, '', location.pathname);
