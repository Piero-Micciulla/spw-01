export const defaults={people:8,style:'hybrid',computer:'peripherals',rooms:1,spaces:['kitchen'],level:'balanced'};
export const options={styles:['individual','hybrid','collaborative','client'],computers:['provided','peripherals','full'],levels:['lean','balanced','premium'],spaces:['kitchen','reception','quiet','lounge']};
const p=(lean,balanced,premium)=>({lean,balanced,premium});
const W='workstations',D='displays',M='meeting',N='network',P='power',L='lighting',S='storage',C='collaboration',K='kitchen',R='reception',O='comfort',E='essentials',F='forgotten';
export const categories=[
 [W,'Workstations'],[D,'Displays & peripherals'],[M,'Meeting rooms'],[N,'Networking & connectivity'],[P,'Power & charging'],[L,'Lighting'],[S,'Storage & organization'],[C,'Collaboration'],[K,'Kitchen / break area'],[R,'Reception'],[O,'Comfort & focus'],[E,'Cleaning, safety & essentials'],[F,'Things people forget']
].map(([id,name])=>({id,name}));
const workstations=c=>c.style==='hybrid'?Math.max(1,Math.ceil(c.people*.75)):c.style==='collaborative'?Math.max(1,Math.ceil(c.people*.9)):c.people;
const roomSeats=c=>c.style==='client'?8:c.people>50?10:c.people>15?8:6;
const q={one:()=>1,people:c=>c.people,work:workstations,rooms:c=>c.rooms,roomSeats:c=>c.rooms*roomSeats(c),monitors:c=>workstations(c)*(c.level==='lean'?1:c.level==='premium'?2:c.computer==='provided'?1:2),thirdWork:c=>Math.max(1,Math.ceil(workstations(c)/3)),halfWork:c=>Math.max(1,Math.ceil(workstations(c)/2)),quarterPeople:c=>Math.max(1,Math.ceil(c.people/4)),tenPeople:c=>Math.max(1,Math.ceil(c.people/10)),twentyPeople:c=>Math.max(1,Math.ceil(c.people/20)),ap:c=>Math.max(1,Math.ceil(c.people/25)),switches:c=>Math.max(1,Math.ceil(c.people/40)),bins:c=>Math.max(2,Math.ceil(c.people/6)),mugs:c=>Math.ceil(c.people*1.25),quiet:c=>Math.max(1,Math.ceil(c.people/12)),lounge:c=>Math.max(2,Math.min(12,Math.ceil(c.people/5)))};
const item=(id,category,name,quantity,why,prices,when=()=>true)=>({id,category,name,quantity,why,prices,when});
export const items=[
 item('desks',W,'Desks / work tables',q.work,'One for each planned workstation.',p([90,180],[180,380],[400,850])),
 item('chairs',W,'Ergonomic task chairs',q.work,'Adjustable seating for every workstation.',p([100,220],[220,480],[500,950])),
 item('desk-drawers',W,'Mobile pedestals / desk drawers',q.thirdWork,'Shared lockable storage near desks.',p([55,100],[90,170],[160,300]),c=>c.level!=='lean'),
 item('sit-stand',W,'Sit–stand desk converters',q.quarterPeople,'Provides posture variety without replacing every desk.',p([120,220],[180,350],[280,550]),c=>c.level==='premium'),
 item('monitors',D,'External monitors',q.monitors,'Dedicated displays sized to the workstation plan.',p([100,160],[170,280],[300,520])),
 item('arms',D,'Monitor arms',q.work,'Reclaims desk space and improves positioning.',p([30,65],[65,130],[130,260]),c=>c.level!=='lean'),
 item('kbdmouse',D,'Keyboard and mouse sets',q.work,'One complete set per workstation.',p([20,45],[45,95],[90,190]),c=>c.computer!=='provided'),
 item('docks',D,'USB-C docks',q.work,'Single-cable connection for laptop workstations.',p([45,90],[90,180],[180,320]),c=>c.computer!=='full'),
 item('headsets',D,'Call headsets',q.halfWork,'Shared call capacity without overbuying.',p([25,55],[60,130],[140,280]),c=>c.style==='hybrid'||c.style==='client'),
 item('computers',D,'Desktop computer allowance',q.work,'Planning allowance only; confirm specifications separately.',p([500,800],[800,1300],[1300,2200]),c=>c.computer==='full'),
 item('tables',M,'Meeting tables',q.rooms,'One appropriately sized table per room.',p([180,400],[450,1000],[1100,2600]),c=>c.rooms>0),
 item('meeting-chairs',M,'Meeting chairs',q.roomSeats,'Seats each planned meeting room.',p([45,100],[100,230],[240,500]),c=>c.rooms>0),
 item('room-display',M,'Conference displays',q.rooms,'Shared screen for presentations and video calls.',p([350,650],[650,1300],[1400,3000]),c=>c.rooms>0),
 item('room-camera',M,'Room cameras',q.rooms,'Wide-angle video for hybrid meetings.',p([70,160],[200,550],[650,1400]),c=>c.rooms>0&&c.level!=='lean'),
 item('speakerphone',M,'Conference speakerphones',q.rooms,'Reliable room audio without laptop echo.',p([80,170],[180,450],[500,1100]),c=>c.rooms>0),
 item('room-connect',M,'Room USB-C / HDMI connection kits',q.rooms,'Lets visitors connect without hunting for adapters.',p([25,60],[60,140],[140,300]),c=>c.rooms>0),
 item('router',N,'Business router / firewall',q.one,'Central internet gateway; confirm capacity and security needs.',p([100,220],[250,650],[700,1800])),
 item('access-points',N,'Wi-Fi access points',q.ap,'Capacity allowance; a survey should confirm placement.',p([70,140],[150,300],[320,650])),
 item('switches',N,'Managed network switches',q.switches,'Ports for access points, rooms and wired desks.',p([90,180],[200,480],[500,1200])),
 item('ethernet',N,'Ethernet patch cables',c=>Math.max(6,Math.ceil(c.people*1.25)),'Includes useful spares for desks and shared devices.',p([3,7],[5,12],[8,18])),
 item('ups',N,'Network UPS battery backup',c=>Math.max(1,Math.ceil(c.people/50)),'Short backup for core network equipment.',p([90,180],[180,380],[400,850])),
 item('strips',P,'Surge-protected power strips',q.halfWork,'Safe planning allowance for desks and shared zones.',p([15,28],[25,45],[40,80])),
 item('chargers',P,'Multi-port charging stations',q.tenPeople,'Shared charging for phones and accessories.',p([25,55],[55,110],[110,220]),c=>c.level!=='lean'),
 item('cable-trays',P,'Under-desk cable trays',q.work,'Keeps power and data cables off the floor.',p([12,25],[25,55],[55,110])),
 item('task-lights',L,'Adjustable task lights',q.thirdWork,'Adds local light where ambient lighting falls short.',p([15,35],[35,75],[80,180]),c=>c.level!=='lean'),
 item('floor-lights',L,'Shared floor / ambient lights',q.twentyPeople,'Softens dim corners and informal spaces.',p([30,70],[70,160],[170,400]),c=>c.level==='premium'||c.spaces.includes('lounge')),
 item('shelving',S,'Storage cabinets / shelving',q.tenPeople,'Shared capacity for supplies, records and equipment.',p([70,160],[170,380],[400,900])),
 item('coat-hooks',S,'Coat hooks / garment rail capacity',c=>Math.max(4,c.people),'One place per person or visitor.',p([4,10],[8,18],[15,35])),
 item('labels',S,'Label maker and starter tape',q.one,'Makes shared storage maintainable from day one.',p([20,35],[35,65],[70,140])),
 item('whiteboards',C,'Whiteboards / collaboration boards',c=>Math.max(1,c.rooms+Math.ceil(c.people/25)),'Visible planning surfaces for rooms and team zones.',p([35,90],[100,260],[280,700])),
 item('markers',C,'Whiteboard marker and eraser sets',c=>Math.max(2,c.rooms+1),'A working set plus a spare.',p([8,18],[15,30],[25,55])),
 item('fridge',K,'Refrigerator',q.one,'Shared food and drink storage sized after occupancy review.',p([220,400],[400,750],[800,1600]),c=>c.spaces.includes('kitchen')),
 item('microwave',K,'Microwave',c=>c.people>35?2:1,'Shared reheating capacity.',p([60,110],[110,220],[220,450]),c=>c.spaces.includes('kitchen')),
 item('coffee',K,'Coffee setup',q.one,'Appropriate shared coffee provision without brand assumptions.',p([30,80],[100,350],[450,1400]),c=>c.spaces.includes('kitchen')),
 item('kettle',K,'Kettle',c=>c.people>50?2:1,'Hot-water provision separate from coffee.',p([20,40],[40,80],[80,160]),c=>c.spaces.includes('kitchen')),
 item('mugs',K,'Mugs and glasses',q.mugs,'One per person plus practical visitor and breakage margin.',p([3,6],[5,10],[8,18]),c=>c.spaces.includes('kitchen')),
 item('kitchen-store',K,'Kitchen storage and organizers',q.one,'Keeps utensils, consumables and cleaning items usable.',p([40,90],[100,220],[250,600]),c=>c.spaces.includes('kitchen')),
 item('reception-desk',R,'Reception desk',q.one,'A defined welcome and admin point.',p([180,400],[450,1000],[1100,2600]),c=>c.spaces.includes('reception')),
 item('visitor-seats',R,'Visitor chairs',c=>Math.max(2,Math.min(8,Math.ceil(c.people/10))),'Proportionate waiting capacity, not one seat per employee.',p([45,100],[110,240],[260,550]),c=>c.spaces.includes('reception')),
 item('visitor-table',R,'Reception side table',q.one,'Surface for visitors and printed information.',p([35,90],[100,220],[240,550]),c=>c.spaces.includes('reception')),
 item('quiet-seats',O,'Quiet-area desks and acoustic seating',q.quiet,'A small focus retreat scaled to team size.',p([160,320],[350,750],[800,1800]),c=>c.spaces.includes('quiet')),
 item('lounge-seats',O,'Lounge / informal meeting seats',q.lounge,'Flexible seats for short conversations and breaks.',p([80,180],[200,480],[500,1100]),c=>c.spaces.includes('lounge')),
 item('plants',O,'Low-maintenance plants / planters',q.twentyPeople,'Visual comfort without crowding the floor plan.',p([15,40],[40,100],[100,280]),c=>c.level==='premium'),
 item('bins',E,'Waste and recycling bins',q.bins,'Distributed disposal and separated recycling capacity.',p([12,25],[25,55],[55,130])),
 item('cleaning',E,'Cleaning supplies starter kit',q.one,'Basic wipes, bags, soap and paper goods to open the office.',p([35,70],[70,140],[140,280])),
 item('first-aid',E,'First-aid kit allowance',c=>Math.max(1,Math.ceil(c.people/50)),'Starting allowance only; verify local workplace requirements.',p([25,50],[45,90],[80,160])),
 item('extinguisher',E,'Fire-safety equipment allowance',c=>Math.max(1,Math.ceil(c.people/50)),'Placeholder pending a qualified local safety assessment.',p([35,70],[60,130],[110,240])),
 item('toolkit',F,'Basic office toolkit',q.one,'Screwdrivers, hex keys, tape measure and cutters solve setup-day problems.',p([25,50],[50,100],[100,200])),
 item('adapters',F,'USB-C / HDMI adapter spares',q.tenPeople,'Covers visitors, meeting rooms and lost dongles.',p([12,28],[25,55],[50,100])),
 item('spare-input',F,'Spare keyboard and mouse sets',c=>Math.max(1,Math.ceil(c.people/25)),'Fast replacement for failures and new starters.',p([20,45],[45,95],[90,180])),
 item('batteries',F,'Spare batteries / rechargeable set',q.one,'Keeps wireless peripherals and remotes running.',p([15,30],[25,55],[50,100])),
 item('visitor-charge',F,'Visitor charging cables',q.one,'Common connectors at reception or meeting areas.',p([15,35],[30,70],[70,150]),c=>c.spaces.includes('reception')||c.style==='client'),
 item('privacy-screens',F,'Monitor privacy filters',q.quarterPeople,'Useful allowance for client-facing or sensitive work.',p([25,50],[45,90],[80,150]),c=>c.style==='client'),
 item('paper-towels',F,'Paper goods and bin-liner reserve',q.one,'Prevents the first-week supply scramble.',p([20,45],[40,80],[70,140]),c=>c.spaces.includes('kitchen'))
];
export function normalizeConfig(raw={}){const integer=value=>Number.isInteger(Number(value))?Number(value):NaN;return{people:Math.min(200,Math.max(1,integer(raw.people)||defaults.people)),style:options.styles.includes(raw.style)?raw.style:defaults.style,computer:options.computers.includes(raw.computer)?raw.computer:defaults.computer,rooms:Math.min(4,Math.max(0,integer(raw.rooms)>=0?integer(raw.rooms):defaults.rooms)),spaces:Array.isArray(raw.spaces)?[...new Set(raw.spaces.filter(x=>options.spaces.includes(x)))]:defaults.spaces.slice(),level:options.levels.includes(raw.level)?raw.level:defaults.level}}
export function createPlan(input){const config=normalizeConfig(input),rows=items.filter(x=>x.when(config)).map(x=>{const quantity=Math.max(1,Math.round(x.quantity(config))),[unitLow,unitHigh]=x.prices[config.level];return{...x,quantity,unitLow,unitHigh,low:quantity*unitLow,high:quantity*unitHigh}});const grouped=categories.map(category=>{const entries=rows.filter(x=>x.category===category.id);return{...category,items:entries,low:entries.reduce((n,x)=>n+x.low,0),high:entries.reduce((n,x)=>n+x.high,0)}}).filter(x=>x.items.length);return{config,categories:grouped,low:grouped.reduce((n,x)=>n+x.low,0),high:grouped.reduce((n,x)=>n+x.high,0),itemCount:rows.length,key:configKey(config)}}
export function configKey(config){const c=normalizeConfig(config);return[c.people,c.style,c.computer,c.rooms,[...c.spaces].sort().join('.'),c.level].join('|')}
export function configFromSearch(search){const p=new URLSearchParams(search),spaces=(p.get('spaces')||'').split('.').filter(Boolean);return normalizeConfig({people:p.get('people'),style:p.get('style'),computer:p.get('computer'),rooms:p.get('rooms'),spaces:p.has('spaces')?spaces:undefined,level:p.get('level')})}
export function searchFromConfig(config){const c=normalizeConfig(config),p=new URLSearchParams({people:c.people,style:c.style,computer:c.computer,rooms:c.rooms,spaces:c.spaces.join('.'),level:c.level});return`?${p}`}
