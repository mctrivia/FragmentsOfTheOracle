import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors, fonts, spacing } from '../theme';

interface Props {
  ntClaim: string;
  onContinue: () => void;
}

export function NTClaimReveal({ ntClaim, onContinue }: Props) {
  const slideAnim = useRef(new Animated.Value(120)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.accentBorder} />

        <Text style={styles.header}>What the New Testament Claimed</Text>

        <View style={styles.divider} />

        <Text style={styles.claimText}>{ntClaim}</Text>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={onContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.accentDim,
    position: 'relative',
    overflow: 'hidden',
  },
  accentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    ...fonts.heading,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 17,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceLight,
    marginVertical: spacing.md,
  },
  claimText: {
    ...fonts.body,
    lineHeight: 28,
    textAlign: 'center',
    color: colors.text,
  },
  continueBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  continueBtnText: {
    ...fonts.button,
    fontSize: 18,
  },
});
