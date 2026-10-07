import { MONTHLY_MESS_MENUS } from '../lib/data/monthlyMenuData';
import { DISH_LOOKUP } from '../lib/data/messDishes';

console.log("Checking 14 days...");
for (let day = 1; day <= 14; day++) {
  const nv = MONTHLY_MESS_MENUS['non-veg'].find((d) => d.dayNumber === day);
  const v = MONTHLY_MESS_MENUS['veg'].find((d) => d.dayNumber === day);

  if (!nv || !v) continue;

  for (const slot of ['breakfast', 'lunch', 'dinner'] as const) {
    const nvDishes = nv.slots[slot].map((id) => DISH_LOOKUP.get(id)?.name || id);
    const vDishes = v.slots[slot].map((id) => DISH_LOOKUP.get(id)?.name || id);

    const diff1 = nvDishes.filter((x) => !vDishes.includes(x));
    const diff2 = vDishes.filter((x) => !nvDishes.includes(x));

    if (diff1.length === 0 && diff2.length === 0) {
      console.log(`Day ${day} ${slot}: IDENTICAL! (${nvDishes.length} items)`);
    } else {
      console.log(`Day ${day} ${slot}:`);
      if (diff1.length) console.log(`   NV only: ${diff1.join(', ')}`);
      if (diff2.length) console.log(`   V only:  ${diff2.join(', ')}`);
    }
  }
}
