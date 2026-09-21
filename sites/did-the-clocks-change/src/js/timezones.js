export const FALLBACK_TIME_ZONES = [
  'UTC', 'Africa/Cairo', 'Africa/Johannesburg',
  'America/Anchorage', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Mexico_City', 'America/New_York', 'America/Sao_Paulo', 'America/Toronto',
  'Asia/Dubai', 'Asia/Hong_Kong', 'Asia/Kolkata', 'Asia/Seoul', 'Asia/Shanghai',
  'Asia/Singapore', 'Asia/Tokyo',
  'Australia/Brisbane', 'Australia/Lord_Howe', 'Australia/Perth', 'Australia/Sydney',
  'Europe/Amsterdam', 'Europe/Berlin', 'Europe/Lisbon', 'Europe/London',
  'Europe/Madrid', 'Europe/Paris', 'Europe/Rome', 'Europe/Warsaw',
  'Pacific/Auckland', 'Pacific/Honolulu'
];

export function getTimeZones(intl = Intl) {
  try {
    const native = typeof intl.supportedValuesOf === 'function' ? intl.supportedValuesOf('timeZone') : [];
    if (Array.isArray(native) && native.length) return ['UTC', ...native.filter(zone => zone !== 'UTC')];
  } catch {}
  return [...FALLBACK_TIME_ZONES];
}

export function filterTimeZones(timeZones, query) {
  const raw = query.trim().toLocaleLowerCase();
  if (!raw) return timeZones;
  return timeZones.filter(zone => {
    const identifier = zone.toLocaleLowerCase();
    const searchable = identifier.replace(/[\/_-]+/g, ' ');
    const normalizedQuery = raw.replace(/[\/_-]+/g, ' ');
    return identifier.includes(raw) || searchable.includes(normalizedQuery);
  });
}

export function canonicalTimeZone(timeZones, value) {
  const needle = value.trim().toLocaleLowerCase();
  return timeZones.find(zone => zone.toLocaleLowerCase() === needle) || null;
}
