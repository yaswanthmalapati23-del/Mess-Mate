import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  NourishColors,
  NourishTypography,
  NourishShapes,
  NourishShadows,
} from '../theme';
import {
  ArchCanopyHeroCard,
  CircularFuelGauge,
  MacroProgressTile,
  NumberedMintBadge,
  NourishPillButton,
  NourishTopBar,
} from '../components/NourishComponents';

interface HomeScreenProps {
  onNavigateToMealDetail?: () => void;
  onNavigateToFoodCourt?: () => void;
  onNavigateToWeeklyMenu?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToMealDetail,
  onNavigateToFoodCourt,
  onNavigateToWeeklyMenu,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NourishTopBar title="Home" subtitle="VIT-AP UNIVERSITY" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================================================== */}
        {/* 1. STUDENT HEADER & CONTEXT SUMMARY                  */}
        {/* ==================================================== */}
        <View style={styles.headerSection}>
          <View style={styles.dateStatusRow}>
            {/* Date Pill */}
            <View style={styles.datePill}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.dateText}>WED, 24 OCT</Text>
            </View>

            {/* Mess Open Status */}
            <View style={styles.statusPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusText}>Mess Open</Text>
            </View>
          </View>

          <Text style={styles.greetingTitle}>Good afternoon, Aditi 👋</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              VIT-AP Central Mess (Block-B, South Mess)
            </Text>
          </View>
        </View>

        {/* ==================================================== */}
        {/* 2. DAILY FUEL TRACKER ARCH CANOPY HERO               */}
        {/* ==================================================== */}
        <ArchCanopyHeroCard style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroHeaderLeft}>
              <View style={styles.heroGreenBar} />
              <Text style={styles.heroTitle}>Daily Fuel Tracker</Text>
            </View>
            <View style={styles.remainingBadge}>
              <Text style={styles.remainingBadgeText}>680 kcal remaining</Text>
            </View>
          </View>

          <View style={styles.gaugeNumeralsRow}>
            <CircularFuelGauge
              currentCalories={1420}
              targetCalories={2100}
              size={96}
            />

            <View style={styles.numeralsCol}>
              <View style={styles.caloriesNumberRow}>
                <Text style={styles.consumedNumber}>1,420</Text>
                <Text style={styles.targetNumber}> / 2,100</Text>
              </View>
              <Text style={styles.caloriesLabel}>KILOCALORIES TARGET</Text>
              <View style={styles.trackWellnessRow}>
                <Text style={styles.trendingIcon}>📈</Text>
                <Text style={styles.wellnessText}>
                  On track for campus wellness
                </Text>
              </View>
            </View>
          </View>

          {/* 3-Column Macro Tiles */}
          <View style={styles.macroTilesContainer}>
            <MacroProgressTile
              label="Carbs"
              currentGrams={185}
              targetGrams={240}
              iconSymbol="🌾"
              barColor={NourishColors.primary}
              iconBgColor={NourishColors.secondaryFixed}
            />
            <MacroProgressTile
              label="Protein"
              currentGrams={72}
              targetGrams={110}
              iconSymbol="💪"
              barColor={NourishColors.primaryDark}
              iconBgColor={NourishColors.primaryFixed}
            />
            <MacroProgressTile
              label="Fats"
              currentGrams={44}
              targetGrams={65}
              iconSymbol="💧"
              barColor={NourishColors.secondary}
              iconBgColor={NourishColors.surfaceContainerHigh}
            />
          </View>
        </ArchCanopyHeroCard>

        {/* ==================================================== */}
        {/* 3. TODAY'S MESS SCHEDULE SECTION                     */}
        {/* ==================================================== */}
        <View style={styles.scheduleHeaderRow}>
          <View style={styles.scheduleHeaderLeft}>
            <Text style={styles.scheduleTitle}>Today's Mess Schedule</Text>
            <View style={styles.mealCountBadge}>
              <Text style={styles.mealCountText}>4 Meals</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onNavigateToWeeklyMenu}
            activeOpacity={0.7}
          >
            <Text style={styles.fullWeekLink}>Full Week →</Text>
          </TouchableOpacity>
        </View>

        {/* Meal 1: Breakfast (Completed) */}
        <View style={[styles.mealCard, NourishShadows.soft]}>
          <View style={styles.mealCardTop}>
            <View style={styles.mealInfoLeft}>
              <View style={styles.completedCircle}>
                <Text style={styles.completedCheck}>✓</Text>
              </View>
              <View>
                <View style={styles.mealTitleRow}>
                  <Text style={styles.mealCardTitle}>Breakfast</Text>
                  <View style={styles.timeTag}>
                    <Text style={styles.timeTagText}>7:30 - 9:30 AM</Text>
                  </View>
                </View>
                <Text style={styles.mealSubtitle}>450 kcal consumed</Text>
              </View>
            </View>
            <View style={styles.portionedBadge}>
              <Text style={styles.portionedBadgeText}>Portioned: 100%</Text>
            </View>
          </View>
          <Text style={styles.mealMenuText}>
            Idli (3 pcs) + Sambar + Peanut Chutney
          </Text>
        </View>

        {/* Meal 2: Lunch (Live Now - Arch Highlight Card) */}
        <ArchCanopyHeroCard
          style={styles.activeMealCard}
          backgroundColor={NourishColors.surfaceWhite}
        >
          <View style={styles.activeCardTop}>
            <View style={styles.liveBannerRow}>
              <View style={styles.liveBadge}>
                <View style={styles.livePulseDot} />
                <Text style={styles.liveBadgeText}>LIVE NOW</Text>
              </View>
              <Text style={styles.activeMealTitle}>Lunch Session</Text>
            </View>
            <View style={styles.recBadge}>
              <Text style={styles.recBadgeText}>Rec: 680 kcal</Text>
            </View>
          </View>

          <View style={styles.optimalChoicePill}>
            <Text style={styles.optimalChoiceText}>Optimal Mess Choice</Text>
            <Text style={styles.optimalTimeText}>12:30 PM - 2:30 PM</Text>
          </View>

          <Text style={styles.activeMenuSummary}>
            Steamed Rice (1.5 cup) • Dal Tadka (1 bowl) • Bhindi Masala (1 katori) • Curd (100g)
          </Text>

          {/* Smart Plate Swap Tip */}
          <View style={styles.smartSwapTipBox}>
            <Text style={styles.smartSwapTipIcon}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.smartSwapTipTitle}>Smart Plate Swap</Text>
              <Text style={styles.smartSwapTipBody}>
                Swap 0.5 cup rice for extra Dal serving to gain{' '}
                <Text style={styles.highlightGreen}>+7g clean protein</Text> for afternoon labs.
              </Text>
            </View>
          </View>

          <NourishPillButton
            title="View Plate Details & Log"
            icon="🍽️"
            onPress={onNavigateToMealDetail || (() => {})}
            style={{ marginTop: 14 }}
          />
        </ArchCanopyHeroCard>

        {/* Meal 3: Evening Snacks (Upcoming) */}
        <View style={[styles.mealCard, NourishShadows.soft]}>
          <View style={styles.mealCardTop}>
            <View style={styles.mealInfoLeft}>
              <NumberedMintBadge number={3} />
              <View>
                <View style={styles.mealTitleRow}>
                  <Text style={styles.mealCardTitle}>Evening Snacks</Text>
                  <View style={styles.timeTag}>
                    <Text style={styles.timeTagText}>5:00 - 6:00 PM</Text>
                  </View>
                </View>
                <Text style={styles.mealSubtitle}>Target: ~220 kcal</Text>
              </View>
            </View>
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingBadgeText}>Upcoming</Text>
            </View>
          </View>
          <Text style={styles.mealMenuText}>
            Crispy Veg Puff / Samosa & Cutting Ginger Tea
          </Text>
        </View>

        {/* Meal 4: Dinner (Upcoming) */}
        <View style={[styles.mealCard, NourishShadows.soft]}>
          <View style={styles.mealCardTop}>
            <View style={styles.mealInfoLeft}>
              <NumberedMintBadge number={4} />
              <View>
                <View style={styles.mealTitleRow}>
                  <Text style={styles.mealCardTitle}>Dinner</Text>
                  <View style={styles.timeTag}>
                    <Text style={styles.timeTagText}>7:30 - 9:30 PM</Text>
                  </View>
                </View>
                <Text style={styles.mealSubtitle}>Target: ~550 kcal</Text>
              </View>
            </View>
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingBadgeText}>Upcoming</Text>
            </View>
          </View>
          <Text style={styles.mealMenuText}>
            Phulka (3 pcs) + Paneer Butter Masala / Chicken Gravy + Fresh Green Salad
          </Text>
        </View>

        {/* ==================================================== */}
        {/* 4. MESS HALL QUEUE DELIGHT CARD                      */}
        {/* ==================================================== */}
        <View style={styles.queueCard}>
          <View style={styles.queueLeft}>
            <View style={styles.queueIconBox}>
              <Text style={styles.queueEmoji}>👥</Text>
            </View>
            <View>
              <Text style={styles.queueTitle}>Mess Hall Queue</Text>
              <Text style={styles.queueSubtitle}>
                Moderate rush (~4 mins wait at North Counter)
              </Text>
            </View>
          </View>
          <View style={styles.queueBadge}>
            <Text style={styles.queueBadgeText}>Fast Moving</Text>
          </View>
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
  headerSection: {
    marginBottom: 16,
  },
  dateStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  dateIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  dateText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NourishColors.primary,
    marginRight: 6,
  },
  statusText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  greetingTitle: {
    ...NourishTypography.headlineLg,
    color: NourishColors.textDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    ...NourishTypography.bodySm,
    color: NourishColors.textSecondary,
  },
  heroCard: {
    marginBottom: 20,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroGreenBar: {
    width: 5,
    height: 18,
    borderRadius: 3,
    backgroundColor: NourishColors.primary,
    marginRight: 8,
  },
  heroTitle: {
    ...NourishTypography.titleLg,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  remainingBadge: {
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  remainingBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  gaugeNumeralsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 16,
  },
  numeralsCol: {
    flex: 1,
  },
  caloriesNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  consumedNumber: {
    ...NourishTypography.displayLg,
    color: NourishColors.primary,
  },
  targetNumber: {
    ...NourishTypography.titleLg,
    color: NourishColors.textSecondary,
  },
  caloriesLabel: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  trackWellnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  wellnessText: {
    ...NourishTypography.bodySm,
    color: NourishColors.primary,
    fontWeight: '600',
  },
  macroTilesContainer: {
    flexDirection: 'row',
    backgroundColor: NourishColors.surfaceContainerLow,
    padding: 8,
    borderRadius: 18,
    gap: 8,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTitle: {
    ...NourishTypography.headlineSm,
    color: NourishColors.textDark,
  },
  mealCountBadge: {
    backgroundColor: NourishColors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  mealCountText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  fullWeekLink: {
    ...NourishTypography.labelMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  mealCard: {
    backgroundColor: NourishColors.surfaceWhite,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  mealCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mealInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: NourishColors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheck: {
    color: NourishColors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealCardTitle: {
    ...NourishTypography.titleMd,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  timeTag: {
    backgroundColor: NourishColors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  timeTagText: {
    fontSize: 10,
    color: NourishColors.textSecondary,
    fontWeight: '600',
  },
  mealSubtitle: {
    ...NourishTypography.bodySm,
    color: NourishColors.textSecondary,
    marginTop: 2,
  },
  portionedBadge: {
    backgroundColor: NourishColors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  portionedBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '600',
  },
  mealMenuText: {
    ...NourishTypography.bodyMd,
    color: NourishColors.textOnSurfaceVariant,
    marginTop: 10,
    marginLeft: 46,
  },
  activeMealCard: {
    marginBottom: 14,
  },
  activeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NourishColors.primaryFixed,
    marginRight: 4,
  },
  liveBadgeText: {
    ...NourishTypography.labelSm,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  activeMealTitle: {
    ...NourishTypography.titleLg,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  recBadge: {
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  recBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  optimalChoicePill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NourishColors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  optimalChoiceText: {
    ...NourishTypography.labelMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  optimalTimeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  activeMenuSummary: {
    ...NourishTypography.bodyMd,
    color: NourishColors.textDark,
    fontWeight: '600',
    marginBottom: 10,
  },
  smartSwapTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(216, 232, 222, 0.5)',
    padding: 10,
    borderRadius: 14,
    gap: 8,
  },
  smartSwapTipIcon: {
    fontSize: 16,
  },
  smartSwapTipTitle: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  smartSwapTipBody: {
    ...NourishTypography.bodySm,
    color: NourishColors.textOnSurfaceVariant,
    marginTop: 2,
  },
  highlightGreen: {
    color: NourishColors.primary,
    fontWeight: '700',
  },
  upcomingBadge: {
    backgroundColor: NourishColors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  upcomingBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  queueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NourishColors.surfaceContainerLow,
    padding: 14,
    borderRadius: 18,
    marginTop: 4,
  },
  queueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  queueIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: NourishColors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueEmoji: {
    fontSize: 18,
  },
  queueTitle: {
    ...NourishTypography.titleMd,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  queueSubtitle: {
    ...NourishTypography.bodySm,
    color: NourishColors.textSecondary,
    marginTop: 2,
  },
  queueBadge: {
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  queueBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
});
