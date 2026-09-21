import test from 'node:test';
import assert from 'node:assert/strict';
import { countdownParts, findNextTransition, findPreviousTransition, getClockState, humanDuration, offsetAt, RECENT_WINDOW_MS } from '../src/js/transitions.js';

const instant = value => new Date(value);
const withinSecond = (actual, expected) => assert.ok(Math.abs(+actual - +instant(expected)) < 1000, `${actual.toISOString()} != ${expected}`);

const cases = [
  ['Europe/Madrid','2024-03-31T01:00:00Z',60,120,'forward',60],
  ['Europe/Madrid','2024-10-27T01:00:00Z',120,60,'back',-60],
  ['Europe/London','2024-03-31T01:00:00Z',0,60,'forward',60],
  ['Europe/London','2024-10-27T01:00:00Z',60,0,'back',-60],
  ['America/New_York','2024-03-10T07:00:00Z',-300,-240,'forward',60],
  ['America/New_York','2024-11-03T06:00:00Z',-240,-300,'back',-60],
  ['Australia/Sydney','2024-04-06T16:00:00Z',660,600,'back',-60],
  ['Australia/Sydney','2024-10-05T16:00:00Z',600,660,'forward',60],
  ['Australia/Lord_Howe','2024-04-06T15:00:00Z',660,630,'back',-30],
  ['Australia/Lord_Howe','2024-10-05T15:30:00Z',630,660,'forward',30]
];

for (const [zone, at, before, after, direction, amount] of cases) {
  test(`${zone} ${direction} transition boundary`, () => {
    assert.equal(offsetAt(+instant(at) - 1, zone), before, 'immediately before');
    assert.equal(offsetAt(instant(at), zone), after, 'at transition');
    assert.equal(offsetAt(+instant(at) + 1, zone), after, 'immediately after');
    const next = findNextTransition(+instant(at) - 7 * 86_400_000, zone);
    withinSecond(next.at, at); assert.equal(next.direction, direction); assert.equal(next.changeMinutes, amount);
    const previous = findPreviousTransition(+instant(at) + 7 * 86_400_000, zone);
    withinSecond(previous.at, at); assert.equal(previous.direction, direction); assert.equal(previous.changeMinutes, amount);
  });
}

test('Asia/Tokyo has no transitions in the supported horizon', () => {
  const state = getClockState(instant('2024-06-01T00:00:00Z'), 'Asia/Tokyo');
  assert.equal(state.previous, null); assert.equal(state.next, null); assert.equal(state.recent, false); assert.equal(state.offsetMinutes, 540);
});

test('year boundary finds Southern Hemisphere changes on either side', () => {
  const state = getClockState(instant('2024-12-31T23:59:59Z'), 'Australia/Sydney');
  withinSecond(state.previous.at, '2024-10-05T16:00:00Z');
  withinSecond(state.next.at, '2025-04-05T16:00:00Z');
});

test('recent window includes exact transition and 72 hours, then expires', () => {
  const at = +instant('2024-03-31T01:00:00Z');
  assert.equal(getClockState(at, 'Europe/Madrid').recent, true);
  assert.equal(getClockState(at + RECENT_WINDOW_MS, 'Europe/Madrid').recent, true);
  assert.equal(getClockState(at + RECENT_WINDOW_MS + 1, 'Europe/Madrid').recent, false);
});

test('countdown clamps at zero and duration wording supports half-hours', () => {
  assert.deepEqual(countdownParts(-1), { days:0, hours:0, minutes:0, seconds:0 });
  assert.equal(humanDuration(60), '1 hour'); assert.equal(humanDuration(-120), '2 hours'); assert.equal(humanDuration(30), '30 minutes');
});
