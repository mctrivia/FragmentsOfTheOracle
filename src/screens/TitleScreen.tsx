import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { colors, fonts, spacing } from '../theme';
import { useGameStore } from '../store/useGameStore';
import { DustParticles } from '../components/DustParticles';
import { images } from '../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'Title'>;

export function TitleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { save, reset } = useGameStore();

  const hasProgress = save && save.completedLevels.length > 0;

  return (
    <ImageBackground
      source={images.titleBackground}
      style={[styles.container, { paddingTop: insets.top + spacing.xxl }]}
      imageStyle={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <DustParticles count={15} />
      <View style={styles.titleBlock}>
        <Text style={styles.subtitle}>~ a puzzle of ancient texts ~</Text>
        <Text style={styles.title}>Fragments{'\n'}of the Oracle</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ArchiveMap')}
        >
          <Text style={styles.primaryBtnText}>
            {hasProgress ? 'Continue' : 'Begin'}
          </Text>
        </TouchableOpacity>

        {hasProgress && (
          <>
            <View style={styles.stats}>
              <Text style={styles.statsText}>
                {save!.completedLevels.length} levels completed
              </Text>
              <Text style={styles.statsText}>
                {save!.scrollFragments} fragments · {save!.archiveKeys} keys · {save!.insightPoints} insight
              </Text>
            </View>
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetBtnText}>Reset Progress</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={[styles.version, { paddingBottom: insets.bottom + spacing.md }]}>
        Prototype v0.1
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 20, 16, 0.55)',
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  subtitle: {
    ...fonts.caption,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 44,
  },
  buttons: {
    alignItems: 'center',
    width: '100%',
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryBtnText: {
    ...fonts.button,
    fontSize: 18,
  },
  stats: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  statsText: {
    ...fonts.caption,
    marginBottom: spacing.xs,
  },
  resetBtn: {
    marginTop: spacing.md,
  },
  resetBtnText: {
    ...fonts.caption,
    color: colors.error,
  },
  version: {
    ...fonts.caption,
    opacity: 0.5,
  },
});
