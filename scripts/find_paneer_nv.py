with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    text = f.read()

import re

nv_start = text.find("'non-veg': [")
veg_start = text.find("'veg': [")
nv_text = text[nv_start:veg_start]

paneer_matches = [m.start() for m in re.finditer(r'paneer', nv_text, re.IGNORECASE)]
print('Paneer occurrences in non-veg:', len(paneer_matches))
for p in paneer_matches:
    print(nv_text[max(0, p-80):min(len(nv_text), p+80)])
    print('='*50)
