import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../src/theme';

export default function LoginEntranceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { loginAsCustomer, loginAsWasher } = useBooking();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  // Active Channel Tab ('customer' | 'washer')
  const [activeChannel, setActiveChannel] = useState<'customer' | 'washer'>('customer');

  // Form Inputs
  const [custInput, setCustInput] = useState('+60 12-345 6789');
  const [custPass, setCustPass] = useState('••••••••');

  const [washerInput, setWasherInput] = useState('+60 18-987 6543');
  const [washerPin, setWasherPin] = useState('••••');

  const handleCustomerLogin = () => {
    loginAsCustomer(custInput);
    router.replace('/customer');
  };

  const handleWasherLogin = () => {
    loginAsWasher(washerInput);
    router.replace('/washer');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* HERO BRAND HEADER */}
        <View style={styles.brandHeroBox}>
          <View style={styles.brandBadgeRow}>
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 26 }}>🧼</Text>
            </View>
            <Text style={styles.brandTitleText}>WashCar <Text style={styles.brandAccentText}>MY</Text></Text>
            <View style={styles.myTag}>
              <Text style={styles.myTagText}>🇲🇾 MALAYSIA</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>
            Malaysia's Premier Doorstep Mobile Detailing Platform
          </Text>
          <Text style={styles.heroSubText}>
            Select your login channel below to access customer car wash booking or detailer job workbench.
          </Text>
        </View>

        {/* DUAL CHANNEL LOGIN CONTAINER */}
        <View style={[styles.portalContainerCard, isDesktop && styles.portalContainerDesktop]}>

          {/* CHANNEL SELECTOR TABS (MOBILE & TABLET) */}
          <View style={styles.channelTabRow}>
            <TouchableOpacity
              style={[styles.channelTabBtn, activeChannel === 'customer' && styles.channelTabActiveCustomer]}
              onPress={() => setActiveChannel('customer')}
              activeOpacity={0.9}
            >
              <Text style={styles.channelTabIcon}>👤</Text>
              <View>
                <Text style={[styles.channelTabTitle, activeChannel === 'customer' && styles.channelTextActive]}>
                  洗车客户登录
                </Text>
                <Text style={[styles.channelTabSub, activeChannel === 'customer' && styles.channelSubActive]}>
                  Customer Sign In
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.channelTabBtn, activeChannel === 'washer' && styles.channelTabActiveWasher]}
              onPress={() => setActiveChannel('washer')}
              activeOpacity={0.9}
            >
              <Text style={styles.channelTabIcon}>🛵</Text>
              <View>
                <Text style={[styles.channelTabTitle, activeChannel === 'washer' && styles.channelTextActive]}>
                  洗车员/接单端登录
                </Text>
                <Text style={[styles.channelTabSub, activeChannel === 'washer' && styles.channelSubActive]}>
                  Washer Partner Sign In
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* DUAL LOGIN FORM CARDS (SIDE-BY-SIDE ON DESKTOP, SWITCHED ON MOBILE) */}
          <View style={[styles.formsGrid, isDesktop && styles.formsGridDesktop]}>

            {/* CHANNEL 1: CUSTOMER LOGIN CARD */}
            {(isDesktop || activeChannel === 'customer') && (
              <View style={[styles.formCard, isDesktop && styles.formCardDesktop, activeChannel === 'customer' && styles.formCardActiveBorder]}>
                <View style={styles.formCardHeader}>
                  <View style={styles.channelIconCircle}>
                    <Text style={{ fontSize: 24 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.formTitle}>洗车客户登录入口</Text>
                    <Text style={styles.formSub}>Customer Car Wash Booking Portal</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Malaysian Phone Number / Email:</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputPrefix}>🇲🇾 +60</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="12-345 6789 or email@example.com"
                      value={custInput}
                      onChangeText={setCustInput}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password / OTP Code:</Text>
                  <TextInput
                    style={styles.textInputFull}
                    placeholder="Enter password or OTP"
                    secureTextEntry
                    value={custPass}
                    onChangeText={setCustPass}
                  />
                </View>

                <TouchableOpacity
                  style={styles.loginCustomerBtn}
                  onPress={handleCustomerLogin}
                  activeOpacity={0.9}
                >
                  <Text style={styles.loginCustomerBtnText}>登录客户账号 (Login as Customer) →</Text>
                </TouchableOpacity>

                {/* DEMO ONE-CLICK BUTTON */}
                <TouchableOpacity
                  style={styles.demoCustomerBtn}
                  onPress={() => loginAsCustomer('+60 12-345 6789')}
                >
                  <Text style={styles.demoCustomerText}>⚡ 演示客户一键登录 (Lee Wei Jian)</Text>
                </TouchableOpacity>

                <Text style={styles.registerSubText}>
                  Don't have an account? <Text style={styles.linkText} onPress={() => handleCustomerLogin()}>Register Instant Account →</Text>
                </Text>
              </View>
            )}

            {/* CHANNEL 2: CAR WASHER / DETAILER LOGIN CARD */}
            {(isDesktop || activeChannel === 'washer') && (
              <View style={[styles.formCard, isDesktop && styles.formCardDesktop, activeChannel === 'washer' && styles.formCardActiveWasherBorder]}>
                <View style={styles.formCardHeader}>
                  <View style={[styles.channelIconCircle, styles.washerIconCircle]}>
                    <Text style={{ fontSize: 24 }}>🛵</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.formTitle}>洗车员/接单端登录入口</Text>
                    <Text style={styles.formSub}>Pro Washer Partner Workbench</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Registered Detailer Mobile / ID:</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputPrefix}>🛵 ID / +60</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="18-987 6543 or Washer ID"
                      value={washerInput}
                      onChangeText={setWasherInput}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Security PIN / Passcode:</Text>
                  <TextInput
                    style={styles.textInputFull}
                    placeholder="Enter 4-digit PIN"
                    secureTextEntry
                    value={washerPin}
                    onChangeText={setWasherPin}
                  />
                </View>

                <TouchableOpacity
                  style={styles.loginWasherBtn}
                  onPress={handleWasherLogin}
                  activeOpacity={0.9}
                >
                  <Text style={styles.loginWasherBtnText}>登录洗车员账号 (Login as Washer) →</Text>
                </TouchableOpacity>

                {/* DEMO ONE-CLICK WASHER BUTTON */}
                <TouchableOpacity
                  style={styles.demoWasherBtn}
                  onPress={() => loginAsWasher('+60 18-987 6543')}
                >
                  <Text style={styles.demoWasherText}>⚡ 演示洗车员一键登录 (Amir Hazim)</Text>
                </TouchableOpacity>

                <Text style={styles.registerSubText}>
                  Want to become a detailer? <Text style={styles.linkText} onPress={() => handleWasherLogin()}>Apply Partner Verification →</Text>
                </Text>
              </View>
            )}

          </View>
        </View>

        {/* PLATFORM VALUE PROPS FOOTER */}
        <View style={styles.footerFeaturesGrid}>
          <View style={styles.featureItemCard}>
            <Text style={{ fontSize: 22 }}>⚡</Text>
            <Text style={styles.featTitle}>30-Min Rapid Dispatch</Text>
            <Text style={styles.featSub}>On-demand mobile detailers near KL & PJ.</Text>
          </View>

          <View style={styles.featureItemCard}>
            <Text style={{ fontSize: 22 }}>💧</Text>
            <Text style={styles.featTitle}>Low-Water Eco System</Text>
            <Text style={styles.featSub}>Zero runoff. Condo basement approved.</Text>
          </View>

          <View style={styles.featureItemCard}>
            <Text style={{ fontSize: 22 }}>💳</Text>
            <Text style={styles.featTitle}>FPX & DuitNow Pay</Text>
            <Text style={styles.featSub}>Instant transfers & TNG eWallet support.</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  mainWrapper: {
    padding: spacing.lg,
  },
  mainWrapperDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xxl,
  },

  brandHeroBox: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitleText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.brandNavy,
    letterSpacing: -0.5,
  },
  brandAccentText: {
    color: colors.primaryBlue,
  },
  myTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  myTagText: {
    color: colors.primaryDark,
    fontSize: 9,
    fontWeight: '900',
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 540,
    lineHeight: 18,
  },

  portalContainerCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xxl,
    ...shadows.medium,
  },
  portalContainerDesktop: {
    padding: spacing.xl,
  },

  channelTabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
    gap: 6,
  },
  channelTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
  },
  channelTabActiveCustomer: {
    backgroundColor: colors.primaryBlue,
  },
  channelTabActiveWasher: {
    backgroundColor: colors.washerAccent,
  },
  channelTabIcon: {
    fontSize: 22,
  },
  channelTabTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textDark,
  },
  channelTabSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  channelTextActive: {
    color: '#ffffff',
  },
  channelSubActive: {
    color: 'rgba(255,255,255,0.8)',
  },

  formsGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  formsGridDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  formCard: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  formCardDesktop: {
    flex: 1,
  },
  formCardActiveBorder: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
  },
  formCardActiveWasherBorder: {
    borderColor: colors.washerAccent,
    borderWidth: 2,
  },

  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  channelIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  washerIconCircle: {
    backgroundColor: colors.washerLight,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  formSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },

  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
  },
  inputPrefix: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textDark,
  },
  textInputFull: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textDark,
  },

  loginCustomerBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    ...shadows.soft,
  },
  loginCustomerBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  demoCustomerBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: 14,
  },
  demoCustomerText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },

  loginWasherBtn: {
    backgroundColor: colors.washerAccent,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    ...shadows.soft,
  },
  loginWasherBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  demoWasherBtn: {
    backgroundColor: colors.washerLight,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: 14,
  },
  demoWasherText: {
    color: colors.washerDark,
    fontSize: 12,
    fontWeight: '900',
  },

  registerSubText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primaryBlue,
    fontWeight: '800',
  },

  footerFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureItemCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    ...shadows.subtle,
  },
  featTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 4,
  },
  featSub: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
});
