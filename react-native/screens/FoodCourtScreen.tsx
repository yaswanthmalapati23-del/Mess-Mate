import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  NourishColors,
  NourishTypography,
  NourishShapes,
  NourishShadows,
} from '../theme';
import {
  ArchCanopyHeroCard,
  FoodCourtItemCard,
  NourishChip,
  NourishTopBar,
} from '../components/NourishComponents';

interface FoodCourtItemData {
  id: string;
  name: string;
  outlet: string;
  location: string;
  price: number;
  calories: number;
  protein: number;
  isVeg: boolean;
  tag?: string;
  category: string;
}

const FOOD_ITEMS: FoodCourtItemData[] = [
  {
    id: '1',
    name: "Paneer Tikka Roll",
    outlet: "Hot 'n' Roll",
    location: "Rock Plaza",
    price: 90,
    calories: 380,
    protein: 18,
    isVeg: true,
    tag: "Fast Pick",
    category: "Rolls & Wraps",
  },
  {
    id: '2',
    name: "Grilled Chicken Breast Plate",
    outlet: "FitGrill",
    location: "SAC Outlets",
    price: 160,
    calories: 420,
    protein: 38,
    isVeg: false,
    tag: "Athlete Special",
    category: "High Protein (>20g)",
  },
  {
    id: '3',
    name: "Fresh Cold-Pressed Watermelon",
    outlet: "Juice Oasis",
    location: "Rock Plaza",
    price: 50,
    calories: 110,
    protein: 2,
    isVeg: true,
    tag: "No Sugar Added",
    category: "Fresh Juices",
  },
  {
    id: '4',
    name: "Steamed Chicken Momos (6 pcs)",
    outlet: "Himalayan Corner",
    location: "SAC Outlets",
    price: 110,
    calories: 260,
    protein: 22,
    isVeg: false,
    tag: "High Protein",
    category: "Under 300 kcal",
  },
  {
    id: '5',
    name: "Ghee Podi Thatte Idli (2 pcs)",
    outlet: "Dakshin Delights",
    location: "Rock Plaza",
    price: 70,
    calories: 290,
    protein: 8,
    isVeg: true,
    tag: "South Authentic",
    category: "South Kiosk",
  },
];

const CATEGORIES = [
  "All Outlets",
  "Under 300 kcal",
  "High Protein (>20g)",
  "Fresh Juices",
  "South Kiosk",
  "Rolls & Wraps",
];

interface FoodCourtScreenProps {
  onBackPress?: () => void;
  onItemAdded?: (item: FoodCourtItemData) => void;
}

export const FoodCourtScreen: React.FC<FoodCourtScreenProps> = ({
  onBackPress,
  onItemAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Outlets');

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.outlet.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Outlets'
        ? true
        : selectedCategory === 'Under 300 kcal'
        ? item.calories < 300
        : selectedCategory === 'High Protein (>20g)'
        ? item.protein >= 20
        : item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <NourishTopBar
        title="Explore"
        subtitle="VIT-AP UNIVERSITY"
        onBackPress={onBackPress}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Arch Banner */}
        <ArchCanopyHeroCard
          style={styles.heroCard}
          backgroundColor={NourishColors.surfaceContainerLow}
        >
          <View style={styles.heroTopStatus}>
            <View style={styles.pulseDot} />
            <Text style={styles.heroStatusText}>CAMPUS DINING ACTIVE NOW</Text>
          </View>

          <Text style={styles.heroTitle}>Food Court & Canteen</Text>
          <Text style={styles.heroSubtitle}>
            Rock Plaza & Student Activity Center (SAC) Outlets
          </Text>

          <View style={styles.heroFooterRow}>
            <View style={styles.cleanIngRow}>
              <Text style={styles.cleanIngIcon}>🌱</Text>
              <Text style={styles.cleanIngText}>
                Clean Ingredients & Nutri-Tracking
              </Text>
            </View>
            <View style={styles.openCountBadge}>
              <Text style={styles.openCountText}>12 Open</Text>
            </View>
          </View>
        </ArchCanopyHeroCard>

        {/* Search Bar */}
        <View style={[styles.searchBar, NourishShadows.soft]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search shawarma, dosa, juice, wraps..."
            placeholderTextColor={NourishColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollContainer}
        >
          {CATEGORIES.map((category) => (
            <NourishChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>

        {/* Target Intake Highlight Pill */}
        <View style={styles.intakeCard}>
          <View style={styles.intakeLeft}>
            <View style={styles.intakeFlameBox}>
              <Text style={styles.intakeFlame}>🔥</Text>
            </View>
            <Text style={styles.intakeText}>
              Target Intake: 650 kcal left today
            </Text>
          </View>
          <Text style={styles.trackLiveText}>Track Live</Text>
        </View>

        {/* Food Items List */}
        <View style={styles.foodList}>
          {filteredItems.map((item) => (
            <FoodCourtItemCard
              key={item.id}
              name={item.name}
              outlet={item.outlet}
              location={item.location}
              price={item.price}
              calories={item.calories}
              protein={item.protein}
              isVeg={item.isVeg}
              tag={item.tag}
              onAddPress={() => onItemAdded && onItemAdded(item)}
              style={styles.foodCardItem}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NourishColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: NourishColors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  heroCard: {
    marginBottom: 16,
  },
  heroTopStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NourishColors.primary,
    marginRight: 6,
  },
  heroStatusText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  heroTitle: {
    ...NourishTypography.headlineMd,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  heroSubtitle: {
    ...NourishTypography.bodySm,
    color: NourishColors.textSecondary,
    marginTop: 2,
  },
  heroFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  cleanIngRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanIngIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  cleanIngText: {
    ...NourishTypography.labelMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  openCountBadge: {
    backgroundColor: NourishColors.surfaceWhite,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  openCountText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.surfaceWhite,
    borderRadius: 9999,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...NourishTypography.bodyMd,
    color: NourishColors.textDark,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(216, 232, 222, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  filterIcon: {
    fontSize: 14,
  },
  chipsScrollContainer: {
    paddingBottom: 16,
  },
  intakeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NourishColors.surfaceContainerLow,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 16,
  },
  intakeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intakeFlameBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NourishColors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intakeFlame: {
    fontSize: 14,
  },
  intakeText: {
    ...NourishTypography.labelMd,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  trackLiveText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  foodList: {
    gap: 16,
  },
  foodCardItem: {
    marginBottom: 2,
  },
});
