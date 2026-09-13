export const colors = {
  // Brand Primary & Accent
  brandNavy: '#0f172a', // Dark Navy Brand Accent
  primaryBlue: '#0284c7', // Cyan / Blue Primary Accent
  primaryLight: '#e0f2fe',
  primaryDark: '#0369a1',

  // Alias keys for legacy/shared components
  primary: '#0284c7',
  background: '#f8fafc',
  border: '#e2e8f0',

  // Washer Mode Specific Colors
  washerAccent: '#16a34a',
  washerDark: '#15803d',
  washerLight: '#dcfce7',

  // Status & Success
  successGreen: '#16a34a', // Emerald Green for completed/success
  successLight: '#dcfce7',
  successDark: '#15803d',

  // Warning & Offers
  amberOffer: '#f59e0b',
  amberLight: '#fef3c7',
  warning: '#f59e0b',
  warningLight: '#fef3c7',

  // Clean Light Surfaces & Neutrals
  surfaceWhite: '#ffffff',
  backgroundLight: '#f8fafc',
  borderLight: '#e2e8f0',
  borderMedium: '#cbd5e1',
  textDark: '#0f172a',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
};

export const typography = {
  headerTitle: { fontSize: 22, fontWeight: '900' as const, color: colors.textDark },
  sectionTitle: { fontSize: 16, fontWeight: '800' as const, color: colors.textDark },
  cardTitle: { fontSize: 15, fontWeight: '800' as const, color: colors.textDark },
  bodyText: { fontSize: 13, fontWeight: '400' as const, color: colors.textDark },
  subText: { fontSize: 11, fontWeight: '500' as const, color: colors.textMuted },
  badgeText: { fontSize: 10, fontWeight: '800' as const },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const shadows = {
  soft: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};
