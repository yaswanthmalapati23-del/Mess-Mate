import { DailyMenuDay, MessType } from '../types';

/**
 * 30-Day September Mess Menus - VIT-AP UNIVERSITY
 * 
 * Accurately separated schedules:
 * 1. Non-Veg Mess: Strictly non-veg schedule (chicken, fish, eggs on scheduled days; no veg replacement paneer).
 * 2. Veg Mess: Strictly 100% vegetarian schedule (paneer, soya, sundal, chickpeas; zero non-veg, zero eggs).
 * 3. Special Mess: Premium counter featuring morning fresh juices, cereals with milk, peanut butter toast, 
 *    chef soups before dinner, and premium desserts.
 */
export const MONTHLY_MESS_MENUS: Record<MessType, DailyMenuDay[]> = {
  'non-veg': [
    {
        "dayNumber": 1,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 2,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_andhra_chicken_fry",
                "dish_masala_fish_fry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 3,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_lemon_sevai",
                "dish_aloo_mutter_curry",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_cluster_beans_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_poha_cutlet",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_maharani",
                "dish_beetroot_tomato_rasam",
                "dish_veg_manchuria_noodles",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 4,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_methi_roti_pair",
                "dish_coconut_chutney",
                "dish_green_peas_tomato_sabji",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_aloo_gobi",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_semiya_payasam"
            ],
            "snacks": [
                "dish_raw_banana_bajji",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_lacha_paratha",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_sambar",
                "dish_chicken_curry",
                "dish_tomato_peas_capsicum",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 5,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_onion_carrot_uttapam",
                "dish_vegetable_poha",
                "dish_peanut_chutney",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_dondakaya_stir_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_punugulu",
                "dish_peanut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_set_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 6,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_shavige_bath",
                "dish_paneer_paratha_pair",
                "dish_coconut_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_vanilla_ice_cream"
            ],
            "snacks": [
                "dish_dahi_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_dosa",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kurma",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 7,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_carrot_idli",
                "dish_bhature_pair",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_pesara_punugulu_curry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_jilebi"
            ],
            "snacks": [
                "dish_dry_maggi",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_telangana_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 8,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_onion_dosa",
                "dish_vada_pav",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_kachori",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 9,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_onion_rava_bonda",
                "dish_cucumber_poha",
                "dish_mess_sambar",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_pachi_pulusu",
                "dish_special_rice",
                "dish_stir_fry_chicken_masala",
                "dish_vegetable_jalfrezi",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_tomato_chutney",
                "dish_badusha"
            ],
            "snacks": [
                "dish_onion_soft_pakoda",
                "dish_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_broken_wheat_upma",
                "dish_carrot_beans_poriyal",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 10,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_tomato_suji_upma",
                "dish_aloo_basin_chutney",
                "dish_peanut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sambar_vada",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_beetroot_tomato_rasam",
                "dish_gobhi_manchuria_noodles",
                "dish_rajma_masala",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 11,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_pudina_chapathi_pair",
                "dish_dal_chutney",
                "dish_aloo_mutter_curry",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_lobia_masala",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_poornalu"
            ],
            "snacks": [
                "dish_vada_pav",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_missi_roti",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_mess_sambar",
                "dish_kadai_chicken",
                "dish_chana_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 12,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_masala_ghee_roast_dosa",
                "dish_veg_moong_dal_khichdi",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_cauliflower_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_mysore_bonda",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_podi_onion_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 13,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_coconut_sevai",
                "dish_aloo_paratha",
                "dish_onion_tomato_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_kulfi"
            ],
            "snacks": [
                "dish_pani_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_rava_upma",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kolhapuri",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 14,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_konaseema_pottikkalu",
                "dish_poori_serving",
                "dish_coconut_chutney",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_andhra_potato_fry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_sweet_boondi",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sweet_corn_masala",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_chettinad_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 15,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 16,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_andhra_chicken_fry",
                "dish_masala_fish_fry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 17,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_lemon_sevai",
                "dish_aloo_mutter_curry",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_cluster_beans_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_poha_cutlet",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_maharani",
                "dish_beetroot_tomato_rasam",
                "dish_veg_manchuria_noodles",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 18,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_methi_roti_pair",
                "dish_coconut_chutney",
                "dish_green_peas_tomato_sabji",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_aloo_gobi",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_semiya_payasam"
            ],
            "snacks": [
                "dish_raw_banana_bajji",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_lacha_paratha",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_sambar",
                "dish_chicken_curry",
                "dish_tomato_peas_capsicum",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 19,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_onion_carrot_uttapam",
                "dish_vegetable_poha",
                "dish_peanut_chutney",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_dondakaya_stir_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_punugulu",
                "dish_peanut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_set_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 20,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_shavige_bath",
                "dish_paneer_paratha_pair",
                "dish_coconut_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_vanilla_ice_cream"
            ],
            "snacks": [
                "dish_dahi_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_dosa",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kurma",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 21,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_carrot_idli",
                "dish_bhature_pair",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_pesara_punugulu_curry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_jilebi"
            ],
            "snacks": [
                "dish_dry_maggi",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_telangana_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 22,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_onion_dosa",
                "dish_vada_pav",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_kachori",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 23,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_onion_rava_bonda",
                "dish_cucumber_poha",
                "dish_mess_sambar",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_pachi_pulusu",
                "dish_special_rice",
                "dish_stir_fry_chicken_masala",
                "dish_vegetable_jalfrezi",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_tomato_chutney",
                "dish_badusha"
            ],
            "snacks": [
                "dish_onion_soft_pakoda",
                "dish_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_broken_wheat_upma",
                "dish_carrot_beans_poriyal",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 24,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_tomato_suji_upma",
                "dish_aloo_basin_chutney",
                "dish_peanut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sambar_vada",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_beetroot_tomato_rasam",
                "dish_gobhi_manchuria_noodles",
                "dish_rajma_masala",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 25,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_pudina_chapathi_pair",
                "dish_dal_chutney",
                "dish_aloo_mutter_curry",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_lobia_masala",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_poornalu"
            ],
            "snacks": [
                "dish_vada_pav",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_missi_roti",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_mess_sambar",
                "dish_kadai_chicken",
                "dish_chana_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 26,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_masala_ghee_roast_dosa",
                "dish_veg_moong_dal_khichdi",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_cauliflower_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_mysore_bonda",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_podi_onion_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 27,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_coconut_sevai",
                "dish_aloo_paratha",
                "dish_onion_tomato_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_kulfi"
            ],
            "snacks": [
                "dish_pani_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_rava_upma",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kolhapuri",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 28,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_konaseema_pottikkalu",
                "dish_poori_serving",
                "dish_coconut_chutney",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_andhra_potato_fry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_sweet_boondi",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sweet_corn_masala",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_chettinad_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 29,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 30,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_andhra_chicken_fry",
                "dish_masala_fish_fry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    }
],
  'veg': [
    {
        "dayNumber": 1,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_soya_bean_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 2,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_peanut_sundal",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_kaju_tomato_paneer",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 3,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_lemon_sevai",
                "dish_aloo_mutter_curry",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_paneer_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_cluster_beans_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_poha_cutlet",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_maharani",
                "dish_beetroot_tomato_rasam",
                "dish_veg_manchuria_noodles",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 4,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_methi_roti_pair",
                "dish_coconut_chutney",
                "dish_green_peas_tomato_sabji",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_chickpeas_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_aloo_gobi",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_semiya_payasam"
            ],
            "snacks": [
                "dish_raw_banana_bajji",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_lacha_paratha",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_sambar",
                "dish_paneer_butter_masala",
                "dish_tomato_peas_capsicum",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 5,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_onion_carrot_uttapam",
                "dish_vegetable_poha",
                "dish_peanut_chutney",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_sweet_potato_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_dondakaya_stir_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_punugulu",
                "dish_peanut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_set_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 6,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_shavige_bath",
                "dish_paneer_paratha_pair",
                "dish_coconut_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_paneer_bhurji",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_paneer_dum_biryani",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_vanilla_ice_cream"
            ],
            "snacks": [
                "dish_dahi_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_dosa",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kurma",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 7,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_carrot_idli",
                "dish_bhature_pair",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_ragi_malt",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_pesara_punugulu_curry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_jilebi"
            ],
            "snacks": [
                "dish_dry_maggi",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_achari_paneer",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 8,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_onion_dosa",
                "dish_vada_pav",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_soya_bean_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_kachori",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 9,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_onion_rava_bonda",
                "dish_cucumber_poha",
                "dish_mess_sambar",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_greek_yogurt_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_pachi_pulusu",
                "dish_special_rice",
                "dish_stir_fry_paneer_masala",
                "dish_vegetable_jalfrezi",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_tomato_chutney",
                "dish_badusha"
            ],
            "snacks": [
                "dish_onion_soft_pakoda",
                "dish_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_broken_wheat_upma",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 10,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_tomato_suji_upma",
                "dish_aloo_basin_chutney",
                "dish_peanut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_paneer_bhurji",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sambar_vada",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_beetroot_tomato_rasam",
                "dish_gobhi_manchuria_noodles",
                "dish_rajma_masala",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 11,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_pudina_chapathi_pair",
                "dish_dal_chutney",
                "dish_aloo_mutter_curry",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_chickpeas_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_lobia_masala",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_poornalu"
            ],
            "snacks": [
                "dish_vada_pav",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_missi_roti",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_mess_sambar",
                "dish_kadai_paneer",
                "dish_chana_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 12,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_masala_ghee_roast_dosa",
                "dish_veg_moong_dal_khichdi",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_peanut_sundal",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_cauliflower_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_mysore_bonda",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_podi_onion_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 13,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_coconut_sevai",
                "dish_aloo_paratha",
                "dish_onion_tomato_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_paneer_bhurji",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_paneer_dum_biryani",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_kulfi"
            ],
            "snacks": [
                "dish_pani_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_rava_upma",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kolhapuri",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 14,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_konaseema_pottikkalu",
                "dish_poori_serving",
                "dish_coconut_chutney",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_ragi_malt",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_andhra_potato_fry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_sweet_boondi",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sweet_corn_masala",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_paneer_pepper_fry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 15,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_soya_bean_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 16,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_peanut_sundal",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_kaju_tomato_paneer",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 17,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_lemon_sevai",
                "dish_aloo_mutter_curry",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_paneer_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_cluster_beans_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_poha_cutlet",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_maharani",
                "dish_beetroot_tomato_rasam",
                "dish_veg_manchuria_noodles",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 18,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_methi_roti_pair",
                "dish_coconut_chutney",
                "dish_green_peas_tomato_sabji",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_chickpeas_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_aloo_gobi",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_semiya_payasam"
            ],
            "snacks": [
                "dish_raw_banana_bajji",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_lacha_paratha",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_sambar",
                "dish_paneer_butter_masala",
                "dish_tomato_peas_capsicum",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 19,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_onion_carrot_uttapam",
                "dish_vegetable_poha",
                "dish_peanut_chutney",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_sweet_potato_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_dondakaya_stir_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_punugulu",
                "dish_peanut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_set_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 20,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_shavige_bath",
                "dish_paneer_paratha_pair",
                "dish_coconut_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_paneer_bhurji",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_paneer_dum_biryani",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_vanilla_ice_cream"
            ],
            "snacks": [
                "dish_dahi_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_dosa",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kurma",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 21,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_carrot_idli",
                "dish_bhature_pair",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_ragi_malt",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_pesara_punugulu_curry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_jilebi"
            ],
            "snacks": [
                "dish_dry_maggi",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_achari_paneer",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 22,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_onion_dosa",
                "dish_vada_pav",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_soya_bean_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_kachori",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 23,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_onion_rava_bonda",
                "dish_cucumber_poha",
                "dish_mess_sambar",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_greek_yogurt_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_pachi_pulusu",
                "dish_special_rice",
                "dish_stir_fry_paneer_masala",
                "dish_vegetable_jalfrezi",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_tomato_chutney",
                "dish_badusha"
            ],
            "snacks": [
                "dish_onion_soft_pakoda",
                "dish_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_broken_wheat_upma",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 24,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_poori_serving",
                "dish_tomato_suji_upma",
                "dish_aloo_basin_chutney",
                "dish_peanut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_paneer_bhurji",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sambar_vada",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_beetroot_tomato_rasam",
                "dish_gobhi_manchuria_noodles",
                "dish_rajma_masala",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 25,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_uggani_mirchi_bajji",
                "dish_pudina_chapathi_pair",
                "dish_dal_chutney",
                "dish_aloo_mutter_curry",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_chickpeas_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_lobia_masala",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_poornalu"
            ],
            "snacks": [
                "dish_vada_pav",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_missi_roti",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_mess_sambar",
                "dish_kadai_paneer",
                "dish_chana_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 26,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_masala_ghee_roast_dosa",
                "dish_veg_moong_dal_khichdi",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_peanut_sundal",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_cauliflower_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_mysore_bonda",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_podi_onion_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 27,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_coconut_sevai",
                "dish_aloo_paratha",
                "dish_onion_tomato_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_paneer_bhurji",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_paneer_dum_biryani",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_kulfi"
            ],
            "snacks": [
                "dish_pani_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_rava_upma",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kolhapuri",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 28,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_konaseema_pottikkalu",
                "dish_poori_serving",
                "dish_coconut_chutney",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_ragi_malt",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_andhra_potato_fry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_sweet_boondi",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_sweet_corn_masala",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_paneer_pepper_fry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 29,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_soya_bean_salad",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 30,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_boiled_peanut_sundal",
                "dish_mess_chai"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_kaju_tomato_paneer",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    }
],
  'special': [
    {
        "dayNumber": 1,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_boiled_soya_bean_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi",
                "dish_rasamalai"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_broccoli_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 2,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_peanut_sundal"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_andhra_chicken_fry",
                "dish_masala_fish_fry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun",
                "dish_kalakand"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_tomato_crouton_soup",
                "dish_chicken_65",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 3,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_orange_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_poori_serving",
                "dish_lemon_sevai",
                "dish_aloo_mutter_curry",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet",
                "dish_boiled_paneer_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_cluster_beans_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_semiya_payasam"
            ],
            "snacks": [
                "dish_poha_cutlet",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_creamy_mushroom_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_maharani",
                "dish_beetroot_tomato_rasam",
                "dish_veg_manchuria_noodles",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 4,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_uggani_mirchi_bajji",
                "dish_methi_roti_pair",
                "dish_coconut_chutney",
                "dish_green_peas_tomato_sabji",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_chickpeas_salad"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_aloo_gobi",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_semiya_payasam",
                "dish_carrot_halwa"
            ],
            "snacks": [
                "dish_raw_banana_bajji",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_mix_veg_ragi_soup",
                "dish_onions_lemon_salad",
                "dish_lacha_paratha",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_sambar",
                "dish_chicken_curry",
                "dish_tomato_peas_capsicum",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 5,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_orange_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_onion_carrot_uttapam",
                "dish_vegetable_poha",
                "dish_peanut_chutney",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_sweet_potato_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_dondakaya_stir_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi",
                "dish_motichoor_laddu"
            ],
            "snacks": [
                "dish_punugulu",
                "dish_peanut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_red_lentil_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_set_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 6,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_shavige_bath",
                "dish_paneer_paratha_pair",
                "dish_coconut_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_vanilla_ice_cream",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_dahi_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_lemon_coriander_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_dosa",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kurma",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 7,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_banana_milkshake",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_carrot_idli",
                "dish_bhature_pair",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji",
                "dish_ragi_malt"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_pesara_punugulu_curry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_jilebi"
            ],
            "snacks": [
                "dish_dry_maggi",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_sweet_corn_soup",
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_telangana_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 8,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_onion_dosa",
                "dish_vada_pav",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_soya_bean_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi",
                "dish_puran_poli"
            ],
            "snacks": [
                "dish_kachori",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_broccoli_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 9,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_papaya_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_onion_rava_bonda",
                "dish_cucumber_poha",
                "dish_mess_sambar",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet",
                "dish_greek_yogurt_salad"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_pachi_pulusu",
                "dish_special_rice",
                "dish_stir_fry_chicken_masala",
                "dish_vegetable_jalfrezi",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_tomato_chutney",
                "dish_badusha"
            ],
            "snacks": [
                "dish_onion_soft_pakoda",
                "dish_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_tomato_crouton_soup",
                "dish_chilli_chicken",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_broken_wheat_upma",
                "dish_carrot_beans_poriyal",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee",
                "dish_soya_chunks_curry"
            ]
        }
    },
    {
        "dayNumber": 10,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_grapes_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_poori_serving",
                "dish_tomato_suji_upma",
                "dish_aloo_basin_chutney",
                "dish_peanut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_eggless_chocolate_cake"
            ],
            "snacks": [
                "dish_sambar_vada",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_creamy_mushroom_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_beetroot_tomato_rasam",
                "dish_gobhi_manchuria_noodles",
                "dish_rajma_masala",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 11,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_uggani_mirchi_bajji",
                "dish_pudina_chapathi_pair",
                "dish_dal_chutney",
                "dish_aloo_mutter_curry",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_chickpeas_salad"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_lobia_masala",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_poornalu"
            ],
            "snacks": [
                "dish_vada_pav",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_mix_veg_ragi_soup",
                "dish_onions_lemon_salad",
                "dish_missi_roti",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_mess_sambar",
                "dish_kadai_chicken",
                "dish_chana_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 12,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_orange_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_masala_ghee_roast_dosa",
                "dish_veg_moong_dal_khichdi",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_boiled_peanut_sundal"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_cauliflower_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi",
                "dish_sweet_boondi"
            ],
            "snacks": [
                "dish_mysore_bonda",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_veg_manchow_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_podi_onion_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 13,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_cold_badam_milk",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_coconut_sevai",
                "dish_aloo_paratha",
                "dish_onion_tomato_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_kulfi"
            ],
            "snacks": [
                "dish_pani_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_sweet_corn_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_rava_upma",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kolhapuri",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 14,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_banana_milkshake",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_konaseema_pottikkalu",
                "dish_poori_serving",
                "dish_coconut_chutney",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_ragi_malt"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_andhra_potato_fry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_sweet_boondi",
                "dish_ghee_podi",
                "dish_carrot_halwa"
            ],
            "snacks": [
                "dish_sweet_corn_masala",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_veg_manchow_soup",
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_chettinad_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 15,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_boiled_soya_bean_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi",
                "dish_rasamalai"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_broccoli_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 16,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_peanut_sundal"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_andhra_chicken_fry",
                "dish_masala_fish_fry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun",
                "dish_kalakand"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_tomato_crouton_soup",
                "dish_chicken_65",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 17,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_orange_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_poori_serving",
                "dish_lemon_sevai",
                "dish_aloo_mutter_curry",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet",
                "dish_boiled_paneer_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_cluster_beans_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_semiya_payasam"
            ],
            "snacks": [
                "dish_poha_cutlet",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_creamy_mushroom_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_maharani",
                "dish_beetroot_tomato_rasam",
                "dish_veg_manchuria_noodles",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 18,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_uggani_mirchi_bajji",
                "dish_methi_roti_pair",
                "dish_coconut_chutney",
                "dish_green_peas_tomato_sabji",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_chickpeas_salad"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_aloo_gobi",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_semiya_payasam",
                "dish_carrot_halwa"
            ],
            "snacks": [
                "dish_raw_banana_bajji",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_mix_veg_ragi_soup",
                "dish_onions_lemon_salad",
                "dish_lacha_paratha",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_sambar",
                "dish_chicken_curry",
                "dish_tomato_peas_capsicum",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 19,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_orange_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_onion_carrot_uttapam",
                "dish_vegetable_poha",
                "dish_peanut_chutney",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_sweet_potato_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_dondakaya_stir_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi",
                "dish_motichoor_laddu"
            ],
            "snacks": [
                "dish_punugulu",
                "dish_peanut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_red_lentil_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_set_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 20,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_shavige_bath",
                "dish_paneer_paratha_pair",
                "dish_coconut_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_vanilla_ice_cream",
                "dish_gulab_jamun"
            ],
            "snacks": [
                "dish_dahi_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_lemon_coriander_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_dosa",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kurma",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 21,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_banana_milkshake",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_carrot_idli",
                "dish_bhature_pair",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji",
                "dish_ragi_malt"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_pesara_punugulu_curry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_jilebi"
            ],
            "snacks": [
                "dish_dry_maggi",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_sweet_corn_soup",
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_telangana_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 22,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_onion_dosa",
                "dish_vada_pav",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_soya_bean_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi",
                "dish_puran_poli"
            ],
            "snacks": [
                "dish_kachori",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_broccoli_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 23,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_papaya_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_onion_rava_bonda",
                "dish_cucumber_poha",
                "dish_mess_sambar",
                "dish_coconut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_masala_onion_omelet",
                "dish_greek_yogurt_salad"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_pachi_pulusu",
                "dish_special_rice",
                "dish_stir_fry_chicken_masala",
                "dish_vegetable_jalfrezi",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_tomato_chutney",
                "dish_badusha"
            ],
            "snacks": [
                "dish_onion_soft_pakoda",
                "dish_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_tomato_crouton_soup",
                "dish_chilli_chicken",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_broken_wheat_upma",
                "dish_carrot_beans_poriyal",
                "dish_arbi_gravy",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee",
                "dish_soya_chunks_curry"
            ]
        }
    },
    {
        "dayNumber": 24,
        "dayOfWeek": "Thursday",
        "slots": {
            "breakfast": [
                "dish_grapes_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_poori_serving",
                "dish_tomato_suji_upma",
                "dish_aloo_basin_chutney",
                "dish_peanut_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_ridge_gourd_dal",
                "dish_mess_sambar",
                "dish_pudina_rice",
                "dish_guthi_vankaya_curry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_lemon_sabja_water",
                "dish_potlakaya_perugu_chutney",
                "dish_ghee_podi",
                "dish_eggless_chocolate_cake"
            ],
            "snacks": [
                "dish_sambar_vada",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_creamy_mushroom_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_beetroot_tomato_rasam",
                "dish_gobhi_manchuria_noodles",
                "dish_rajma_masala",
                "dish_mess_curd",
                "dish_fresh_banana",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 25,
        "dayOfWeek": "Friday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_uggani_mirchi_bajji",
                "dish_pudina_chapathi_pair",
                "dish_dal_chutney",
                "dish_aloo_mutter_curry",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_chickpeas_salad"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_toor_dal_tadka",
                "dish_mess_rasam",
                "dish_jeera_rice",
                "dish_raw_banana_fry",
                "dish_lobia_masala",
                "dish_mess_fryums_papad",
                "dish_sweet_lassi",
                "dish_beerakaya_chutney",
                "dish_poornalu"
            ],
            "snacks": [
                "dish_vada_pav",
                "dish_mint_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_mix_veg_ragi_soup",
                "dish_onions_lemon_salad",
                "dish_missi_roti",
                "dish_steamed_rice",
                "dish_moong_dal_fry",
                "dish_mess_sambar",
                "dish_kadai_chicken",
                "dish_chana_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 26,
        "dayOfWeek": "Saturday",
        "slots": {
            "breakfast": [
                "dish_orange_juice",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_masala_ghee_roast_dosa",
                "dish_veg_moong_dal_khichdi",
                "dish_peanut_chutney",
                "dish_mess_sambar",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_boiled_peanut_sundal"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mudda_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_pulihora",
                "dish_cauliflower_fry",
                "dish_chole_soya_curry",
                "dish_mess_fryums_papad",
                "dish_majiga_pulusu",
                "dish_mess_pickle",
                "dish_ghee_podi",
                "dish_sweet_boondi"
            ],
            "snacks": [
                "dish_mysore_bonda",
                "dish_coconut_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_veg_manchow_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_mango_dal",
                "dish_bachali_kura_pulusu",
                "dish_podi_onion_dosa",
                "dish_cabbage_beans_poriyal",
                "dish_tomato_baingan_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 27,
        "dayOfWeek": "Sunday",
        "slots": {
            "breakfast": [
                "dish_cold_badam_milk",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_coconut_sevai",
                "dish_aloo_paratha",
                "dish_onion_tomato_chutney",
                "dish_mess_curd",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_egg_bhurji"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_chicken_dum_biryani",
                "dish_chicken_thick_gravy",
                "dish_mirchi_ka_salan",
                "dish_onion_raita",
                "dish_mess_fryums_papad",
                "dish_nannari_sharbath",
                "dish_gongura_chutney",
                "dish_kulfi"
            ],
            "snacks": [
                "dish_pani_puri",
                "dish_onions_lemon_salad",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_sweet_corn_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_mess_rasam",
                "dish_ragi_rava_upma",
                "dish_dondakaya_stir_fry",
                "dish_vegetable_kolhapuri",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 28,
        "dayOfWeek": "Monday",
        "slots": {
            "breakfast": [
                "dish_banana_milkshake",
                "dish_cornflakes_milk",
                "dish_brown_bread_peanut_butter",
                "dish_konaseema_pottikkalu",
                "dish_poori_serving",
                "dish_coconut_chutney",
                "dish_chana_masala",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_ragi_malt"
            ],
            "lunch": [
                "dish_beetroot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_palak_dal",
                "dish_mess_sambar",
                "dish_tomato_rice",
                "dish_andhra_potato_fry",
                "dish_drumstick_tomato_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_sorakaya_perugu_chutney",
                "dish_sweet_boondi",
                "dish_ghee_podi",
                "dish_carrot_halwa"
            ],
            "snacks": [
                "dish_sweet_corn_masala",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_veg_manchow_soup",
                "dish_onions_lemon_salad",
                "dish_methi_roti_pair",
                "dish_steamed_rice",
                "dish_pesara_pappu",
                "dish_beetroot_tomato_rasam",
                "dish_bhagara_rice",
                "dish_chettinad_chicken_curry",
                "dish_bhindi_masala",
                "dish_mess_curd",
                "dish_fresh_cut_fruits",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 29,
        "dayOfWeek": "Tuesday",
        "slots": {
            "breakfast": [
                "dish_pomegranate_juice",
                "dish_museli_milk",
                "dish_brown_bread_peanut_butter",
                "dish_multigrain_dosa",
                "dish_pav_bhaji",
                "dish_coconut_chutney",
                "dish_mint_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_scrambled_egg",
                "dish_boiled_soya_bean_salad"
            ],
            "lunch": [
                "dish_carrot_cucumber_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_amaranthus_dal",
                "dish_beetroot_tomato_rasam",
                "dish_bisbele_bath",
                "dish_kakarakaya_fry",
                "dish_rajma_masala",
                "dish_mess_fryums_papad",
                "dish_dahi_vada",
                "dish_dosakaya_chutney",
                "dish_ghee_podi",
                "dish_rasamalai"
            ],
            "snacks": [
                "dish_samosa",
                "dish_tomato_sauce",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_broccoli_soup",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_dal_makhani",
                "dish_mess_sambar",
                "dish_mushroom_biryani",
                "dish_snake_gourd_poriyal",
                "dish_aloo_mutter_curry",
                "dish_mess_curd",
                "dish_guava_fruit",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    },
    {
        "dayNumber": 30,
        "dayOfWeek": "Wednesday",
        "slots": {
            "breakfast": [
                "dish_pineapple_juice",
                "dish_chocos_milk",
                "dish_brown_bread_peanut_butter",
                "dish_medu_vada",
                "dish_moong_dal_palak_thepla",
                "dish_mess_sambar",
                "dish_tomato_chutney",
                "dish_bread_butter",
                "dish_sprouts_cup",
                "dish_mess_chai",
                "dish_boiled_eggs",
                "dish_boiled_peanut_sundal"
            ],
            "lunch": [
                "dish_onions_lemon_salad",
                "dish_palak_roti",
                "dish_steamed_rice",
                "dish_gongura_dal",
                "dish_mess_sambar",
                "dish_vegetable_dum_pulao",
                "dish_andhra_chicken_fry",
                "dish_masala_fish_fry",
                "dish_kala_chana_masala",
                "dish_mess_fryums_papad",
                "dish_butter_milk",
                "dish_coriander_tomato_chutney",
                "dish_gulab_jamun",
                "dish_kalakand"
            ],
            "snacks": [
                "dish_corn_vada",
                "dish_onion_tomato_chutney",
                "dish_mess_chai"
            ],
            "dinner": [
                "dish_tomato_crouton_soup",
                "dish_chicken_65",
                "dish_beetroot_carrot_salad",
                "dish_tawa_roti_pair",
                "dish_steamed_rice",
                "dish_tomato_dal",
                "dish_mess_rasam",
                "dish_sooji_upma_dinner",
                "dish_carrot_beans_poriyal",
                "dish_soya_chunks_curry",
                "dish_mess_curd",
                "dish_fruit_custard",
                "dish_mess_pickle",
                "dish_hot_milk_coffee"
            ]
        }
    }
]
};

export const MONTHLY_MESS_MENU: DailyMenuDay[] = MONTHLY_MESS_MENUS['non-veg'];

export function getMessMonthlyMenu(messType?: MessType): DailyMenuDay[] {
  const type = messType || 'non-veg';
  return MONTHLY_MESS_MENUS[type] || MONTHLY_MESS_MENUS['non-veg'];
}

export function getMessDayMenu(dayNumber: number, messType?: MessType): DailyMenuDay {
  const menu = getMessMonthlyMenu(messType);
  return menu.find((d) => d.dayNumber === dayNumber) || menu[0];
}
