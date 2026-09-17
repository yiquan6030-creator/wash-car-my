import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function CustomerMessagesScreen() {
  const { width } = useWindowDimensions();
  const { activeBooking } = useBooking();
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'washer', text: "Salam boss! I'm en route to Jalan Telawi 3, Bangsar. Reaching in about 8 mins.", time: '09:35 AM' },
    { id: 'm2', sender: 'customer', text: 'Hi Amir! Perfect, my Perodua Myvi is parked at Basement B2 near the lift lobby.', time: '09:37 AM' },
    { id: 'm3', sender: 'washer', text: 'Noted boss! Will call you once I set up the mobile waterless/snow foam unit. 👍', time: '09:38 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const isDesktop = width >= 1024;
  const quickChips = [
    "I'm at the vehicle",
    "Which parking level?",
    "Please call when arrived",
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
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* DETAILER CHAT HEADER BAR */}
        <View style={styles.headerBar}>
          <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatarImage} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.washerName}>Amir Hazim</Text>
              <View style={styles.ratingBadgePill}>
                <Text style={styles.ratingBadgeText}>★ 4.95 Detailer</Text>
              </View>
            </View>
            <Text style={styles.statusOnline}>● Online • Perodua Myvi (VWB 8819)</Text>
          </View>

          <TouchableOpacity style={styles.callIconBtn} onPress={() => alert('Calling Amir Hazim at +60 12-345 6789...')}>
            <Text style={{ fontSize: 16 }}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* CHAT MESSAGES STREAM */}
        <ScrollView style={styles.chatScrollView} contentContainerStyle={styles.chatContentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.securityBanner}>
            <Text style={styles.securityText}>🔒 End-to-end encrypted messaging with your WashCar MY Detailer.</Text>
          </View>

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

        {/* QUICK PRESET CHIPS */}
        <View style={styles.chipsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {quickChips.map((chip, index) => (
              <TouchableOpacity key={index} style={styles.chipBtn} onPress={() => handleSend(chip)}>
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* INPUT INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message to Amir Hazim..."
            value={inputMsg}
            onChangeText={setInputMsg}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
            <Text style={styles.sendBtnText}>Send →</Text>
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

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.primaryBlue,
  },
  washerName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  ratingBadgePill: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  ratingBadgeText: {
    color: colors.amberOffer,
    fontSize: 9,
    fontWeight: '900',
  },
  statusOnline: {
    fontSize: 11,
    color: colors.successGreen,
    fontWeight: '700',
    marginTop: 2,
  },
  callIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatScrollView: {
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
  securityBanner: {
    backgroundColor: colors.surfaceElevated,
    padding: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },

  msgBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.subtle,
  },
  msgWasher: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  msgCustomer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primaryBlue,
    borderBottomRightRadius: 2,
  },
  msgText: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 18,
  },
  msgTextCustomer: {
    color: '#ffffff',
  },
  msgTime: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  msgTimeCustomer: {
    color: colors.primaryLight,
  },

  chipsSection: {
    marginVertical: spacing.md,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chipBtn: {
    backgroundColor: colors.surfaceWhite,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.pill,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
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
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
  },
  sendBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
});
