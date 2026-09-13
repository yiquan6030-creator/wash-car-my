import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'popular';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({
  label,
  variant = 'primary',
  style,
  textStyle,
}: BadgeProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return styles.successBadge;
      case 'warning':
        return styles.warningBadge;
      case 'popular':
        return styles.popularBadge;
      case 'neutral':
        return styles.neutralBadge;
      default:
        return styles.primaryBadge;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'success':
        return styles.successText;
      case 'warning':
      case 'popular':
        return styles.warningText;
      case 'neutral':
        return styles.neutralText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <View style={[styles.badgeBase, getBadgeStyle(), style]}>
      <Text style={[styles.textBase, getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeBase: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  primaryBadge: {
    backgroundColor: colors.primaryLight,
  },
  successBadge: {
    backgroundColor: colors.washerLight,
  },
  warningBadge: {
    backgroundColor: colors.warningLight,
  },
  popularBadge: {
    backgroundColor: colors.warning,
  },
  neutralBadge: {
    backgroundColor: '#e2e8f0',
  },
  textBase: {
    fontSize: 11,
    fontWeight: '800',
  },
  primaryText: {
    color: colors.primaryDark,
  },
  successText: {
    color: colors.washerDark,
  },
  warningText: {
    color: '#92400e',
  },
  neutralText: {
    color: '#475569',
  },
});
