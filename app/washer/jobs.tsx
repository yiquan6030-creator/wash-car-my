import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';

export default function WasherJobsScreen() {
  const router = useRouter();
  const { updateBookingStatus, deliveryJobs, acceptDeliveryJob } = useBooking();

  const handleAcceptWash = () => {
    updateBookingStatus('assigned');
    alert('Wash Request Accepted! Navigating to job execution.');
    router.replace('/washer');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Dispatch Requests 💼</Text>

      {/* NEW WASH REQUEST POP-UP CARD */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>⚡ NEW WASH REQUEST</Text>
          <View style={styles.timerBadge}><Text style={styles.timerText}>⏳ 28s</Text></View>
        </View>

        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>WASHER EARNINGS:</Text>
          <Text style={styles.payoutValue}>RM 38.40</Text>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}><Text style={styles.detailKey}>Service:</Text><Text style={styles.detailVal}>Interior + Exterior</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailKey}>Distance:</Text><Text style={styles.detailVal}>2.1 km away</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailKey}>Customer Area:</Text><Text style={styles.detailVal}>Bangsar Telawi 3</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailKey}>Vehicle:</Text><Text style={styles.detailVal}>Perodua Myvi (Hatchback)</Text></View>
          <View style={styles.detailItem}><Text style={styles.detailKey}>Est. Duration:</Text><Text style={styles.detailVal}>45 min</Text></View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.declineBtn} onPress={() => alert('Wash Request Declined')}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptWash}>
            <Text style={styles.acceptText}>Accept Job (RM 38.40) →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CAR CARE PRODUCT DELIVERY (EXTRA EARNINGS FEATURE) */}
      <Text style={styles.sectionTitle}>Product Delivery Opportunities 📦</Text>
      <Text style={styles.sectionSub}>Earn extra money by delivering WashCar MY car-care products nearby.</Text>

      {deliveryJobs.map((del) => (
        <View key={del.id} style={styles.deliveryCard}>
          <View style={styles.delHeader}>
            <Text style={styles.delTag}>📦 EXTRA DELIVERY AVAILABLE</Text>
            <Text style={styles.delEarning}>+RM {del.earningMYR.toFixed(2)}</Text>
          </View>
          
          <Text style={styles.prodName}>{del.productName}</Text>
          <Text style={styles.delLine}>🏬 Pickup: <Text style={styles.bold}>{del.hubPickup}</Text></Text>
          <Text style={styles.delLine}>📍 Delivery: <Text style={styles.bold}>{del.deliveryCustomerArea}</Text></Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={() => alert('Delivery skipped')}>
              <Text style={styles.declineText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.acceptDelBtn} 
              onPress={() => {
                acceptDeliveryJob(del.id);
                alert(`Accepted Delivery for ${del.productName}! RM6.00 credited upon dropoff.`);
              }}
            >
              <Text style={styles.acceptDelText}>Accept Delivery (+RM 6.00) →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: colors.textDark, marginBottom: spacing.md },
  alertCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 2, borderColor: colors.successGreen },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertTitle: { fontSize: 12, fontWeight: '900', color: colors.successDark, letterSpacing: 0.5 },
  timerBadge: { backgroundColor: colors.amberLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.pill },
  timerText: { fontSize: 11, fontWeight: '900', color: colors.amberOffer },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.successLight, padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: 12 },
  payoutLabel: { fontSize: 11, fontWeight: '900', color: colors.successDark },
  payoutValue: { fontSize: 22, fontWeight: '900', color: colors.successGreen },
  detailGrid: { marginBottom: 14 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: 4, marginBottom: 6 },
  detailKey: { fontSize: 12, color: colors.textMuted },
  detailVal: { fontSize: 12, fontWeight: '800', color: colors.textDark },
  btnRow: { flexDirection: 'row', gap: 8 },
  declineBtn: { width: '30%', backgroundColor: '#f1f5f9', paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  declineText: { color: colors.textMuted, fontWeight: '800', fontSize: 13 },
  acceptBtn: { width: '67%', backgroundColor: colors.successGreen, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  acceptText: { color: '#ffffff', fontWeight: '900', fontSize: 14 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: 2 },
  sectionSub: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },
  deliveryCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight },
  delHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  delTag: { fontSize: 10, fontWeight: '900', color: colors.primaryBlue },
  delEarning: { fontSize: 16, fontWeight: '900', color: colors.successGreen },
  prodName: { fontSize: 14, fontWeight: '800', color: colors.textDark, marginBottom: 4 },
  delLine: { fontSize: 12, color: colors.textDark, marginBottom: 2 },
  bold: { fontWeight: '800' },
  acceptDelBtn: { width: '67%', backgroundColor: colors.primaryBlue, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  acceptDelText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
});
