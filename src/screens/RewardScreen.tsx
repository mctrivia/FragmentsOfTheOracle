import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { colors, fonts, spacing } from '../theme';
import { getLevel, getReward, getClue, getPassage } from '../data';
import { useGameStore } from '../store/useGameStore';
import { NTClaimReveal } from '../components/NTClaimReveal';
import { images } from '../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'Reward'>;

const rewardImages: Record<string, any> = {
  scroll_fragment: images.ui.scrollFragment,
  archive_key: images.ui.archiveKey,
  scholar_note: images.ui.scholarNote,
  insight_points: images.ui.insightPoint,
};

export function RewardScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { levelId } = route.params;
  const { completeLevel } = useGameStore();
  const [granted, setGranted] = useState(false);
  const [showNTClaim, setShowNTClaim] = useState(false);

  const level = useMemo(() => getLevel(levelId), [levelId]);
  const rewardItems = useMemo(
    () => (level ? level.rewardIds.map(getReward).filter(Boolean) : []),
    [level],
  );
  const clueItems = useMemo(
    () => (level ? level.clueRewardIds.map(getClue).filter(Boolean) : []),
    [level],
  );

  const firstPassage = useMemo(
    () => (level && level.passageIds.length > 0 ? getPassage(level.passageIds[0]) : undefined),
    [level],
  );
  const ntClaim = firstPassage?.ntClaim;

  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (level && !granted) {
      completeLevel(level.id, level.rewardIds, level.clueRewardIds);
      setGranted(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [level, granted]);

  if (!level) return null;

  if (showNTClaim && ntClaim) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg }]}>
        <NTClaimReveal
          ntClaim={ntClaim}
          onContinue={() => navigation.navigate('ArchiveMap')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.complete}>Level Complete</Text>
        <Text style={styles.levelTitle}>{level.title}</Text>

        <View style={styles.rewardsList}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          {rewardItems.map((r) => (
            <View key={r!.id} style={styles.rewardRow}>
              {rewardImages[r!.type] ? (
                <Image source={rewardImages[r!.type]} style={styles.rewardImg} resizeMode="contain" />
              ) : (
                <View style={styles.rewardImgPlaceholder} />
              )}
              <Text style={styles.rewardText}>
                {r!.title} {r!.amount > 1 ? `x${r!.amount}` : ''}
              </Text>
            </View>
          ))}
        </View>

        {clueItems.length > 0 && (
          <View style={styles.cluesList}>
            <Text style={styles.sectionTitle}>Clues Unlocked</Text>
            {clueItems.map((c) => (
              <View key={c!.id} style={styles.clueCard}>
                <Text style={styles.clueTitle}>{c!.title}</Text>
                <Text style={styles.clueBody}>{c!.body}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => {
          if (ntClaim) {
            setShowNTClaim(true);
          } else {
            navigation.navigate('ArchiveMap');
          }
        }}
      >
        <Text style={styles.continueBtnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  complete: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: spacing.sm,
    color: colors.success,
  },
  levelTitle: {
    ...fonts.title,
    marginBottom: spacing.xl,
  },
  rewardsList: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 6,
  },
  rewardImg: {
    width: 32,
    height: 32,
    marginRight: spacing.sm,
  },
  rewardImgPlaceholder: {
    width: 32,
    height: 32,
    marginRight: spacing.sm,
  },
  rewardText: {
    ...fonts.body,
  },
  cluesList: {
    width: '100%',
  },
  clueCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  clueTitle: {
    ...fonts.body,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  clueBody: {
    ...fonts.body,
    fontStyle: 'italic',
  },
  continueBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueBtnText: {
    ...fonts.button,
    fontSize: 18,
  },
});
