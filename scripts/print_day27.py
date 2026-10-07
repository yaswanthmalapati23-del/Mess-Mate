with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    text = f.read()

for sec in ['non-veg', 'veg', 'special']:
    pos = text.find("'" + sec + "': [")
    d27 = text.find('"dayNumber": 27,', pos)
    end = text.find('"dayNumber": 28,', d27) if text.find('"dayNumber": 28,', d27) != -1 else text.find(']', d27)
    print(f'=== {sec} Day 27 ===')
    print(text[d27:end])
