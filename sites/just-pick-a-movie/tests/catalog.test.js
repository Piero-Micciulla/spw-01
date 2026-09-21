import test from 'node:test';
import assert from 'node:assert/strict';
import { movies, MOODS } from '../src/js/catalog.js';
import { validateCatalog } from '../src/js/picker.js';

test('catalog is broad and valid', () => {
  assert.ok(movies.length >= 100, `expected at least 100 movies, got ${movies.length}`);
  assert.deepEqual(validateCatalog(movies), []);
});

test('ids and title/year pairs are unique', () => {
  assert.equal(new Set(movies.map(movie => movie.id)).size, movies.length);
  assert.equal(new Set(movies.map(movie => `${movie.title.toLowerCase()}|${movie.year}`)).size, movies.length);
});

test('catalog covers decades, runtimes, moods, and broad genres', () => {
  const decades = new Set(movies.map(movie => Math.floor(movie.year / 10) * 10));
  assert.ok(decades.size >= 9);
  assert.ok(movies.some(movie => movie.runtimeMinutes <= 85));
  assert.ok(movies.some(movie => movie.runtimeMinutes >= 150));
  for (const mood of MOODS) assert.ok(movies.filter(movie => movie.moods.includes(mood)).length >= 10, `${mood} needs depth`);
  assert.ok(new Set(movies.flatMap(movie => movie.genres)).size >= 12);
});

test('validator catches corrupt records', () => {
  const bad = [
    { id:'same', title:'', year:1200, runtimeMinutes:2, moods:['made-up'], genres:[] },
    { id:'same', title:'', year:9999, runtimeMinutes:999, moods:[], genres:[''] }
  ];
  assert.ok(validateCatalog(bad).length >= 9);
});
