import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  onSelectRating?: (rating: number) => void;
  isInteractive?: boolean;
  size?: number;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  onSelectRating,
  isInteractive = false,
  size = 20,
}: RatingStarsProps) {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= rating;

    if (isInteractive && onSelectRating) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => onSelectRating(i)} activeOpacity={0.7}>
          <Text style={[styles.starText, { fontSize: size, color: isFilled ? '#f59e0b' : '#cbd5e1' }]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    } else {
      stars.push(
        <Text key={i} style={[styles.starText, { fontSize: size, color: isFilled ? '#f59e0b' : '#cbd5e1' }]}>
          ★
        </Text>
      );
    }
  }

  return <View style={styles.starRow}>{stars}</View>;
}

const styles = StyleSheet.create({
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    marginRight: 4,
    fontWeight: '900',
  },
});
