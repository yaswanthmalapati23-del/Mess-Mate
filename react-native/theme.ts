/**
 * Nourish Botanical Modern Theme Tokens
 * Generated from Google Stitch Project: Mess Mate (projects/8997926635352647246)
 */

export const NourishColors = {
  // Botanical Core Chroma
  primary: '#1B5E4A',            // Deep Forest Green
  primaryDark: '#004534',        // Deep Pine
  primaryContainer: '#1B5E4A',
  onPrimary: '#FFFFFF',
  primaryFixed: '#AEF0D6',       // Bright Mint Accent
  onPrimaryContainer: '#94D5BC',

  // Secondary & Mints
  secondary: '#53625A',          // Muted Botanical Slate
  secondaryContainer: '#D6E6DC', // Soft Sage
  secondaryFixed: '#D8E8DE',     // Signature Mint Badge
  onSecondaryContainer: '#596860',
  onSecondaryFixed: '#111E18',

  // Surfaces & Backgrounds
  background: '#FBF9F4',         // Warm Organic Cream
  surface: '#FBF9F4',
  surfaceWhite: '#FFFFFF',       // Elevated Card White
  surfaceContainerLow: '#F5F3EE',
  surfaceContainer: '#F0EEE9',
  surfaceContainerHigh: '#EAE8E3',
  surfaceContainerHighest: '#E4E2DD',

  // Text & Borders
  textDark: '#143026',           // High contrast Dark Green
  textSecondary: '#5F7A6E',      // Botanical Subtitle
  textOnSurfaceVariant: '#404944',
  outline: '#A9BFB5',
  outlineLight: 'rgba(169, 191, 181, 0.4)',

  // Alerts & Accents
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  tertiary: '#284237',
  tertiaryContainer: '#3F594E',
  tertiaryFixed: '#CCE9DB',
  vegGreen: '#059669',
  nonVegAmber: '#B45309',
};

export const NourishTypography = {
  fontFamily: 'System', // Plus Jakarta Sans on devices with custom fonts loaded
  displayLg: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  headlineLg: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  headlineMd: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleLg: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  titleMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  labelLg: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
  labelSm: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
  },
};

export const NourishShapes = {
  archCanopy: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  card: {
    borderRadius: 20,
  },
  pill: {
    borderRadius: 9999,
  },
  badge: {
    borderRadius: 12,
  },
};

export const NourishShadows = {
  soft: {
    shadowColor: '#143026',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#143026',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
};
