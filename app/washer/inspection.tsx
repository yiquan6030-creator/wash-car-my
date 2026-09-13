import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';
import Badge from '../../src/components/Badge';
import PrimaryButton from '../../src/components/PrimaryButton';

export default function BeforeServiceInspectionScreen() {
  const router = useRouter();
  const { activeBooking, updateStatus } = useBooking();

  // 4-Angle Photo Captured States
  const [frontCaptured, setFrontCaptured] = useState(true);
  const [rearCaptured, setRearCaptured] = useState(true);
  const [leftCaptured, setLeftCaptured] = useState(true);
  const [rightCaptured, setRightCaptured] = useState(true);

  // Existing Damage Checklist
  const [damageItems, setDamageItems] = useState([
    { id: 'd1', label: 'Front Bumper Scratches', checked: true },
    { id: 'd2', label: 'Left Passenger Door Dent', checked: false },
    { id: 'd3', label: 'Windscreen Stone Chip', checked: false },
    { id: 'd4', label: 'Interior Seat Stains', checked: true },
  ]);

  const toggleDamage = (id: string) => {
    setDamageItems(damageItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleStartWash = () => {
    updateStatus('washing');
    router.replace('/washer/washing');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Before-Service Inspection 📷</Text>
      <Text style={styles.subtitle}>Perform 4-angle vehicle photo check and log pre-existing damage.</Text>

      {/* 4-Angle Photo Grid */}
      <Text style={styles.sectionHeader}>1. Required 4-Angle Vehicle Photos</Text>
      <View style={styles.photoGrid}>
        <TouchableOpacity style={styles.photoCard} onPress={() => setFrontCaptured(!frontCaptured)}>
          <Text style={styles.photoTitle}>1. FRONT VIEW</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=250' }} style={styles.photoImg} />
          <Badge label={frontCaptured ? '✓ CAPTURED' : 'TAP TO CAPTURE'} variant={frontCaptured ? 'success' : 'neutral'} style={{ marginTop: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoCard} onPress={() => setRearCaptured(!rearCaptured)}>
          <Text style={styles.photoTitle}>2. REAR VIEW</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=250' }} style={styles.photoImg} />
          <Badge label={rearCaptured ? '✓ CAPTURED' : 'TAP TO CAPTURE'} variant={rearCaptured ? 'success' : 'neutral'} style={{ marginTop: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoCard} onPress={() => setLeftCaptured(!leftCaptured)}>
          <Text style={styles.photoTitle}>3. LEFT SIDE</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=250' }} style={styles.photoImg} />
          <Badge label={leftCaptured ? '✓ CAPTURED' : 'TAP TO CAPTURE'} variant={leftCaptured ? 'success' : 'neutral'} style={{ marginTop: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoCard} onPress={() => setRightCaptured(!rightCaptured)}>
          <Text style={styles.photoTitle}>4. RIGHT SIDE</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=250' }} style={styles.photoImg} />
          <Badge label={rightCaptured ? '✓ CAPTURED' : 'TAP TO CAPTURE'} variant={rightCaptured ? 'success' : 'neutral'} style={{ marginTop: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Existing Damage Checklist */}
      <Text style={styles.sectionHeader}>2. Pre-Existing Damage Checklist</Text>
      <View style={styles.checklistCard}>
        {damageItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.checkRow} onPress={() => toggleDamage(item.id)}>
            <View style={[styles.checkBox, item.checked && styles.checkBoxChecked]}>
              {item.checked && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={[styles.checkLabel, item.checked && styles.checkLabelChecked]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        title="Confirm Inspection & Start Wash →"
        onPress={handleStartWash}
        variant="success"
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.textDark, marginBottom: 2 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: colors.textDark, marginTop: spacing.md, marginBottom: spacing.sm },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  photoCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: borderRadius.md, padding: spacing.sm, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center' },
  photoTitle: { fontSize: 11, fontWeight: '800', color: colors.textMuted, marginBottom: 4 },
  photoImg: { width: '100%', height: 90, borderRadius: borderRadius.sm },
  checklistCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  checkBox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkBoxChecked: { backgroundColor: colors.washerAccent, borderColor: colors.washerAccent },
  checkMark: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  checkLabel: { fontSize: 14, color: colors.textDark },
  checkLabelChecked: { fontWeight: '700', color: colors.washerDark },
});
