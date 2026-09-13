import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';

export default function WasherMessagesScreen() {
  const { activeBooking } = useBooking();
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'washer', text: 'Salam! I have accepted your booking and am on the way to Bangsar Telawi 3.', time: '10:14 AM' },
    { id: 'm2', sender: 'customer', text: 'Hi Ahmad, please register at the guardhouse when you arrive.', time: '10:15 AM' },
    { id: 'm3', sender: 'washer', text: 'Understood! I will park at visitor bay B2 #45.', time: '10:16 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: 'm_' + Date.now(), sender: 'washer', text: inputText, time: 'Now' }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.custName}>Customer: {activeBooking?.location?.label || 'Lee Wei Jian'}</Text>
          <Text style={styles.vehicleText}>🚗 {activeBooking?.vehicle?.plateNumber} • Perodua Myvi</Text>
        </View>
        <TouchableOpacity style={styles.callBtn} onPress={() => alert('Calling customer...')}>
          <Text style={styles.callText}>📞 Call Customer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesArea} contentContainerStyle={{ padding: spacing.md }}>
        {messages.map((m) => {
          const isWasher = m.sender === 'washer';
          return (
            <View key={m.id} style={[styles.msgWrapper, isWasher ? styles.msgRight : styles.msgLeft]}>
              <View style={[styles.msgBubble, isWasher ? styles.bubbleWasher : styles.bubbleCustomer]}>
                <Text style={[styles.msgText, isWasher ? styles.textWasher : styles.textCustomer]}>{m.text}</Text>
                <Text style={[styles.msgTime, isWasher ? styles.timeWasher : styles.timeCustomer]}>{m.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Message customer..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  custName: { fontSize: 14, fontWeight: '800', color: colors.textDark },
  vehicleText: { fontSize: 11, color: colors.textMuted },
  callBtn: { backgroundColor: colors.successLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.sm },
  callText: { color: colors.successDark, fontWeight: '800', fontSize: 12 },
  messagesArea: { flex: 1 },
  msgWrapper: { marginBottom: spacing.md, flexDirection: 'row' },
  msgLeft: { justifyContent: 'flex-start' },
  msgRight: { justifyContent: 'flex-end' },
  msgBubble: { maxWidth: '80%', padding: spacing.md, borderRadius: borderRadius.lg },
  bubbleWasher: { backgroundColor: colors.successGreen, borderBottomRightRadius: 2 },
  bubbleCustomer: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.borderLight, borderBottomLeftRadius: 2 },
  msgText: { fontSize: 13, lineHeight: 18 },
  textWasher: { color: '#ffffff' },
  textCustomer: { color: colors.textDark },
  msgTime: { fontSize: 9, marginTop: 4, textAlign: 'right' },
  timeWasher: { color: 'rgba(255,255,255,0.7)' },
  timeCustomer: { color: colors.textMuted },
  inputBar: { flexDirection: 'row', padding: spacing.md, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: colors.borderLight, gap: 8 },
  textInput: { flex: 1, backgroundColor: colors.backgroundLight, borderRadius: borderRadius.pill, paddingHorizontal: 16, fontSize: 13 },
  sendBtn: { backgroundColor: colors.successGreen, paddingHorizontal: 18, borderRadius: borderRadius.pill, justifyContent: 'center' },
  sendText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
});
