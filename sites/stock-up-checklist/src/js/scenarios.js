const slug=value=>value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const section=(title,items)=>({id:slug(title),title,items:items.map((label,index)=>({id:`${slug(label)}-${index+1}`,label}))});
const scenario=(id,title,category,code,description,sections,note='')=>({id,title,category,code,description,note,sections:sections.map(([name,items])=>section(name,items))});

export const scenarios=[
scenario('bad-weather','Bad Weather','Home / Weather','HW-01','Everyday supplies for riding out a spell of disruptive weather at home.',[
 ['Food',['Shelf-stable meals','Canned beans or lentils','Crackers or crispbread','Nut or seed butter','Tinned fruit','Comfort snacks']],
 ['Drinks',['Drinking water','Tea or coffee','Long-life milk','Electrolyte drink mix','Reusable water bottles']],
 ['Light + Power',['Flashlights','Fresh batteries','Charged power bank','Phone charging cable','Battery-powered radio']],
 ['Home',['Toilet paper','Trash bags','Paper towels','All-purpose cleaner','Pet food']],
 ["Don't Forget",['Regular prescriptions','Manual can opener','Warm blanket','Basic first-aid supplies','Weatherproof outer layer']]
 ],'For severe conditions, follow local authority instructions and leave or seek help when advised.'),
scenario('power-outage','Power Outage','Home / Weather','HW-02','A practical home kit for temporary loss of lights, charging, and cooking.',[
 ['Light',['Flashlights','Headlamp','Fresh batteries','Battery lanterns','Glow sticks']],
 ['Power',['Charged power banks','Phone charging cables','Car phone charger','Battery-powered radio','Spare device batteries']],
 ['Food + Drink',['Drinking water','Ready-to-eat meals','Canned food','Shelf-stable snacks','Long-life milk','Pet food']],
 ['Home',['Manual can opener','Cooler and ice packs','Trash bags','Paper towels','Warm blankets']],
 ['Practical',['Regular prescriptions','Basic first-aid supplies','Printed emergency contacts','Cash in small notes','Matches in a dry container']]
 ],'Never run generators, grills, or fuel-burning heaters indoors. Follow local safety guidance.'),
scenario('very-hot-weather','Very Hot Weather','Home / Weather','HW-03','Cooling, hydration, and low-effort supplies for an unusually hot stretch.',[
 ['Hydration',['Drinking water','Refillable water bottles','Electrolyte drink mix','Ice cube trays','Chilled non-alcoholic drinks','Water-rich fruit']],
 ['Cool Food',['Salad ingredients','Sandwich fillings','Yogurt or dairy-free alternative','Cold snacks','Frozen treats']],
 ['Cooling',['Portable fan','Cooling towels','Reusable ice packs','Lightweight bedding','Window shade or blackout curtain']],
 ['Sun',['Broad-spectrum sunscreen','Sun hat','Sunglasses','Lightweight loose clothing','After-sun moisturizer']],
 ['Home',['Pet water supplies','Spray bottle','Thermometer','Regular prescriptions','Easy no-cook meals']]
 ],'Extreme heat can be dangerous. Follow public-health advice and seek medical help for signs of heat illness.'),
scenario('very-cold-weather','Very Cold Weather','Home / Weather','HW-04','Warm, useful basics for cold days without risky heating shortcuts.',[
 ['Warmth',['Warm blankets','Thermal base layers','Thick socks','Gloves','Warm hat','Hot-water bottle']],
 ['Food',['Hearty soup','Pasta or grains','Canned beans','Oatmeal','Easy oven meals']],
 ['Drinks',['Tea or coffee','Hot chocolate','Long-life milk','Drinking water','Insulated flask']],
 ['Home',['Draft stopper','Fresh flashlight batteries','Pet bedding','Ice scraper','Sidewalk grit or sand']],
 ['Practical',['Regular prescriptions','Moisturizer','Lip balm','Tissues','Phone power bank']]
 ],'Use only properly installed heaters and follow local cold-weather and carbon-monoxide guidance.'),
scenario('staying-home-few-days','Staying Home for a Few Days','Home / Weather','HW-05','A balanced pantry-and-home restock for a short stretch without errands.',[
 ['Breakfast',['Oats or cereal','Bread or wraps','Eggs or alternative','Fruit','Coffee or tea']],
 ['Meals',['Pasta or rice','Jarred cooking sauce','Canned beans','Frozen vegetables','Soup','Easy freezer meal']],
 ['Snacks + Drinks',['Drinking water','Milk or alternative','Fresh snacks','Crackers','Something sweet']],
 ['Home',['Toilet paper','Dish soap','Trash bags','Laundry detergent','Pet food']],
 ['Comfort',['Tissues','Regular prescriptions','Basic pain relief','Book or puzzle','Charging cables']]
 ]),
scenario('road-trip','Road Trip','Travel','TR-01','A road-ready manifest for the car, the passengers, and the miles between stops.',[
 ['Car',['Fuel or vehicle charge','Tire pressure check','Windshield washer fluid','Spare tire kit','Vehicle documents','Roadside assistance details']],
 ['Food + Drink',['Refillable water bottles','Easy-to-eat snacks','Cooler bag','Napkins','Reusable food containers']],
 ['Comfort',['Sunglasses','Light blanket','Travel pillow','Hand sanitizer','Tissues']],
 ['Navigation',['Phone mount','Phone charging cable','Offline maps','Destination address','Planned rest stops']],
 ['Just in Case',['Basic first-aid kit','Trash bags','Flashlight','Weather layer','Small amount of cash']]
 ]),
scenario('beach-weekend','Beach Weekend','Travel','TR-02','Sun, swim, food, and cleanup essentials for an easy weekend by the water.',[
 ['Beach',['Beach towels','Beach blanket','Shade umbrella or shelter','Beach bag','Waterproof phone pouch','Reusable tote']],
 ['Sun',['Broad-spectrum sunscreen','Sun hats','Sunglasses','Light cover-up','Lip balm with sun protection']],
 ['Swim',['Swimwear','Spare dry clothes','Water shoes','Wet-clothes bag','Goggles']],
 ['Food + Drink',['Refillable water bottles','Cooler and ice packs','Portable snacks','Picnic lunch','Reusable cups']],
 ['Cleanup',['Trash bags','Hand sanitizer','Tissues','After-sun moisturizer','Brush or comb']]
 ]),
scenario('camping-weekend','Camping Weekend','Travel','TR-03','A complete but approachable camp checklist for shelter, meals, and comfort.',[
 ['Shelter',['Tent with poles and stakes','Groundsheet','Sleeping bags','Sleeping pads','Pillows','Mallet']],
 ['Camp Kitchen',['Camp stove and approved fuel','Lighter or matches','Cooking pot','Eating utensils','Plates or bowls']],
 ['Food + Water',['Drinking water','Easy camp meals','Trail snacks','Cooler and ice packs','Coffee or tea']],
 ['Clothing',['Weatherproof jacket','Warm layers','Spare socks','Sturdy footwear','Sleep clothes']],
 ['Practical',['Headlamps','Basic first-aid kit','Insect repellent','Trash bags','Biodegradable soap']]
 ],'Check campsite rules, fire restrictions, weather, and local safety advice before leaving.'),
scenario('cabin-remote-weekend','Cabin / Remote Weekend','Travel','TR-04','The useful extras that matter when shops and services are not close by.',[
 ['Food',['Breakfast supplies','Two simple dinners','Lunch ingredients','Cooking oil and seasonings','Shelf-stable backup meal','Snacks']],
 ['Drinks',['Drinking water','Coffee or tea','Milk or alternative','Evening drinks','Insulated bottles']],
 ['Cabin',['Bed linens','Bath towels','Dish soap and sponge','Toilet paper','Trash bags']],
 ['Remote Ready',['Offline directions','Flashlights','Fresh batteries','Phone power bank','Basic first-aid kit']],
 ['Comfort',['Warm layers','Rain jacket','Slippers','Books or games','Insect repellent']]
 ]),
scenario('long-travel-day','Long Travel Day','Travel','TR-05','Carry-on essentials for staying comfortable, charged, and organized in transit.',[
 ['Documents',['Travel tickets','Photo identification','Booking confirmations','Travel insurance details','Destination address','Payment card']],
 ['Carry-on',['Phone','Phone charging cable','Power bank','Headphones','Pen']],
 ['Food + Drink',['Empty refillable bottle','Portable snacks','Mints or gum','Reusable utensils','Napkins']],
 ['Comfort',['Travel pillow','Light layer','Eye mask','Earplugs','Compression socks']],
 ['Freshen Up',['Toothbrush and toothpaste','Hand sanitizer','Tissues','Lip balm','Regular prescriptions']]
 ]),
scenario('house-guests','House Guests','People / Events','PE-01','A welcoming home restock for overnight visitors without overcomplicating hosting.',[
 ['Guest Room',['Clean bed linens','Extra pillows','Bedside water glass','Reading light','Empty hangers','Spare blanket']],
 ['Bathroom',['Fresh towels','Toilet paper','Hand soap','Shampoo and conditioner','Spare toothbrushes']],
 ['Breakfast',['Coffee and tea','Milk or alternative','Bread or pastries','Eggs or alternative','Fresh fruit']],
 ['Snacks + Drinks',['Drinking water','Easy snacks','Soft drinks','Evening drinks','Ice']],
 ['Home',['Tissues','Trash bags','All-purpose cleaner','Wi-Fi password card','Spare house key']]
 ]),
scenario('dinner-party','Dinner Party','People / Events','PE-02','A start-to-finish dinner manifest covering the table, guests, and cleanup.',[
 ['Food',['Main-course ingredients','Side-dish ingredients','Appetizer ingredients','Dessert','Bread or rolls','Dietary alternative']],
 ['Drinks',['Drinking water','Non-alcoholic option','Wine or chosen drinks','Ice','Coffee or tea']],
 ['Table',['Dinner plates','Cutlery','Drinking glasses','Serving dishes','Napkins']],
 ['Guest Comfort',['Hand soap','Fresh hand towel','Coat space','Ambient lighting','Music playlist']],
 ['Cleanup',['Dish soap','Dishwasher detergent','Food storage containers','Trash bags','Paper towels']]
 ]),
scenario('birthday-party','Birthday Party','People / Events','PE-03','Cake, guests, activities, and cleanup covered in one celebratory supply list.',[
 ['Celebration',['Birthday cake','Candles','Matches or lighter','Cake knife','Serving plates','Napkins']],
 ['Food',['Party snacks','Main food','Dietary alternative','Fresh fruit','Dips and spreads']],
 ['Drinks',['Drinking water','Soft drinks','Ice','Reusable cups','Coffee or tea']],
 ['Party',['Simple decorations','Music playlist','Party activity','Gift table or basket','Camera or phone charger']],
 ['Cleanup',['Trash bags','Paper towels','Food storage containers','All-purpose cleaner','Recycling container']]
 ]),
scenario('game-night','Game Night','People / Events','PE-04','Low-mess snacks, comfortable play, and everything needed around the table.',[
 ['Games',['Chosen games','Complete game pieces','Score pads','Pens and pencils','Timer','Spare card deck']],
 ['Snacks',['Bite-size savory snacks','Easy sweet snacks','Fresh fruit','Dips','Serving bowls']],
 ['Drinks',['Drinking water','Soft drinks','Ice','Reusable cups','Tea or coffee']],
 ['Table',['Clear playing surface','Comfortable chairs','Coasters','Napkins','Good lighting']],
 ['Practical',['Phone charging cable','Trash bags','Paper towels','Food storage containers','House rules reminder']]
 ]),
scenario('bbq-cookout','BBQ / Cookout','People / Events','PE-05','A cookout checklist spanning safe cooking, cold drinks, serving, and cleanup.',[
 ['Grill',['Grill fuel','Long-handled utensils','Food thermometer','Heat-resistant gloves','Grill brush','Lighter or matches']],
 ['Food',['Main grill items','Vegetarian grill option','Buns or bread','Salad ingredients','Condiments']],
 ['Drinks',['Drinking water','Soft drinks','Ice','Cooler','Reusable cups']],
 ['Serving',['Serving platters','Plates and cutlery','Napkins','Table covering','Food covers']],
 ['Cleanup',['Trash bags','Paper towels','Food storage containers','Dish soap','Recycling container']]
 ],'Cook outdoors in a well-ventilated area and follow local fire and food-safety guidance.'),
scenario('moving-day','Moving Day','Life / Home','LH-01','Keep the move functioning with packing, cleaning, and first-night supplies in reach.',[
 ['Packing',['Sturdy boxes','Packing tape','Permanent markers','Packing paper','Furniture covers','Resealable bags']],
 ['Tools',['Box cutter','Basic tool kit','Measuring tape','Work gloves','Doorstop']],
 ['Cleaning',['All-purpose cleaner','Paper towels','Trash bags','Broom and dustpan','Cleaning cloths']],
 ['Moving Day',['Drinking water','Portable snacks','Phone chargers','Important documents folder','Toilet paper']],
 ['First Night',['Bed linens','Towels','Toiletries','Regular prescriptions','Change of clothes']]
 ]),
scenario('new-apartment','New Apartment','Life / Home','LH-02','The unglamorous essentials that make a new place livable from the first night.',[
 ['Kitchen',['Frying pan','Cooking pot','Kitchen knife','Cutting board','Plates and cutlery','Can opener']],
 ['Cleaning',['All-purpose cleaner','Dish soap and sponge','Trash bags','Broom or vacuum','Laundry detergent']],
 ['Bathroom',['Toilet paper','Hand soap','Bath towel','Shower curtain','Toilet brush']],
 ['Bedroom',['Bed linens','Pillows','Clothes hangers','Bedside lamp','Laundry basket']],
 ['Practical',['Basic tool kit','Light bulbs','Extension lead','Basic first-aid supplies','Phone charging cable']]
 ]),
scenario('sick-day-home','Sick Day at Home','Life / Home','LH-03','Gentle food, fluids, and ordinary comforts for resting at home.',[
 ['Fluids',['Drinking water','Tea','Electrolyte drink','Broth','Refillable bottle','Honey']],
 ['Easy Food',['Soup','Crackers','Toast or bread','Bananas','Rice or plain grains']],
 ['Comfort',['Tissues','Soft blanket','Clean sleepwear','Lip balm','Thermometer']],
 ['Hygiene',['Hand soap','Trash bags','Disinfecting cleaner','Fresh towels','Laundry detergent']],
 ['Practical',['Regular prescriptions','Appropriate over-the-counter medicine','Phone charger','Simple entertainment','Emergency contact details']]
 ],'This is a comfort checklist, not medical advice. Follow medication labels and contact a qualified professional when concerned.'),
scenario('busy-work-week','Busy Work Week','Life / Home','LH-04','A calm weekly reset for quick meals, focused work, and fewer midweek errands.',[
 ['Breakfast',['Oats or cereal','Eggs or alternative','Fruit','Yogurt or alternative','Coffee or tea','Bread or wraps']],
 ['Quick Meals',['Pre-cooked grains','Frozen vegetables','Canned beans','Simple pasta sauce','Easy protein option']],
 ['Desk',['Notebook','Working pens','Phone charging cable','Headphones','Refillable water bottle']],
 ['Home',['Toilet paper','Dishwasher or dish soap','Trash bags','Laundry detergent','Pet food']],
 ['Keep Going',['Portable snacks','Lunch containers','Coffee filters','Tissues','One easy freezer meal']]
 ]),
scenario('holiday-hosting','Holiday Hosting','Life / Home','LH-05','A generous but grounded hosting checklist for meals, overnight needs, and leftovers.',[
 ['Meal',['Main dish ingredients','Side-dish ingredients','Dietary alternative','Bread or rolls','Cooking oil and seasonings','Dessert']],
 ['Drinks',['Drinking water','Non-alcoholic option','Celebration drinks','Ice','Coffee and tea']],
 ['Table',['Plates and cutlery','Drinking glasses','Serving dishes','Napkins','Table covering']],
 ['Guests',['Fresh towels','Extra bed linens','Toilet paper','Hand soap','Spare toiletries']],
 ['After',['Food storage containers','Foil or reusable wraps','Trash bags','Dishwasher detergent','Paper towels']]
 ])
];

export const scenarioById=new Map(scenarios.map(item=>[item.id,item]));
export const categories=[...new Set(scenarios.map(item=>item.category))];
