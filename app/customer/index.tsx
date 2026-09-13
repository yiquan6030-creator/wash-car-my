import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SERVICE_CATEGORIES, PROMOTIONS, SERVICE_ADDONS, SAMPLE_WASHER } from '../../src/services/mockData';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { activeBooking, setDraftService } = useBooking();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. TOP HEADER */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🚗</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>WashCar <Text style={styles.brandAccent}>MY</Text></Text>
            <Text style={styles.greetingText}>Good morning, Lee Wei Jian 👋</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => alert('Notifications: Your washer Amir is 8 minutes away!')}
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/customer/profile')}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. CURRENT LOCATION */}
      <View style={styles.locationCard}>
        <View style={styles.locLeft}>
          <View style={styles.pinIconBox}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
          <View>
            <Text style={styles.locLabel}>WASH LOCATION</Text>
            <Text style={styles.locAddress}>Jalan Telawi 3, Bangsar, KL</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.changeLocBtn}
          onPress={() => router.push('/customer/book')}
        >
          <Text style={styles.changeLocText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* 3. MAIN BOOKING HERO */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Doorstep Car Wash Service</Text>
        <Text style={styles.heroSubtitle}>We come to your condo, landed home, office or parking bay.</Text>

        <TouchableOpacity 
          style={styles.heroCTA}
          onPress={() => router.push('/customer/book')}
          activeOpacity={0.9}
        >
          <Text style={styles.heroCTAText}>Book a Car Wash Now →</Text>
        </TouchableOpacity>

        <View style={styles.heroBadgesRow}>
          <View style={styles.heroBadge}><Text style={styles.badgeText}>From RM28</Text></View>
          <View style={styles.heroBadge}><Text style={styles.badgeText}>⚡ Washer nearby</Text></View>
          <View style={styles.heroBadge}><Text style={styles.badgeText}>💧 Low-water eco</Text></View>
        </View>
      </View>

      {/* 4. ACTIVE BOOKING CARD (Clean soft border style) */}
      {activeBooking && (
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <Text style={styles.activeTitle}>Washer is on the way 🛵</Text>
            <View style={styles.etaBadge}>
              <Text style={styles.etaText}>ETA: 8 min</Text>
            </View>
          </View>

          {/* Washer Profile Info */}
          <View style={styles.washerProfileRow}>
            <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.washerAvatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.washerName}>Amir</Text>
                <Text style={styles.washerRating}>★ 4.90</Text>
              </View>
              <Text style={styles.washerDetail}>
                Perodua Myvi • <Text style={styles.boldText}>VWB 8819</Text>
              </Text>
              <Text style={styles.serviceDetail}>
                {activeBooking.service.name} (RM {activeBooking.totalMYR})
              </Text>
            </View>
          </View>

          {/* Progress Timeline */}
          <View style={styles.timelineBox}>
            <View style={styles.timelineSteps}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.dotDone]}><Text style={styles.dotCheck}>✓</Text></View>
                <Text style={styles.stepText}>Confirmed</Text>
              </View>
              <View style={styles.stepLineDone} />
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.dotDone]}><Text style={styles.dotCheck}>✓</Text></View>
                <Text style={styles.stepText}>Assigned</Text>
              </View>
              <View style={styles.stepLineDone} />
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.dotActive]}><Text style={styles.dotCheck}>3</Text></View>
                <Text style={[styles.stepText, styles.stepTextActive]}>On The Way</Text>
              </View>
              <View style={styles.stepLinePending} />
              <View style={styles.stepItem}>
                <View style={styles.stepDot}><Text style={styles.dotPending}>4</Text></View>
                <Text style={styles.stepTextMuted}>Washing</Text>
              </View>
              <View style={styles.stepLinePending} />
              <View style={styles.stepItem}>
                <View style={styles.stepDot}><Text style={styles.dotPending}>5</Text></View>
                <Text style={styles.stepTextMuted}>Completed</Text>
              </View>
            </View>
          </View>

          {/* Buttons: Track Live Map (Primary), Chat (Secondary), Call Icon */}
          <View style={styles.activeBtnRow}>
            <TouchableOpacity 
              style={styles.trackBtn} 
              onPress={() => router.push('/customer/tracking')}
              activeOpacity={0.9}
            >
              <Text style={styles.trackBtnText}>Track Live Map →</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.chatBtn} 
              onPress={() => router.push('/customer/messages')}
            >
              <Text style={styles.chatBtnText}>💬 Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.callIconBtn} 
              onPress={() => alert('Calling Amir at +60 12-345 6789...')}
            >
              <Text style={styles.callIconText}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 5. POPULAR SERVICES GRID */}
      <Text style={styles.sectionTitle}>Popular Services</Text>
      <View style={styles.serviceGrid}>
        {SERVICE_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.serviceCard}
            onPress={() => router.push({ pathname: '/customer/service-detail', params: { id: cat.id } })}
            activeOpacity={0.85}
          >
            {cat.badge && (
              <View style={styles.serviceBadge}>
                <Text style={styles.serviceBadgeText}>{cat.badge}</Text>
              </View>
            )}
            <Text style={styles.serviceIcon}>{cat.icon}</Text>
            <Text style={styles.serviceName}>{cat.name}</Text>
            <Text style={styles.serviceDesc} numberOfLines={1}>{cat.description}</Text>

            <View style={styles.serviceFooter}>
              <Text style={styles.servicePrice}>RM{cat.startingPriceMYR}</Text>
              <Text style={styles.serviceDuration}>{cat.durationRange}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 6. PROMOTIONS */}
      <Text style={styles.sectionTitle}>Promotions & Offers 🏷️</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
        {PROMOTIONS.map((promo) => (
          <View key={promo.id} style={[styles.promoCard, { backgroundColor: promo.colorBg }]}>
            <Text style={styles.promoDiscount}>{promo.discountText}</Text>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDesc}>{promo.description}</Text>
            <Text style={styles.promoCode}>Use Code: {promo.code}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 7. CAR CARE ADD-ONS */}
      <Text style={styles.sectionTitle}>Popular Car Care Add-ons</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addonScroll}>
        {SERVICE_ADDONS.map((addon) => (
          <View key={addon.id} style={styles.addonCard}>
            <Text style={styles.addonIcon}>{addon.icon}</Text>
            <Text style={styles.addonName}>{addon.name}</Text>
            <Text style={styles.addonPrice}>+RM{addon.priceMYR}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: { width: 38, height: 38, borderRadius: borderRadius.md, backgroundColor: colors.primaryBlue, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoIcon: { fontSize: 20 },
  brandTitle: { fontSize: 18, fontWeight: '900', color: colors.brandNavy },
  brandAccent: { color: colors.primaryBlue },
  greetingText: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: colors.borderLight },
  iconText: { fontSize: 16 },
  avatar: { width: 38, height: 38, borderRadius: 19 },

  locationCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.soft },
  locLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  pinIconBox: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  pinIcon: { fontSize: 16 },
  locLabel: { fontSize: 10, fontWeight: '800', color: colors.primaryDark, letterSpacing: 0.5 },
  locAddress: { fontSize: 13, fontWeight: '800', color: colors.textDark, marginTop: 1 },
  changeLocBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.sm },
  changeLocText: { color: colors.primaryDark, fontWeight: '800', fontSize: 12 },

  heroCard: { backgroundColor: colors.primaryBlue, borderRadius: borderRadius.xl, padding: spacing.xl, marginBottom: spacing.xl, ...shadows.soft },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  heroSubtitle: { color: colors.primaryLight, fontSize: 13, lineHeight: 18, marginBottom: 16 },
  heroCTA: { backgroundColor: '#ffffff', paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center', marginBottom: 14 },
  heroCTAText: { color: colors.primaryDark, fontWeight: '900', fontSize: 16 },
  heroBadgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.pill },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  activeCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.primaryBlue, ...shadows.soft },
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  activeTitle: { fontSize: 15, fontWeight: '900', color: colors.textDark },
  etaBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.pill },
  etaText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' },

  washerProfileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: colors.backgroundLight, padding: spacing.md, borderRadius: borderRadius.md },
  washerAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.primaryBlue },
  washerName: { fontSize: 15, fontWeight: '900', color: colors.textDark },
  washerRating: { fontSize: 12, color: colors.amberOffer, fontWeight: '800' },
  washerDetail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  boldText: { fontWeight: '800', color: colors.textDark },
  serviceDetail: { fontSize: 11, color: colors.primaryBlue, fontWeight: '800', marginTop: 1 },

  timelineBox: { marginBottom: 14 },
  timelineSteps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center' },
  stepDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  dotDone: { backgroundColor: colors.successGreen },
  dotActive: { backgroundColor: colors.primaryBlue },
  dotCheck: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
  dotPending: { color: colors.textMuted, fontSize: 9, fontWeight: '700' },
  stepText: { fontSize: 9, color: colors.textDark, marginTop: 2, fontWeight: '700' },
  stepTextActive: { color: colors.primaryBlue, fontWeight: '900' },
  stepTextMuted: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  stepLineDone: { flex: 1, height: 2, backgroundColor: colors.successGreen, marginBottom: 12 },
  stepLinePending: { flex: 1, height: 2, backgroundColor: colors.borderLight, marginBottom: 12 },

  activeBtnRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  trackBtn: { flex: 2, backgroundColor: colors.primaryBlue, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  trackBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  chatBtn: { flex: 1, backgroundColor: colors.primaryLight, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  chatBtnText: { color: colors.primaryDark, fontWeight: '800', fontSize: 12 },
  callIconBtn: { width: 42, height: 42, borderRadius: borderRadius.md, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  callIconText: { fontSize: 18 },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md, marginTop: spacing.sm },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.lg },
  serviceCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadows.soft, position: 'relative' },
  serviceBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: colors.amberOffer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: borderRadius.sm },
  serviceBadgeText: { color: '#ffffff', fontSize: 8, fontWeight: '900' },
  serviceIcon: { fontSize: 26, marginBottom: 6 },
  serviceName: { fontSize: 14, fontWeight: '800', color: colors.textDark },
  serviceDesc: { fontSize: 10, color: colors.textMuted, marginTop: 2, marginBottom: 8 },
  serviceFooter: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  servicePrice: { fontSize: 13, fontWeight: '900', color: colors.primaryBlue },
  serviceDuration: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },

  promoScroll: { flexDirection: 'row', marginBottom: spacing.xl },
  promoCard: { width: 220, borderRadius: borderRadius.lg, padding: spacing.md, marginRight: spacing.md },
  promoDiscount: { color: '#ffffff', fontSize: 18, fontWeight: '900' },
  promoTitle: { color: '#ffffff', fontSize: 13, fontWeight: '800', marginTop: 2 },
  promoDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 11, marginTop: 4, lineHeight: 15 },
  promoCode: { color: '#ffffff', fontSize: 10, fontWeight: '800', marginTop: 8, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.sm, alignSelf: 'flex-start' },

  addonScroll: { flexDirection: 'row', marginBottom: spacing.md },
  addonCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.md, padding: spacing.md, marginRight: spacing.md, width: 130, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', ...shadows.soft },
  addonIcon: { fontSize: 22, marginBottom: 4 },
  addonName: { fontSize: 12, fontWeight: '700', color: colors.textDark, textAlign: 'center', height: 28 },
  addonPrice: { fontSize: 13, fontWeight: '900', color: colors.primaryBlue, marginTop: 4 },
});
