with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    content = f.read()

import re
matches = [m.start() for m in re.finditer(r'"dayNumber":\s*27', content)]
print('Matches for day 27:', len(matches))
for i, idx in enumerate(matches):
    print(f'=== Match {i} ===')
    print(content[idx:idx+1200])
