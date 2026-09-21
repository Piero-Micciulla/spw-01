import test from 'node:test';
import assert from 'node:assert/strict';
import { FALLBACK_TIME_ZONES, canonicalTimeZone, filterTimeZones, getTimeZones } from '../src/js/timezones.js';

const requiredFallbacks = [
  'Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Sao_Paulo', 'Asia/Tokyo', 'Asia/Shanghai',
  'Asia/Kolkata', 'Asia/Singapore', 'Australia/Sydney', 'Australia/Lord_Howe',
  'Pacific/Auckland', 'UTC'
];

test('uses the full native timezone list and adds UTC', () => {
  const intl = { supportedValuesOf: key => {
    assert.equal(key, 'timeZone');
    return ['America/New_York', 'Europe/London', 'Europe/Madrid'];
  } };
  assert.deepEqual(getTimeZones(intl), ['UTC', 'America/New_York', 'Europe/London', 'Europe/Madrid']);
});

test('falls back when supportedValuesOf is missing, empty, or throws', () => {
  assert.deepEqual(getTimeZones({}), FALLBACK_TIME_ZONES);
  assert.deepEqual(getTimeZones({ supportedValuesOf: () => [] }), FALLBACK_TIME_ZONES);
  assert.deepEqual(getTimeZones({ supportedValuesOf: () => { throw new Error('unsupported'); } }), FALLBACK_TIME_ZONES);
  for (const zone of requiredFallbacks) assert.ok(FALLBACK_TIME_ZONES.includes(zone), `${zone} missing from fallback`);
});

test('filters identifiers by region, city, spaces, and underscores', () => {
  assert.deepEqual(filterTimeZones(FALLBACK_TIME_ZONES, 'Madrid'), ['Europe/Madrid']);
  assert.deepEqual(filterTimeZones(FALLBACK_TIME_ZONES, 'america/new'), ['America/New_York']);
  assert.deepEqual(filterTimeZones(FALLBACK_TIME_ZONES, 'lord howe'), ['Australia/Lord_Howe']);
  assert.deepEqual(filterTimeZones(FALLBACK_TIME_ZONES, 'new_york'), ['America/New_York']);
  assert.deepEqual(filterTimeZones(FALLBACK_TIME_ZONES, ''), FALLBACK_TIME_ZONES);
});

test('resolves typed identifiers to their canonical list casing', () => {
  assert.equal(canonicalTimeZone(FALLBACK_TIME_ZONES, ' europe/madrid '), 'Europe/Madrid');
  assert.equal(canonicalTimeZone(FALLBACK_TIME_ZONES, 'not/a_zone'), null);
});
