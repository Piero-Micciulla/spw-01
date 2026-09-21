import test from 'node:test';
import assert from 'node:assert/strict';
import { astronomicalEvent, durationParts, getSeasonState, seasonTransitions } from '../src/js/seasons.js';

test('2026 astronomical events land on independently published UTC dates', () => {
  const withinMinutes = (actual, expected, tolerance = 3) => assert.ok(Math.abs(+actual - +expected) <= tolerance * 60_000, `${actual.toISOString()} differs from ${expected.toISOString()}`);
  withinMinutes(astronomicalEvent(2026, 'march'), new Date('2026-03-20T14:46:00Z'));
  withinMinutes(astronomicalEvent(2026, 'september'), new Date('2026-09-23T00:05:00Z'));
});

test('north: just before, exact, and just after astronomical autumn', () => {
  const autumn = seasonTransitions(2026, 'north', 'astronomical').autumn;
  assert.equal(getSeasonState(new Date(+autumn - 1), 'north', 'astronomical').status, 'before');
  assert.equal(getSeasonState(autumn, 'north', 'astronomical').status, 'autumn');
  assert.equal(getSeasonState(new Date(+autumn + 1), 'north', 'astronomical').status, 'autumn');
});

test('south uses March equinox and reaches autumn at transition', () => {
  const { autumn } = seasonTransitions(2026, 'south', 'astronomical');
  assert.equal(autumn.getUTCMonth(), 2);
  assert.equal(getSeasonState(autumn, 'south', 'astronomical').status, 'autumn');
});

test('meteorological starts use local midnight on standard dates', () => {
  const north = seasonTransitions(2026, 'north', 'meteorological');
  const south = seasonTransitions(2026, 'south', 'meteorological');
  assert.deepEqual([north.autumn.getMonth(), north.autumn.getDate(), north.autumn.getHours()], [8, 1, 0]);
  assert.deepEqual([south.autumn.getMonth(), south.autumn.getDate(), south.autumn.getHours()], [2, 1, 0]);
});

test('after winter points across year boundary to next autumn', () => {
  const state = getSeasonState(new Date(2026, 11, 31, 23, 59), 'north', 'meteorological');
  assert.equal(state.status, 'after');
  assert.deepEqual([state.next.getFullYear(), state.next.getMonth(), state.next.getDate()], [2027, 8, 1]);
});

test('autumn in progress counts toward winter, then winter transitions to next autumn', () => {
  const inAutumn = getSeasonState(new Date(2026, 9, 15), 'north', 'meteorological');
  assert.equal(inAutumn.status, 'autumn');
  assert.deepEqual([inAutumn.target.getMonth(), inAutumn.target.getDate()], [11, 1]);
  const winter = seasonTransitions(2026, 'south', 'astronomical').winter;
  const atWinter = getSeasonState(winter, 'south', 'astronomical');
  assert.equal(atWinter.status, 'after');
  assert.equal(atWinter.target.getUTCFullYear(), 2027);
  assert.equal(atWinter.target.getUTCMonth(), 2);
});

test('durationParts floors cleanly without negative values', () => {
  assert.deepEqual(durationParts(((2*24 + 7)*60 + 31)*60000), { days: 2, hours: 7, minutes: 31 });
  assert.deepEqual(durationParts(-1), { days: 0, hours: 0, minutes: 0 });
});
