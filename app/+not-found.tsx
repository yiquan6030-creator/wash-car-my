import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { colors, borderRadius, spacing } from '../src/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.icon}>🧼</Text>
        <Text style={styles.title}>404 - Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you requested does not exist or has been moved.
        </Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
          <Text style={styles.homeBtnText}>Return to WashCar Home →</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.backgroundLight,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 360,
  },
  homeBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  homeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
