with open('lib/data/monthlyMenuData.ts', encoding='utf-8') as f:
    text = f.read()

# Let's inspect Special Mess and clean out the paneer substitute duplicates
sp_start = text.find("'special': [")
head = text[:sp_start]
sp_text = text[sp_start:]

VEG_SUBSTITUTES_TO_REMOVE_IF_NONVEG = [
    'dish_paneer_dum_biryani',
    'dish_kaju_tomato_paneer',
    'dish_paneer_65',
    'dish_paneer_butter_masala',
    'dish_paneer_bhurji',
    'dish_achari_paneer',
    'dish_stir_fry_paneer_masala',
    'dish_chilli_paneer',
    'dish_kadai_paneer',
    'dish_paneer_pepper_fry'
]

# We want to remove these items from special mess where non-veg counterparts exist
cleaned_sp = sp_text
for dish_id in VEG_SUBSTITUTES_TO_REMOVE_IF_NONVEG:
    # remove '"dish_id",\n' or ',\n                "dish_id"'
    pattern1 = f'                "{dish_id}",\n'
    pattern2 = f',\n                "{dish_id}"'
    cleaned_sp = cleaned_sp.replace(pattern1, '')
    cleaned_sp = cleaned_sp.replace(pattern2, '')

new_text = head + cleaned_sp
with open('lib/data/monthlyMenuData.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Special mess cleaned successfully!')
