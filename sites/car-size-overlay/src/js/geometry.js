export const MM_PER_INCH=25.4;
export function ratio(a,b,key){return b[key]/a[key]}
export function difference(a,b){return{length_mm:b.length_mm-a.length_mm,width_mm:b.width_mm-a.width_mm,height_mm:b.height_mm-a.height_mm,wheelbase_mm:b.wheelbase_mm-a.wheelbase_mm,footprint_m2:(b.length_mm*b.width_mm-a.length_mm*a.width_mm)/1e6}}
export function canvasScale(cars,view,width,height,layout='overlay'){const maxLength=Math.max(...cars.map(c=>c.length_mm)),maxCross=Math.max(...cars.map(c=>view==='top'?c.width_mm:c.height_mm));const rows=layout==='side'?2:1;return Math.min((width-80)/maxLength,(height-80)/(maxCross*rows+(rows-1)*260))}
export function centeredBox(car,view,maxLength,maxCross,row=0){const cross=view==='top'?car.width_mm:car.height_mm;return{x:(maxLength-car.length_mm)/2,y:(maxCross-cross)/2+row*(maxCross+260),width:car.length_mm,height:cross}}
export function wheelCenters(car,box){const overhang=(car.length_mm-car.wheelbase_mm)/2;return{rear:box.x+overhang,front:box.x+overhang+car.wheelbase_mm}}
export function convert(mm,unit){return unit==='imperial'?mm/MM_PER_INCH:mm}
export function formatDimension(mm,unit='metric'){return unit==='imperial'?`${(mm/MM_PER_INCH).toFixed(1)} in`:`${mm.toLocaleString('en')} mm`}
