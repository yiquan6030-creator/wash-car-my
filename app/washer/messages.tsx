import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';

export default function WasherMessagesScreen() {
  const { width } = useWindowDimensions();
  const { activeBooking } = useBooking();
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'washer', text: 'Salam boss! I have accepted your booking and am on the way to Bangsar Telawi 3.', time: '10:14 AM' },
    { id: 'm2', sender: 'customer', text: 'Hi Amir, please register at the guardhouse when you arrive.', time: '10:15 AM' },
    { id: 'm3', sender: 'washer', text: 'Understood! I will park at visitor bay B2 #45.', time: '10:16 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const isDesktop = width >= 1024;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: 'm_' + Date.now(), sender: 'washer', text: inputText, time: 'Now' }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* CHAT HEADER */}
        <View style={styles.chatHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.custNameText}>Customer: {activeBooking?.location?.label || 'Lee Wei Jian'}</Text>
            <Text style={styles.vehicleText}>🚗 {activeBooking?.vehicle?.plateNumber || 'VWB 8819'} • Perodua Myvi (Hatchback)</Text>
          </View>

          <TouchableOpacity style={styles.callBtn} onPress={() => alert('Calling customer at +60 12-345 6789...')}>
            <Text style={styles.callText}>📞 Call Customer</Text>
          </TouchableOpacity>
        </View>

        {/* MESSAGES AREA */}
        <ScrollView style={styles.messagesArea} contentContainerStyle={styles.chatContentContainer} showsVerticalScrollIndicator={false}>
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

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message to Lee Wei Jian..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.9}>
            <Text style={styles.sendText}>Send →</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  mainWrapper: {
    flex: 1,
    padding: spacing.lg,
  },
  mainWrapperDesktop: {
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  custNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  vehicleText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  callBtn: {
    backgroundColor: colors.washerLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  callText: {
    color: colors.washerDark,
    fontWeight: '800',
    fontSize: 12,
  },

  messagesArea: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
  },
  chatContentContainer: {
    gap: 12,
    paddingBottom: spacing.lg,
  },
  msgWrapper: {
    flexDirection: 'row',
  },
  msgLeft: {
    justifyContent: 'flex-start',
  },
  msgRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.subtle,
  },
  bubbleWasher: {
    backgroundColor: colors.washerAccent,
    borderBottomRightRadius: 2,
  },
  bubbleCustomer: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  textWasher: {
    color: '#ffffff',
  },
  textCustomer: {
    color: colors.textDark,
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'right',
  },
  timeWasher: {
    color: colors.washerLight,
  },
  timeCustomer: {
    color: colors.textMuted,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.md,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.textDark,
  },
  sendBtn: {
    backgroundColor: colors.washerAccent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
});
