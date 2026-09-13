import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: PrimaryButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryBtn;
      case 'success':
        return styles.successBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'danger':
        return styles.dangerBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btnBase, getButtonStyle(), disabled && styles.disabledBtn, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#ffffff'} />
      ) : (
        <Text style={[styles.textBase, getTextStyle(), textStyle]}>
          {icon ? `${icon} ` : ''}{title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnBase: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  secondaryBtn: {
    backgroundColor: colors.primaryLight,
  },
  successBtn: {
    backgroundColor: colors.washerAccent,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerBtn: {
    backgroundColor: '#ef4444',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: 15,
    fontWeight: '800',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: colors.primaryDark,
  },
  outlineText: {
    color: colors.primary,
  },
});
