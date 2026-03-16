import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { colors, fonts, spacing } from '../theme';
import { getLevel, getPassage, getDialogue, getRoom, levels } from '../data';
import { PuzzleShell } from '../components/PuzzleShell';
import { DialogueBanner } from '../components/DialogueBanner';
import { DustParticles } from '../components/DustParticles';
import { renderPuzzle } from '../engine/puzzle/PuzzleRegistry';
import { images } from '../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'Puzzle'>;

export function PuzzleScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { levelId } = route.params;

  const level = useMemo(() => getLevel(levelId), [levelId]);
  const passage = useMemo(
    () => (level ? getPassage(level.passageIds[0]) : undefined),
    [level],
  );
  const dialogue = useMemo(
    () => (level ? getDialogue(level.introDialogueId) : undefined),
    [level],
  );
  const room = useMemo(() => (level ? getRoom(level.roomId) : undefined), [level]);
  const levelNum = useMemo(() => levels.findIndex((l) => l.id === levelId) + 1, [levelId]);

  if (!level || !passage) {
    return (
      <View style={styles.error}>
        <Text style={fonts.body}>Level not found.</Text>
      </View>
    );
  }

  const handleComplete = () => {
    navigation.replace('Reward', { levelId: level.id });
  };

  const puzzleBg = images.puzzles[level.puzzleType];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {puzzleBg && (
        <ImageBackground
          source={puzzleBg}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          imageStyle={{ opacity: 0.08 }}
        />
      )}
      <DustParticles count={8} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.roomLabel}>{room?.title || ''}</Text>
        <Text style={styles.levelNum}>Level {levelNum}/{levels.length}</Text>
      </View>

      <PuzzleShell
        title={level.title}
        subtitle={`${level.puzzleType.replace(/_/g, ' ')} · ${'●'.repeat(level.difficulty)}${'○'.repeat(5 - level.difficulty)}`}
        scrollEnabled={level.puzzleType !== 'reconstruction'}
      >
        {dialogue && <DialogueBanner dialogue={dialogue} />}
        {renderPuzzle({ level, passage, onComplete: handleComplete })}
      </PuzzleShell>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  backBtn: {
    ...fonts.body,
    color: colors.accent,
  },
  roomLabel: {
    ...fonts.caption,
    color: colors.accentDim,
  },
  levelNum: {
    ...fonts.caption,
    color: colors.textDim,
  },
  error: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
