export const parseDate=value=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!m)throw new TypeError('Invalid ISO birth date');return{year:+m[1],month:+m[2],day:+m[3]}};
export const isLeapYear=y=>y%4===0&&(y%100!==0||y%400===0);
export const observedBirthday=(birth,year)=>birth.month===2&&birth.day===29&&!isLeapYear(year)?{month:2,day:28}:{month:birth.month,day:birth.day};
const compare=(a,b)=>a.month-b.month||a.day-b.day;
export function ageOn(birthDate,now=new Date()){const b=parseDate(birthDate),today={year:now.getFullYear(),month:now.getMonth()+1,day:now.getDate()},birthday=observedBirthday(b,today.year);return today.year-b.year-(compare(today,birthday)<0?1:0)}
const utcDay=(y,m,d)=>Date.UTC(y,m-1,d)/86400000;
export function nextBirthday(birthDate,now=new Date()){const b=parseDate(birthDate),today={year:now.getFullYear(),month:now.getMonth()+1,day:now.getDate()};let year=today.year,observed=observedBirthday(b,year);if(compare(today,observed)>0){year++;observed=observedBirthday(b,year)}return{year,month:observed.month,day:observed.day,days:utcDay(year,observed.month,observed.day)-utcDay(today.year,today.month,today.day),turning:year-b.year}}
export const milestoneYears=(birthDate,age)=>{const {year}=parseDate(birthDate),marks=[18,21,30,40,50,60,70,80],nearest=marks.map(mark=>({age:mark,year:year+mark,past:mark<=age})).sort((a,b)=>Math.abs(a.age-age)-Math.abs(b.age-age)).slice(0,4);return nearest.sort((a,b)=>a.age-b.age)};
export function timeShock(birthDate,age){const decade=Math.floor(parseDate(birthDate).year/10)*10;if(age>=30)return age>=50?`THEY’VE BEEN 30+ FOR ${age-30} YEARS.`:`${Math.ceil(age/10)*10} IS CLOSER THAN IT LOOKS.`;return`BORN IN THE ${String(decade).slice(-2)}s. YES, TIME MOVES.`}
