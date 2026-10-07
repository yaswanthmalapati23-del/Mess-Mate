with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'dish_paneer_dum_biryani', text)]
print('dish_paneer_dum_biryani occurrences:', len(matches))
veg_idx = text.find("'veg': [")
special_idx = text.find("'special': [")

for p in matches:
    if p < veg_idx:
        sec = 'non-veg'
    elif p < special_idx:
        sec = 'veg'
    else:
        sec = 'special'
    day_match = re.findall(r'"dayNumber":\s*(\d+)', text[max(0, p-600):p])
    day_num = day_match[-1] if day_match else '?'
    print(f'Section: {sec}, Day: {day_num}')
