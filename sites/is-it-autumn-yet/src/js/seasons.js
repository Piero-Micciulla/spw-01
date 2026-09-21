// Equinox/solstice calculation based on Jean Meeus, Astronomical Algorithms,
// chapter 27. The polynomial and periodic correction are useful for years
// 1000–3000. Results are converted from Terrestrial Time to UTC with a
// polynomial estimate of ΔT; expect accuracy within a few minutes.
const TERMS = [
  [485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],[182,27.85,445267.112],
  [156,73.14,45036.886],[136,171.52,22518.443],[77,222.54,65928.934],[74,296.72,3034.906],
  [70,243.58,9037.513],[58,119.81,33718.147],[52,297.17,150.678],[50,21.02,2281.226],
  [45,247.54,29929.562],[44,325.15,31555.956],[29,60.93,4443.417],[18,155.12,67555.328],
  [17,288.79,4562.452],[16,198.04,62894.029],[14,199.76,31436.921],[12,95.39,14577.848],
  [12,287.11,31931.756],[12,320.81,34777.259],[9,227.73,1222.114],[8,15.45,16859.074]
];

const COEFFICIENTS = {
  march: [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  june: [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030],
  september: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  december: [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032]
};

function deltaT(year) {
  // Espenak/Meeus approximations; sufficient because the result is displayed
  // to the minute rather than as an observatory-grade prediction.
  if (year < 1600) { const u = (year - 1000) / 100; return 1574.2 - 556.01*u + 71.23472*u**2 + 0.319781*u**3 - 0.8503463*u**4 - 0.005050998*u**5 + 0.0083572073*u**6; }
  if (year < 1700) { const t = year - 1600; return 120 - 0.9808*t - 0.01532*t**2 + t**3/7129; }
  if (year < 1800) { const t = year - 1700; return 8.83 + 0.1603*t - 0.0059285*t**2 + 0.00013336*t**3 - t**4/1174000; }
  if (year < 1860) { const t = year - 1800; return 13.72 - 0.332447*t + 0.0068612*t**2 + 0.0041116*t**3 - 0.00037436*t**4 + 0.0000121272*t**5 - 0.0000001699*t**6 + 0.000000000875*t**7; }
  if (year < 1900) { const t = year - 1860; return 7.62 + 0.5737*t - 0.251754*t**2 + 0.01680668*t**3 - 0.0004473624*t**4 + t**5/233174; }
  if (year < 1920) { const t = year - 1900; return -2.79 + 1.494119*t - 0.0598939*t**2 + 0.0061966*t**3 - 0.000197*t**4; }
  if (year < 1941) { const t = year - 1920; return 21.20 + 0.84493*t - 0.076100*t**2 + 0.0020936*t**3; }
  if (year < 1961) { const t = year - 1950; return 29.07 + 0.407*t - t**2/233 + t**3/2547; }
  if (year < 1986) { const t = year - 1975; return 45.45 + 1.067*t - t**2/260 - t**3/718; }
  if (year < 2005) { const t = year - 2000; return 63.86 + 0.3345*t - 0.060374*t**2 + 0.0017275*t**3 + 0.000651814*t**4 + 0.00002373599*t**5; }
  if (year < 2050) { const t = year - 2000; return 62.92 + 0.32217*t + 0.005589*t**2; }
  if (year < 2150) return -20 + 32*((year - 1820)/100)**2 - 0.5628*(2150-year);
  const u = (year - 1820)/100; return -20 + 32*u**2;
}

function jdeToDate(jde, year) {
  const unixDays = jde - 2440587.5 - deltaT(year) / 86400;
  return new Date(unixDays * 86400000);
}

export function astronomicalEvent(year, event) {
  if (!Number.isInteger(year) || year < 1000 || year > 3000) throw new RangeError('Astronomical calculation supports years 1000–3000');
  const c = COEFFICIENTS[event];
  if (!c) throw new TypeError(`Unknown astronomical event: ${event}`);
  const Y = (year - 2000) / 1000;
  const jde0 = c[0] + c[1]*Y + c[2]*Y**2 + c[3]*Y**3 + c[4]*Y**4;
  const T = (jde0 - 2451545) / 36525;
  const W = (35999.373*T - 2.47) * Math.PI / 180;
  const dLambda = 1 + 0.0334*Math.cos(W) + 0.0007*Math.cos(2*W);
  const S = TERMS.reduce((sum, [a,b,c]) => sum + a*Math.cos((b + c*T)*Math.PI/180), 0);
  return jdeToDate(jde0 + 0.00001*S/dLambda, year);
}

export function seasonTransitions(year, hemisphere = 'north', definition = 'astronomical') {
  if (!['north', 'south'].includes(hemisphere) || !['astronomical', 'meteorological'].includes(definition)) throw new TypeError('Invalid season options');
  if (definition === 'meteorological') {
    const autumnMonth = hemisphere === 'north' ? 8 : 2;
    const winterMonth = hemisphere === 'north' ? 11 : 5;
    return { autumn: new Date(year, autumnMonth, 1), winter: new Date(year, winterMonth, 1) };
  }
  return hemisphere === 'north'
    ? { autumn: astronomicalEvent(year, 'september'), winter: astronomicalEvent(year, 'december') }
    : { autumn: astronomicalEvent(year, 'march'), winter: astronomicalEvent(year, 'june') };
}

export function getSeasonState(now = new Date(), hemisphere = 'north', definition = 'astronomical') {
  const year = now.getFullYear();
  const current = seasonTransitions(year, hemisphere, definition);
  if (now < current.autumn) return { status: 'before', target: current.autumn, transition: current.autumn, next: current.autumn };
  if (now < current.winter) return { status: 'autumn', target: current.winter, transition: current.autumn, next: current.winter };
  const nextAutumn = seasonTransitions(year + 1, hemisphere, definition).autumn;
  return { status: 'after', target: nextAutumn, transition: current.autumn, next: nextAutumn };
}

export function durationParts(milliseconds) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60000));
  return { days: Math.floor(totalMinutes / 1440), hours: Math.floor(totalMinutes % 1440 / 60), minutes: totalMinutes % 60 };
}
