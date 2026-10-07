import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
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
  MacroProgressTile,
  SmartSwapCard,
  GuidedPlateItemCard,
  NourishPillButton,
  NourishTopBar,
} from '../components/NourishComponents';

interface MealDetailScreenProps {
  onBackPress?: () => void;
  onLogMealSuccess?: () => void;
}

export const MealDetailScreen: React.FC<MealDetailScreenProps> = ({
  onBackPress,
  onLogMealSuccess,
}) => {
  const [isEggSwapped, setIsEggSwapped] = useState(false);
  const [itemRice, setItemRice] = useState(true);
  const [itemDal, setItemDal] = useState(true);
  const [itemBhindi, setItemBhindi] = useState(true);
  const [itemCurd, setItemCurd] = useState(true);

  // Dynamic Macro calculations
  const calories =
    (itemRice ? 156 : 0) +
    (itemDal ? 185 : 0) +
    (itemBhindi ? 95 : 0) +
    (itemCurd ? 60 : 0) +
    (isEggSwapped ? 144 : 0);

  const protein =
    (itemRice ? 3 : 0) +
    (itemDal ? 12 : 0) +
    (itemBhindi ? 2 : 0) +
    (itemCurd ? 4 : 0) +
    (isEggSwapped ? 14 : 0);

  const carbs =
    (itemRice ? 35 : 0) +
    (itemDal ? 22 : 0) +
    (itemBhindi ? 12 : 0) +
    (itemCurd ? 4 : 0) +
    (isEggSwapped ? 2 : 0);

  const fats = 18 + (isEggSwapped ? 6 : 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <NourishTopBar
        title="Meal Details"
        subtitle="VIT-AP UNIVERSITY"
        onBackPress={onBackPress}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Session Context */}
        <View style={styles.sessionHeaderRow}>
          <View>
            <View style={styles.campusTagRow}>
              <View style={styles.mhBadge}>
                <Text style={styles.mhBadgeText}>MH</Text>
              </View>
              <Text style={styles.campusTagText}>
                CENTRAL MESS • VIT-AP CAMPUS
              </Text>
            </View>
            <Text style={styles.sessionTitle}>South Indian Special</Text>
          </View>

          <View style={styles.timeBadge}>
            <Text style={styles.timeIcon}>🕒</Text>
            <Text style={styles.timeText}>12:30 - 2:30 PM</Text>
          </View>
        </View>

        {/* Arch Canopy Hero Card: Suggested Serving */}
        <ArchCanopyHeroCard style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.suggestedServingLabel}>
                SUGGESTED SERVING
              </Text>
              <View style={styles.calorieValueRow}>
                <Text style={styles.calorieNum}>{calories}</Text>
                <Text style={styles.calorieUnit}> kcal</Text>
              </View>
            </View>

            <View style={styles.targetPlateBadge}>
              <Text style={styles.targetPlateIcon}>🌱</Text>
              <Text style={styles.targetPlateText}>Target Plate</Text>
            </View>
          </View>

          {/* 3-Column Macro Progress */}
          <View style={styles.macrosRow}>
            <MacroProgressTile
              label="Protein"
              currentGrams={protein}
              targetGrams={35}
              iconSymbol="💪"
              barColor={NourishColors.primary}
              iconBgColor={NourishColors.primaryFixed}
            />
            <MacroProgressTile
              label="Carbs"
              currentGrams={carbs}
              targetGrams={90}
              iconSymbol="🌾"
              barColor={NourishColors.secondary}
              iconBgColor={NourishColors.secondaryFixed}
            />
            <MacroProgressTile
              label="Fats"
              currentGrams={fats}
              targetGrams={25}
              iconSymbol="💧"
              barColor={NourishColors.secondary}
              iconBgColor={NourishColors.surfaceContainerHigh}
            />
          </View>

          {/* Dietitian Note */}
          <View style={styles.dietitianNoteBox}>
            <View style={styles.dietitianIconCircle}>
              <Text style={styles.dietitianEmoji}>💡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dietitianTitle}>VIT-AP Dietitian Note</Text>
              <Text style={styles.dietitianBody}>
                Today's Dal Tadka is high in lentil protein. Avoid extra ghee on
                phulkas to stay cleanly within your lunch fat allowance.
              </Text>
            </View>
          </View>
        </ArchCanopyHeroCard>

        {/* Non-Veg Smart Swap Module */}
        <SmartSwapCard
          title="Boiled Egg Curry (2 eggs)"
          subtitle={
            isEggSwapped
              ? '✓ Egg Curry active (+14g protein, +144 kcal)'
              : 'Swap out Aloo Gobi for +12g protein (+45 kcal).'
          }
          badgeText="Non-Veg Counter"
          counterSlot="Slot 3B"
          onSwapPress={() => setIsEggSwapped(!isEggSwapped)}
          style={styles.swapCard}
        />

        {/* Guided Plate Section */}
        <View style={styles.guidedPlateHeaderRow}>
          <View style={styles.guidedPlateTitleRow}>
            <Text style={styles.guidedPlateEmoji}>🍽️</Text>
            <Text style={styles.guidedPlateTitle}>Guided Campus Plate</Text>
          </View>
          <Text style={styles.tapToLogHint}>Tap item to log</Text>
        </View>

        <View style={styles.plateItemsList}>
          <GuidedPlateItemCard
            name="Steamed Sona Masoori Rice"
            portion="Recommended: 1 standard katori (120g)"
            calories={156}
            protein={3}
            carbs={35}
            isSelected={itemRice}
            onToggle={() => setItemRice(!itemRice)}
            style={styles.plateItem}
          />
          <GuidedPlateItemCard
            name="Yellow Dal Tadka"
            portion="Recommended: 1.5 katori (generous)"
            calories={185}
            protein={12}
            carbs={22}
            badge="Key Protein Source"
            isSelected={itemDal}
            onToggle={() => setItemDal(!itemDal)}
            style={styles.plateItem}
          />
          <GuidedPlateItemCard
            name="Bhindi Masala (Okra)"
            portion="Recommended: 1 katori (100g)"
            calories={95}
            protein={2}
            carbs={12}
            isSelected={itemBhindi}
            onToggle={() => setItemBhindi(!itemBhindi)}
            style={styles.plateItem}
          />
          <GuidedPlateItemCard
            name="Low-fat Fresh Curd"
            portion="Recommended: 1 small cup (100g)"
            calories={60}
            protein={4}
            carbs={4}
            isSelected={itemCurd}
            onToggle={() => setItemCurd(!itemCurd)}
            style={styles.plateItem}
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Pill Action */}
      <View style={[styles.bottomStickyBar, NourishShadows.elevated]}>
        <NourishPillButton
          title={`Log this Plate (${calories} kcal)`}
          icon="✓"
          onPress={onLogMealSuccess || (() => {})}
        />
      </View>
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
    paddingBottom: 90,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  campusTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mhBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: NourishColors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  mhBadgeText: {
    fontSize: 9,
    color: NourishColors.primary,
    fontWeight: '800',
  },
  campusTagText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
    letterSpacing: 0.6,
  },
  sessionTitle: {
    ...NourishTypography.headlineMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  timeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  heroCard: {
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  suggestedServingLabel: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
    letterSpacing: 0.8,
  },
  calorieValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  calorieNum: {
    ...NourishTypography.displayLg,
    color: NourishColors.primary,
  },
  calorieUnit: {
    ...NourishTypography.titleLg,
    color: NourishColors.primary,
    opacity: 0.8,
  },
  targetPlateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  targetPlateIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  targetPlateText: {
    ...NourishTypography.labelSm,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  macrosRow: {
    flexDirection: 'row',
    backgroundColor: NourishColors.surfaceContainerLow,
    padding: 8,
    borderRadius: 18,
    gap: 8,
    marginBottom: 14,
  },
  dietitianNoteBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(216, 232, 222, 0.65)',
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  dietitianIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NourishColors.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietitianEmoji: {
    fontSize: 14,
  },
  dietitianTitle: {
    ...NourishTypography.labelMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  dietitianBody: {
    ...NourishTypography.bodySm,
    color: NourishColors.textOnSurfaceVariant,
    marginTop: 2,
  },
  swapCard: {
    marginBottom: 16,
  },
  guidedPlateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  guidedPlateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guidedPlateEmoji: {
    fontSize: 16,
  },
  guidedPlateTitle: {
    ...NourishTypography.titleLg,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  tapToLogHint: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  plateItemsList: {
    gap: 10,
  },
  plateItem: {
    marginBottom: 2,
  },
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NourishColors.surfaceWhite,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: NourishColors.outlineLight,
  },
});
