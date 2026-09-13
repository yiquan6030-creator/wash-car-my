import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function CustomerMessagesScreen() {
  const { activeBooking } = useBooking();
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'washer', text: "Salam boss! I'm on the way to Jalan Telawi 3, Bangsar. Reaching in about 8 mins.", time: '09:35 AM' },
    { id: 'm2', sender: 'customer', text: 'Hi Amir! Perfect, my Perodua Myvi is parked at Basement B2 near the lift lobby.', time: '09:37 AM' },
    { id: 'm3', sender: 'washer', text: 'Noted boss! Will call you once I set up the mobile waterless/snow foam unit. 👍', time: '09:38 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const quickChips = [
    "I'm here",
    "Which parking level?",
    "Please call me",
    "I'll be there shortly",
  ];

  const handleSend = (textToSend?: string) => {
    const content = textToSend || inputMsg;
    if (!content.trim()) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'customer',
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    if (!textToSend) setInputMsg('');
  };

  return (
    <View style={styles.container}>
      {/* Detailer Header Bar */}
      <View style={styles.headerBar}>
        <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.washerName}>Amir (Detailer)</Text>
          <Text style={styles.statusOnline}>● Online • Perodua Myvi (VWB 8819)</Text>
        </View>
        <TouchableOpacity style={styles.callIconBtn} onPress={() => alert('Calling Amir...')}>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Message Chat History */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.chatContent}>
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          return (
            <View 
              key={msg.id} 
              style={[styles.msgBubble, isCustomer ? styles.msgCustomer : styles.msgWasher]}
            >
              <Text style={[styles.msgText, isCustomer && styles.msgTextCustomer]}>
                {msg.text}
              </Text>
              <Text style={[styles.msgTime, isCustomer && styles.msgTimeCustomer]}>
                {msg.time}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Quick Chips Bar */}
      <View style={styles.chipsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {quickChips.map((chip, index) => (
            <TouchableOpacity key={index} style={styles.chipBtn} onPress={() => handleSend(chip)}>
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Message Input Box */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message to Amir..."
          value={inputMsg}
          onChangeText={setInputMsg}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, ...shadows.soft },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: colors.primaryBlue },
  washerName: { fontSize: 15, fontWeight: '900', color: colors.textDark },
  statusOnline: { fontSize: 11, color: colors.successGreen, fontWeight: '700', marginTop: 1 },
  callIconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  callIcon: { fontSize: 16 },
  chatContent: { padding: spacing.lg, gap: 12 },
  msgBubble: { maxWidth: '80%', padding: spacing.md, borderRadius: borderRadius.lg },
  msgWasher: { alignSelf: 'flex-start', backgroundColor: '#ffffff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: colors.borderLight },
  msgCustomer: { alignSelf: 'flex-end', backgroundColor: colors.primaryBlue, borderBottomRightRadius: 2 },
  msgText: { fontSize: 13, color: colors.textDark, lineHeight: 18 },
  msgTextCustomer: { color: '#ffffff' },
  msgTime: { fontSize: 9, color: colors.textMuted, marginTop: 4, textAlign: 'right' },
  msgTimeCustomer: { color: '#e0f2fe' },
  chipsSection: { backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: colors.borderLight, paddingVertical: 8, paddingHorizontal: spacing.md },
  chipsScroll: { flexDirection: 'row' },
  chipBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.pill, marginRight: 8 },
  chipText: { fontSize: 11, fontWeight: '800', color: colors.primaryDark },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight, gap: 8 },
  input: { flex: 1, backgroundColor: colors.backgroundLight, borderRadius: borderRadius.pill, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, borderWidth: 1, borderColor: colors.borderLight },
  sendBtn: { backgroundColor: colors.primaryBlue, paddingHorizontal: 18, paddingVertical: 10, borderRadius: borderRadius.pill },
  sendBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
});
