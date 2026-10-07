import { MESS_DISHES } from '../lib/data/messDishes';

for (const d of MESS_DISHES) {
  const n = d.name.toLowerCase();
  if (n.includes('badam') || n.includes('peanut butter') || n.includes('chocolate') || n.includes('toast')) {
    console.log(`Found: ${d.id} -> ${d.name}`);
  }
}
