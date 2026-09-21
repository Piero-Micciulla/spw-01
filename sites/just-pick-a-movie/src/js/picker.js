import { MOODS } from './catalog.js';

export const TIME_FILTERS = Object.freeze({
  any: () => true,
  short: movie => movie.runtimeMinutes <= 95,
  standard: movie => movie.runtimeMinutes >= 96 && movie.runtimeMinutes <= 135
});

export function normalizeFilters(input = {}) {
  if (!input || typeof input !== 'object') input = {};
  return {
    time: Object.hasOwn(TIME_FILTERS, input.time) ? input.time : 'any',
    mood: MOODS.includes(input.mood) ? input.mood : 'any'
  };
}

export function eligibleMovies(catalog, filters = {}) {
  const clean = normalizeFilters(filters);
  return catalog.filter(movie => TIME_FILTERS[clean.time](movie) && (clean.mood === 'any' || movie.moods.includes(clean.mood)));
}

export function resolvePool(catalog, filters = {}) {
  const clean = normalizeFilters(filters);
  const exact = eligibleMovies(catalog, clean);
  if (exact.length) return { pool: exact, relaxed: false, filters: clean };
  const moodOnly = catalog.filter(movie => clean.mood === 'any' || movie.moods.includes(clean.mood));
  if (moodOnly.length) return { pool: moodOnly, relaxed: true, filters: clean };
  return { pool: catalog, relaxed: true, filters: clean };
}

export function pickMovie(pool, history = [], random = Math.random) {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const ids = new Set(pool.map(movie => movie.id));
  const seen = new Set(history.filter(id => ids.has(id)));
  let choices = pool.filter(movie => !seen.has(movie.id));
  if (!choices.length) choices = pool;
  if (choices.length > 1 && history.at(-1)) {
    const withoutLast = choices.filter(movie => movie.id !== history.at(-1));
    if (withoutLast.length) choices = withoutLast;
  }
  return choices[Math.min(choices.length - 1, Math.floor(Math.max(0, Math.min(0.999999, random())) * choices.length))];
}

export function nextHistory(history, movieId, poolSize, limit = 250) {
  const existing = Array.isArray(history) ? history.filter(id => typeof id === 'string') : [];
  const cycle = existing.slice(-Math.max(0, poolSize - 1));
  return [...cycle.filter(id => id !== movieId), movieId].slice(-limit);
}

export function movieFromQuery(catalog, search = '') {
  try {
    const id = new URLSearchParams(search).get('movie');
    return id ? catalog.find(movie => movie.id === id) || null : null;
  } catch { return null; }
}

export function validateCatalog(catalog) {
  const errors = [];
  const ids = new Set();
  const titleYears = new Set();
  catalog.forEach((movie, index) => {
    const at = `movie ${index + 1}`;
    if (!movie || typeof movie !== 'object') { errors.push(`${at}: must be an object`); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(movie.id || '')) errors.push(`${at}: invalid id`);
    if (ids.has(movie.id)) errors.push(`${at}: duplicate id ${movie.id}`); else ids.add(movie.id);
    if (typeof movie.title !== 'string' || !movie.title.trim()) errors.push(`${at}: invalid title`);
    if (!Number.isInteger(movie.year) || movie.year < 1888 || movie.year > new Date().getFullYear() + 1) errors.push(`${at}: implausible year`);
    if (!Number.isInteger(movie.runtimeMinutes) || movie.runtimeMinutes < 40 || movie.runtimeMinutes > 300) errors.push(`${at}: implausible runtime`);
    if (!Array.isArray(movie.moods) || !movie.moods.length || movie.moods.some(mood => !MOODS.includes(mood))) errors.push(`${at}: invalid moods`);
    if (!Array.isArray(movie.genres) || !movie.genres.length || movie.genres.some(genre => typeof genre !== 'string' || !genre.trim())) errors.push(`${at}: invalid genres`);
    const key = `${movie.title?.toLowerCase()}|${movie.year}`;
    if (titleYears.has(key)) errors.push(`${at}: duplicate title/year`); else titleYears.add(key);
  });
  return errors;
}
