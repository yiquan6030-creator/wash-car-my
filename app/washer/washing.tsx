import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';
import Badge from '../../src/components/Badge';
import PrimaryButton from '../../src/components/PrimaryButton';

export default function WashingInProgressScreen() {
  const router = useRouter();
  const { activeBooking, updateStatus } = useBooking();

  // Wash Duration Timer State (seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(745); // ~12m 25s for prototype preview

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Interactive Wash Task Checklist
  const [tasks, setTasks] = useState([
    { id: 't1', label: 'Exterior Snow Foam / Waterless Hand Spray Wash', done: true },
    { id: 't2', label: 'Tyre Cleaning & Rim Decontamination', done: true },
    { id: 't3', label: 'Interior Cabin & Boot Vacuuming', done: true },
    { id: 't4', label: 'Dashboard, Steering & Console Wipe-down', done: false },
    { id: 't5', label: 'Glass Clarity Cleaning & Windscreen Polish', done: false },
    { id: 't6', label: 'Anti-Bacterial Aircon Nano Mist Sanitizer', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleFinishWash = () => {
    updateStatus('completed');
    router.replace('/washer/complete');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Live Timer Banner */}
      <View style={styles.timerCard}>
        <Text style={styles.timerTag}>WASH IN PROGRESS 🧼</Text>
        <Text style={styles.timerValue}>{formatTimer(elapsedSeconds)}</Text>
        <Text style={styles.timerSub}>Estimated target duration: 45:00 mins</Text>
      </View>

      {/* Customer & Vehicle Context */}
      {activeBooking && (
        <View style={styles.contextBox}>
          <Text style={styles.custName}>Customer: Lee Wei Jian 👋</Text>
          <Text style={styles.detailText}>🚗 {activeBooking.vehicle.plateNumber} • {activeBooking.vehicle.make} {activeBooking.vehicle.model}</Text>
          <Text style={styles.detailText}>✨ {activeBooking.service.name} (RM {activeBooking.totalMYR})</Text>
        </View>
      )}

      {/* Interactive Service Checklist */}
      <Text style={styles.sectionHeader}>Service Task Checklist</Text>
      <View style={styles.checklistCard}>
        {tasks.map((task) => (
          <TouchableOpacity key={task.id} style={styles.taskRow} onPress={() => toggleTask(task.id)}>
            <View style={[styles.checkBox, task.done && styles.checkBoxDone]}>
              {task.done && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={[styles.taskLabel, task.done && styles.taskLabelDone]}>{task.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        title="Finish Wash & Capture After Photos →"
        onPress={handleFinishWash}
        variant="success"
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  timerCard: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  timerTag: { color: colors.primaryLight, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  timerValue: { color: '#ffffff', fontSize: 42, fontWeight: '900', marginVertical: 4 },
  timerSub: { color: '#e0f2fe', fontSize: 12 },
  contextBox: { backgroundColor: '#ffffff', borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight },
  custName: { fontSize: 15, fontWeight: '800', color: colors.textDark, marginBottom: 4 },
  detailText: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.sm },
  checklistCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.md },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  checkBox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkBoxDone: { backgroundColor: colors.washerAccent, borderColor: colors.washerAccent },
  checkMark: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  taskLabel: { fontSize: 13, color: colors.textDark, flex: 1 },
  taskLabelDone: { textDecorationLine: 'line-through', color: colors.textMuted },
});
