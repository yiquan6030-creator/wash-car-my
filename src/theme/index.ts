export const colors = {
  // Brand Dark & Slate
  brandDark: '#090d16',
  brandNavy: '#0f172a',
  slateHeader: '#1e293b',

  // Brand Primary Accent
  primaryBlue: '#0284c7', // WashCar Cyan Blue
  primaryElectric: '#0ea5e9',
  primaryLight: '#e0f2fe',
  primaryDark: '#0369a1',

  // Alias keys for legacy/shared components
  primary: '#0284c7',
  background: '#f8fafc',
  border: '#e2e8f0',

  // Washer Mode Specific Colors
  washerAccent: '#10b981',
  washerDark: '#059669',
  washerLight: '#d1fae5',

  // Status & Success
  successGreen: '#10b981',
  successLight: '#d1fae5',
  successDark: '#059669',

  // Warning, Error & Offers
  amberOffer: '#f59e0b',
  amberLight: '#fef3c7',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  errorDark: '#dc2626',

  // Clean Light Surfaces & Neutrals
  surfaceWhite: '#ffffff',
  surfaceCard: '#ffffff',
  backgroundLight: '#f8fafc',
  surfaceElevated: '#f1f5f9',
  borderLight: '#e2e8f0',
  borderMedium: '#cbd5e1',
  borderDark: '#94a3b8',
  textDark: '#0f172a',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
};

export const typography = {
  displayTitle: { fontSize: 28, fontWeight: '900' as const, color: colors.textDark, letterSpacing: -0.5 },
  headerTitle: { fontSize: 22, fontWeight: '900' as const, color: colors.textDark },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: colors.textDark },
  cardTitle: { fontSize: 15, fontWeight: '800' as const, color: colors.textDark },
  eyebrow: { fontSize: 10, fontWeight: '900' as const, color: colors.primaryBlue, letterSpacing: 0.8 },
  bodyText: { fontSize: 13, fontWeight: '400' as const, color: colors.textDark },
  subText: { fontSize: 11, fontWeight: '500' as const, color: colors.textMuted },
  badgeText: { fontSize: 10, fontWeight: '800' as const },
};

export const borderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const shadows = {
  subtle: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  soft: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 5,
  },
};

