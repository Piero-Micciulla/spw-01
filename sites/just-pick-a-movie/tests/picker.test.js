import test from 'node:test';
import assert from 'node:assert/strict';
import { movies } from '../src/js/catalog.js';
import { eligibleMovies, movieFromQuery, nextHistory, normalizeFilters, pickMovie, resolvePool } from '../src/js/picker.js';

test('time filters use documented inclusive boundaries', () => {
  const sample = [
    { id:'a', runtimeMinutes:95, moods:['funny'] },
    { id:'b', runtimeMinutes:96, moods:['funny'] },
    { id:'c', runtimeMinutes:135, moods:['serious'] },
    { id:'d', runtimeMinutes:136, moods:['serious'] }
  ];
  assert.deepEqual(eligibleMovies(sample, { time:'short' }).map(movie => movie.id), ['a']);
  assert.deepEqual(eligibleMovies(sample, { time:'standard' }).map(movie => movie.id), ['b','c']);
  assert.equal(eligibleMovies(sample, { time:'any' }).length, 4);
});

test('mood and combined filters only return matches', () => {
  const funny = eligibleMovies(movies, { mood:'funny', time:'any' });
  assert.ok(funny.length > 10 && funny.every(movie => movie.moods.includes('funny')));
  const shortScary = eligibleMovies(movies, { mood:'scary', time:'short' });
  assert.ok(shortScary.length > 0 && shortScary.every(movie => movie.moods.includes('scary') && movie.runtimeMinutes <= 95));
});

test('an empty exact combination relaxes time but preserves mood', () => {
  const sample = [{ id:'a', runtimeMinutes:140, moods:['chill'] }, { id:'b', runtimeMinutes:80, moods:['funny'] }];
  const result = resolvePool(sample, { time:'short', mood:'chill' });
  assert.equal(result.relaxed, true);
  assert.deepEqual(result.pool.map(movie => movie.id), ['a']);
});

test('picker only returns from the eligible pool', () => {
  const pool = eligibleMovies(movies, { time:'short', mood:'funny' });
  for (const random of [0, .1, .5, .999999]) assert.ok(pool.includes(pickMovie(pool, [], () => random)));
  assert.equal(pickMovie([], []), null);
});

test('picker avoids immediate repeats and unseen items until a cycle ends', () => {
  const pool = [{id:'a'},{id:'b'},{id:'c'}];
  assert.notEqual(pickMovie(pool, ['a'], () => 0).id, 'a');
  assert.equal(pickMovie(pool, ['a','b'], () => 0).id, 'c');
  assert.notEqual(pickMovie(pool, ['a','b','c'], () => 0).id, 'c');
});

test('history remains bounded and contains the newest choice once', () => {
  const history = Array.from({ length:40 }, (_, index) => `m${index}`);
  const next = nextHistory(history, 'm20', 100);
  assert.ok(next.length <= 100);
  assert.equal(next.at(-1), 'm20');
  assert.equal(next.filter(id => id === 'm20').length, 1);
});

test('shared movie query accepts only exact local ids', () => {
  assert.equal(movieFromQuery(movies, '?movie=alien')?.title, 'Alien');
  assert.equal(movieFromQuery(movies, '?movie=%3Cscript%3E'), null);
  assert.equal(movieFromQuery(movies, '?movie=ALIEN'), null);
  assert.equal(movieFromQuery(movies, '?other=alien'), null);
});

test('malformed filter input is normalized safely', () => {
  assert.deepEqual(normalizeFilters({ time:'forever', mood:'angry' }), { time:'any', mood:'any' });
  assert.deepEqual(normalizeFilters(null), { time:'any', mood:'any' });
});
