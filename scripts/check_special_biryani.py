with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    text = f.read()

import re

sp_start = text.find("'special': [")
sp_text = text[sp_start:]

days = re.findall(r'"dayNumber":\s*(\d+).*?"slots":\s*\{(.*?)\}', sp_text, re.DOTALL)
print('Total days found in special:', len(days))
for day_num, slots in days:
    if 'biryani' in slots.lower():
        print(f'Day {day_num} biryani items in special:')
        for line in slots.splitlines():
            if 'biryani' in line.lower():
                print('  ', line.strip())
