with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    text = f.read()

import re

sp_start = text.find("'special': [")
sp_text = text[sp_start:]

days = re.findall(r'"dayNumber":\s*(\d+).*?"slots":\s*\{(.*?)\}', sp_text, re.DOTALL)
for day_num, slots in days:
    for slot_block in slots.split('],'):
        if 'chicken' in slot_block.lower() or 'fish' in slot_block.lower() or 'egg' in slot_block.lower():
            if 'paneer' in slot_block.lower():
                print(f'Day {day_num} has both non-veg and paneer in slot:')
                for line in slot_block.splitlines():
                    if any(k in line.lower() for k in ['chicken', 'fish', 'egg', 'paneer']):
                        print('  ', line.strip())
