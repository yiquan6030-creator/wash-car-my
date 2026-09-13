import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';
import Badge from '../../src/components/Badge';
import PrimaryButton from '../../src/components/PrimaryButton';

export default function CompleteWashJobScreen() {
  const router = useRouter();
  const { activeBooking, updateStatus } = useBooking();
  const [afterPhotoUploaded, setAfterPhotoUploaded] = useState(true);

  const handleFinalizeJob = () => {
    updateStatus('completed');
    alert('Wash job completed! Payout credited to your available balance.');
    router.replace('/washer');
  };

  const payoutRM = activeBooking ? Math.round(activeBooking.totalMYR * 0.8) : 38.40;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.successBanner}>
        <Text style={styles.icon}>✨</Text>
        <Text style={styles.title}>Wash Completed!</Text>
        <Text style={styles.subtitle}>Upload after-wash verification photos to credit your RM payout.</Text>
      </View>

      {/* After Photos Upload Section */}
      <Text style={styles.sectionHeader}>After-Wash Verification Photos</Text>
      <View style={styles.photoBox}>
        <Image 
          source={{ uri: activeBooking?.afterPhotoUrl || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400' }} 
          style={styles.photoImg} 
        />
        <View style={styles.photoRow}>
          <Badge label="✓ AFTER WASH VERIFIED" variant="success" />
          <TouchableOpacity onPress={() => setAfterPhotoUploaded(true)}>
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payout Summary Box */}
      <View style={styles.payoutCard}>
        <Text style={styles.payoutLabel}>JOB PAYOUT CREDITED (80% COMMISSION)</Text>
        <Text style={styles.payoutValue}>+ RM {payoutRM.toFixed(2)}</Text>
        <Text style={styles.payoutSub}>Credited instantly to your available withdrawal balance</Text>
      </View>

      <PrimaryButton
        title="Complete Job & Return to Washer Home →"
        onPress={handleFinalizeJob}
        variant="success"
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  successBanner: { backgroundColor: colors.washerLight, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: '#86efac' },
  icon: { fontSize: 36, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '900', color: colors.washerDark, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.washerDark, textAlign: 'center', marginTop: 2 },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: colors.textDark, marginBottom: spacing.sm },
  photoBox: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.lg },
  photoImg: { width: '100%', height: 160, borderRadius: borderRadius.md, marginBottom: 10 },
  photoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  retakeText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  payoutCard: { backgroundColor: colors.washerDark, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.md },
  payoutLabel: { fontSize: 10, fontWeight: '800', color: colors.washerLight, letterSpacing: 0.5 },
  payoutValue: { fontSize: 32, fontWeight: '900', color: '#ffffff', marginVertical: 4 },
  payoutSub: { fontSize: 12, color: '#bbf7d0' },
});
