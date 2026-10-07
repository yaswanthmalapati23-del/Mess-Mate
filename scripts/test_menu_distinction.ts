import { MONTHLY_MESS_MENUS } from '../lib/data/monthlyMenuData';
import { DISH_LOOKUP } from '../lib/data/messDishes';

console.log('Testing MONTHLY_MESS_MENUS:');
const nonVeg = MONTHLY_MESS_MENUS['non-veg'];
const veg = MONTHLY_MESS_MENUS['veg'];
const special = MONTHLY_MESS_MENUS['special'];

console.log('Non-veg days:', nonVeg.length, 'Veg days:', veg.length, 'Special days:', special.length);

let vegHasMeatOrEgg = 0;
let missingDishes = 0;

for (let d = 0; d < veg.length; d++) {
  const day = veg[d];
  for (const slot of ['breakfast', 'lunch', 'snacks', 'dinner'] as const) {
    for (const id of day.slots[slot]) {
      const dish = DISH_LOOKUP.get(id);
      if (!dish) {
        console.error('Missing dish ID in veg:', id);
        missingDishes++;
      } else if (dish.category === 'non-veg' || dish.category === 'egg') {
        console.error('Non-veg/Egg in veg menu! Day', day.dayNumber, slot, dish.name, dish.category);
        vegHasMeatOrEgg++;
      }
    }
  }
}

for (let d = 0; d < nonVeg.length; d++) {
  const day = nonVeg[d];
  for (const slot of ['breakfast', 'lunch', 'snacks', 'dinner'] as const) {
    for (const id of day.slots[slot]) {
      const dish = DISH_LOOKUP.get(id);
      if (!dish) {
        console.error('Missing dish ID in non-veg:', id);
        missingDishes++;
      }
    }
  }
}

console.log('Veg has meat/egg count:', vegHasMeatOrEgg);
console.log('Missing dishes count:', missingDishes);

// Check differences on Wed (Day 2) and Sun (Day 6)
console.log('Day 2 (Wed) lunch:');
console.log('  Non-Veg:', nonVeg[1].slots.lunch);
console.log('  Veg:    ', veg[1].slots.lunch);

console.log('Day 6 (Sun) lunch:');
console.log('  Non-Veg:', nonVeg[5].slots.lunch);
console.log('  Veg:    ', veg[5].slots.lunch);
