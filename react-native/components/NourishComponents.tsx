import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  NourishColors,
  NourishTypography,
  NourishShapes,
  NourishShadows,
} from '../theme';

// ====================================================================
// 1. ARCH CANOPY HERO CARD (Architectural Dome Motif)
// ====================================================================
interface ArchCanopyHeroCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const ArchCanopyHeroCard: React.FC<ArchCanopyHeroCardProps> = ({
  children,
  style,
  backgroundColor = NourishColors.surfaceWhite,
}) => {
  return (
    <View
      style={[
        styles.archCanopyCard,
        { backgroundColor },
        NourishShadows.elevated,
        style,
      ]}
    >
      <View style={styles.decorativeLeaf} pointerEvents="none" />
      {children}
    </View>
  );
};

// ====================================================================
// 2. CIRCULAR FUEL GAUGE
// ====================================================================
interface CircularFuelGaugeProps {
  currentCalories: number;
  targetCalories: number;
  size?: number;
}

export const CircularFuelGauge: React.FC<CircularFuelGaugeProps> = ({
  currentCalories,
  targetCalories,
  size = 100,
}) => {
  const percentage = Math.min(
    100,
    Math.round((currentCalories / (targetCalories || 1)) * 100)
  );

  return (
    <View style={[styles.gaugeContainer, { width: size, height: size }]}>
      {/* Outer Circular Ring Container */}
      <View
        style={[
          styles.gaugeOuterRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: NourishColors.secondaryFixed,
          },
        ]}
      >
        {/* Accent Active Arc Indicator */}
        <View
          style={[
            styles.gaugeAccentRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: NourishColors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.gaugeInnerContent}>
        <Text style={styles.gaugeLeafIcon}>🌿</Text>
        <Text style={styles.gaugePercentageText}>{percentage}%</Text>
      </View>
    </View>
  );
};

// ====================================================================
// 3. NUMBERED MINT BADGE
// ====================================================================
interface NumberedMintBadgeProps {
  number: number | string;
  size?: number;
}

export const NumberedMintBadge: React.FC<NumberedMintBadgeProps> = ({
  number,
  size = 36,
}) => {
  return (
    <View
      style={[
        styles.mintBadge,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.mintBadgeText}>{number}</Text>
    </View>
  );
};

// ====================================================================
// 4. MACRO PROGRESS TILE
// ====================================================================
interface MacroProgressTileProps {
  label: string;
  currentGrams: number;
  targetGrams: number;
  iconSymbol: string;
  barColor: string;
  iconBgColor?: string;
  style?: ViewStyle;
}

export const MacroProgressTile: React.FC<MacroProgressTileProps> = ({
  label,
  currentGrams,
  targetGrams,
  iconSymbol,
  barColor,
  iconBgColor = NourishColors.secondaryFixed,
  style,
}) => {
  const progressPercent = Math.min(
    100,
    Math.round((currentGrams / (targetGrams || 1)) * 100)
  );

  return (
    <View style={[styles.macroTile, NourishShadows.soft, style]}>
      <View style={[styles.macroIconCircle, { backgroundColor: iconBgColor }]}>
        <Text style={styles.macroIconText}>{iconSymbol}</Text>
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.macroValueRow}>
        <Text style={styles.macroCurrentValue}>{currentGrams}</Text>
        <Text style={styles.macroTargetValue}>/{targetGrams}g</Text>
      </View>
      <View style={styles.macroTrack}>
        <View
          style={[
            styles.macroFill,
            { width: `${progressPercent}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
};

// ====================================================================
// 5. SMART SWAP CARD
// ====================================================================
interface SmartSwapCardProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  counterSlot?: string;
  onSwapPress: () => void;
  style?: ViewStyle;
}

export const SmartSwapCard: React.FC<SmartSwapCardProps> = ({
  title,
  subtitle,
  badgeText = 'Non-Veg Counter',
  counterSlot = 'Slot 3B',
  onSwapPress,
  style,
}) => {
  return (
    <View style={[styles.cardBase, NourishShadows.soft, style]}>
      <View style={styles.swapHeaderRow}>
        <Text style={styles.swapHeaderIcon}>⇄</Text>
        <Text style={styles.swapHeaderTitle}>Non-Veg Smart Swap</Text>
      </View>

      <View style={styles.swapBodyRow}>
        <View style={styles.swapAvatarBox}>
          <Text style={styles.swapAvatarEmoji}>🥚</Text>
        </View>

        <View style={styles.swapContentCol}>
          <View style={styles.swapTitleActionRow}>
            <Text style={styles.swapTitle} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity
              style={styles.swapButton}
              onPress={onSwapPress}
              activeOpacity={0.8}
            >
              <Text style={styles.swapButtonText}>Swap</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.swapSubtitle}>{subtitle}</Text>

          <View style={styles.swapTagsRow}>
            <View style={styles.nonVegBadge}>
              <Text style={styles.nonVegBadgeText}>{badgeText}</Text>
            </View>
            <Text style={styles.counterSlotText}>{counterSlot}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ====================================================================
// 6. GUIDED PLATE ITEM CARD
// ====================================================================
interface GuidedPlateItemCardProps {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  badge?: string;
  isSelected: boolean;
  onToggle: () => void;
  style?: ViewStyle;
}

export const GuidedPlateItemCard: React.FC<GuidedPlateItemCardProps> = ({
  name,
  portion,
  calories,
  protein,
  carbs,
  badge,
  isSelected,
  onToggle,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.cardBase, NourishShadows.soft, styles.plateCard, style]}
      onPress={onToggle}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.checkboxCircle,
          isSelected && styles.checkboxCircleSelected,
        ]}
      >
        {isSelected && <Text style={styles.checkMark}>✓</Text>}
      </View>

      <View style={styles.plateItemContent}>
        <View style={styles.plateItemTitleRow}>
          <Text style={styles.plateItemTitle}>{name}</Text>
          {badge && (
            <View style={styles.plateItemBadge}>
              <Text style={styles.plateItemBadgeText}>{badge}</Text>
            </View>
          )}
        </View>

        <Text style={styles.plateItemPortion}>{portion}</Text>

        <View style={styles.plateItemMacrosRow}>
          <Text style={styles.plateItemCal}>{calories} kcal</Text>
          <Text style={styles.plateItemMacro}>• {protein}g Protein</Text>
          <Text style={styles.plateItemMacro}>• {carbs}g Carbs</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ====================================================================
// 7. FOOD COURT CARD
// ====================================================================
interface FoodCourtItemCardProps {
  name: string;
  outlet: string;
  location: string;
  price: number;
  calories: number;
  protein: number;
  isVeg: boolean;
  tag?: string;
  onAddPress: () => void;
  style?: ViewStyle;
}

export const FoodCourtItemCard: React.FC<FoodCourtItemCardProps> = ({
  name,
  outlet,
  location,
  price,
  calories,
  protein,
  isVeg,
  tag,
  onAddPress,
  style,
}) => {
  return (
    <View style={[styles.foodCourtCard, NourishShadows.soft, style]}>
      {/* Banner */}
      <View style={styles.foodCourtBanner}>
        <View style={styles.dietaryPill}>
          <View
            style={[
              styles.dietaryDot,
              {
                backgroundColor: isVeg
                  ? NourishColors.vegGreen
                  : NourishColors.nonVegAmber,
              },
            ]}
          />
          <Text style={styles.dietaryPillText}>
            {isVeg ? 'Veg Delicacy' : 'Non-Veg Pick'}
          </Text>
        </View>

        {tag && (
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>{tag}</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.foodCourtBody}>
        <View style={styles.foodCourtTitleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.foodCourtTitle}>{name}</Text>
            <Text style={styles.foodCourtSubtitle}>
              {outlet} • {location}
            </Text>
          </View>
          <Text style={styles.foodCourtPrice}>₹{price}</Text>
        </View>

        <View style={styles.foodCourtMacrosRow}>
          <View style={styles.macroBadge}>
            <Text style={styles.macroBadgeText}>{calories} kcal</Text>
          </View>
          <View style={styles.macroBadge}>
            <Text style={styles.macroBadgeText}>{protein}g Protein</Text>
          </View>
        </View>

        <View style={styles.foodCourtActionRow}>
          <View style={styles.deficitPill}>
            <Text style={styles.deficitPillIcon}>✓</Text>
            <Text style={styles.deficitPillText}>Fits calorie deficit</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ====================================================================
// 8. NOURISH PILL BUTTON
// ====================================================================
interface NourishPillButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const NourishPillButton: React.FC<NourishPillButtonProps> = ({
  title,
  onPress,
  icon,
  backgroundColor = NourishColors.primary,
  textColor = NourishColors.onPrimary,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.pillButton,
        { backgroundColor },
        NourishShadows.soft,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {icon ? <Text style={styles.pillButtonIcon}>{icon}</Text> : null}
      <Text style={[styles.pillButtonText, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ====================================================================
// 9. NOURISH CHIP
// ====================================================================
interface NourishChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const NourishChip: React.FC<NourishChipProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected ? styles.chipSelected : styles.chipUnselected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.chipText,
          isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ====================================================================
// 10. NOURISH TOP BAR
// ====================================================================
interface NourishTopBarProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
}

export const NourishTopBar: React.FC<NourishTopBarProps> = ({
  title,
  subtitle = 'VIT-AP UNIVERSITY',
  onBackPress,
}) => {
  return (
    <View style={styles.topBarContainer}>
      <View style={styles.topBarLeft}>
        {onBackPress ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandIconBox}>
            <Text style={styles.brandIconText}>🌿</Text>
          </View>
        )}
        <View style={styles.topBarTitleCol}>
          <Text style={styles.topBarSubtitle}>{subtitle}</Text>
          <Text style={styles.topBarTitle}>{title}</Text>
        </View>
      </View>

      <View style={styles.topBarRight}>
        <View style={styles.notificationIconBox}>
          <Text style={styles.notificationIconText}>🔔</Text>
        </View>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      </View>
    </View>
  );
};

// ====================================================================
// STYLESHEET
// ====================================================================
const styles = StyleSheet.create({
  archCanopyCard: {
    ...NourishShapes.archCanopy,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeLeaf: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(27, 94, 74, 0.04)',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeOuterRing: {
    borderWidth: 8,
    position: 'absolute',
  },
  gaugeAccentRing: {
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  gaugeInnerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeLeafIcon: {
    fontSize: 18,
  },
  gaugePercentageText: {
    ...NourishTypography.labelMd,
    color: NourishColors.textDark,
    marginTop: 2,
  },
  mintBadge: {
    backgroundColor: NourishColors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mintBadgeText: {
    ...NourishTypography.titleMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  macroTile: {
    flex: 1,
    backgroundColor: NourishColors.surfaceWhite,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  macroIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  macroIconText: {
    fontSize: 14,
  },
  macroLabel: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  macroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  macroCurrentValue: {
    ...NourishTypography.titleMd,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  macroTargetValue: {
    fontSize: 10,
    color: NourishColors.textSecondary,
    marginLeft: 1,
  },
  macroTrack: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(216, 232, 222, 0.6)',
    marginTop: 6,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardBase: {
    backgroundColor: NourishColors.surfaceWhite,
    borderRadius: 20,
    padding: 16,
  },
  swapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  swapHeaderIcon: {
    fontSize: 18,
    color: NourishColors.primary,
    marginRight: 6,
  },
  swapHeaderTitle: {
    ...NourishTypography.titleLg,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  swapBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swapAvatarBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: NourishColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  swapAvatarEmoji: {
    fontSize: 26,
  },
  swapContentCol: {
    flex: 1,
  },
  swapTitleActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  swapTitle: {
    ...NourishTypography.titleMd,
    color: NourishColors.textDark,
    flex: 1,
    marginRight: 8,
  },
  swapButton: {
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  swapButtonText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  swapSubtitle: {
    ...NourishTypography.bodySm,
    color: NourishColors.textOnSurfaceVariant,
    marginTop: 2,
  },
  swapTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  nonVegBadge: {
    backgroundColor: NourishColors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginRight: 8,
  },
  nonVegBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.error,
  },
  counterSlotText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
  },
  plateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: NourishColors.outline,
    backgroundColor: NourishColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCircleSelected: {
    backgroundColor: NourishColors.primary,
    borderColor: NourishColors.primary,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  plateItemContent: {
    flex: 1,
  },
  plateItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  plateItemTitle: {
    ...NourishTypography.titleMd,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  plateItemBadge: {
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginLeft: 6,
  },
  plateItemBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  plateItemPortion: {
    ...NourishTypography.bodySm,
    color: NourishColors.textSecondary,
    marginTop: 2,
  },
  plateItemMacrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  plateItemCal: {
    ...NourishTypography.labelMd,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  plateItemMacro: {
    ...NourishTypography.labelMd,
    color: NourishColors.textOnSurfaceVariant,
  },
  foodCourtCard: {
    backgroundColor: NourishColors.surfaceWhite,
    borderRadius: 22,
    overflow: 'hidden',
  },
  foodCourtBanner: {
    height: 120,
    backgroundColor: NourishColors.surfaceContainerHigh,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dietaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  dietaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dietaryPillText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textDark,
  },
  tagPill: {
    backgroundColor: NourishColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tagPillText: {
    ...NourishTypography.labelSm,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  foodCourtBody: {
    padding: 16,
  },
  foodCourtTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  foodCourtTitle: {
    ...NourishTypography.titleLg,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  foodCourtSubtitle: {
    ...NourishTypography.bodySm,
    color: NourishColors.textSecondary,
    marginTop: 2,
  },
  foodCourtPrice: {
    ...NourishTypography.titleLg,
    color: NourishColors.primary,
    fontWeight: '800',
  },
  foodCourtMacrosRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  macroBadge: {
    backgroundColor: NourishColors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  macroBadgeText: {
    ...NourishTypography.labelSm,
    color: NourishColors.textDark,
  },
  foodCourtActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  deficitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NourishColors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  deficitPillIcon: {
    color: NourishColors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  deficitPillText: {
    ...NourishTypography.labelSm,
    color: NourishColors.primary,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: NourishColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  addButtonText: {
    ...NourishTypography.labelMd,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pillButton: {
    height: 50,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pillButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  pillButtonText: {
    ...NourishTypography.labelLg,
    fontWeight: '700',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: NourishColors.primary,
    borderColor: NourishColors.primary,
  },
  chipUnselected: {
    backgroundColor: NourishColors.surfaceWhite,
    borderColor: NourishColors.outlineLight,
  },
  chipText: {
    ...NourishTypography.labelMd,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipTextUnselected: {
    color: NourishColors.textSecondary,
    fontWeight: '500',
  },
  topBarContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: NourishColors.background,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: NourishColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: NourishColors.textDark,
  },
  brandIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: NourishColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    fontSize: 18,
  },
  topBarTitleCol: {
    justifyContent: 'center',
  },
  topBarSubtitle: {
    ...NourishTypography.labelSm,
    color: NourishColors.textSecondary,
    letterSpacing: 0.8,
  },
  topBarTitle: {
    ...NourishTypography.titleLg,
    color: NourishColors.textDark,
    fontWeight: '700',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIconText: {
    fontSize: 18,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NourishColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
});
