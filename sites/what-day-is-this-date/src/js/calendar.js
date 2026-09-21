export const MIN_YEAR=1600,MAX_YEAR=9999;
export const WEEKDAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
export function isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}
export function daysInMonth(year,month){if(!Number.isInteger(year)||!Number.isInteger(month)||month<1||month>12)return 0;return[31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month-1]}
export function isValidDate({year,month,day}={}){return Number.isInteger(year)&&year>=MIN_YEAR&&year<=MAX_YEAR&&Number.isInteger(month)&&month>=1&&month<=12&&Number.isInteger(day)&&day>=1&&day<=daysInMonth(year,month)}
export function parseDate(value){const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');if(!match)return null;const date={year:+match[1],month:+match[2],day:+match[3]};return isValidDate(date)?date:null}
export function toISODate(date){return`${String(date.year).padStart(4,'0')}-${String(date.month).padStart(2,'0')}-${String(date.day).padStart(2,'0')}`}
// Sakamoto's algorithm: pure proleptic Gregorian arithmetic, independent of timezone.
export function weekdayIndex(date){if(!isValidDate(date))throw new RangeError('Invalid supported date');let{year,month,day}=date;const offsets=[0,3,2,5,0,3,5,1,4,6,2,4];if(month<3)year--;return(year+Math.floor(year/4)-Math.floor(year/100)+Math.floor(year/400)+offsets[month-1]+day)%7}
export function weekdayName(date){return WEEKDAYS[weekdayIndex(date)]}
export function moveDay(date,amount){if(!isValidDate(date)||![-1,1].includes(amount))throw new RangeError('Invalid date or direction');let{year,month,day}=date;day+=amount;if(day<1){month--;if(month<1){month=12;year--}if(year<MIN_YEAR)return null;day=daysInMonth(year,month)}else if(day>daysInMonth(year,month)){day=1;month++;if(month>12){month=1;year++}if(year>MAX_YEAR)return null}return{year,month,day}}
export function formatDate(date){return`${date.day} ${MONTHS[date.month-1]} ${date.year}`}
export function fromLocalDate(value){return{year:value.getFullYear(),month:value.getMonth()+1,day:value.getDate()}}
export function dayNumber(date){let y=date.year,m=date.month;if(m<=2){y--;m+=12}return 365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)+Math.floor((153*(m-3)+2)/5)+date.day-1}
export function dayDifference(a,b){return dayNumber(a)-dayNumber(b)}
export function relativeCopy(selected,today){const delta=dayDifference(selected,today);if(delta===0)return'Today';const amount=Math.abs(delta);return`${amount.toLocaleString('en-US')} day${amount===1?'':'s'} ${delta<0?'ago':'from today'}`}
