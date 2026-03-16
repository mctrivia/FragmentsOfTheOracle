import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { colors, fonts, spacing } from '../theme';
import { archiveRooms, getLevelsForRoom } from '../data';
import { useGameStore } from '../store/useGameStore';
import { isRoomUnlocked, isLevelPlayable, isLevelCompleted } from '../engine/progression/ProgressionEngine';
import { images } from '../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'ArchiveMap'>;

const themeColors: Record<string, string> = {
  royal_archive: colors.royal_archive,
  prophetic_archive: colors.prophetic_archive,
  exilic_archive: colors.exilic_archive,
  interpretive_archive: colors.interpretive_archive,
  messianic_archive: colors.messianic_archive,
};

export function ArchiveMapScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { save } = useGameStore();

  if (!save) return null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}
    >
      <Text style={styles.header}>The Archive</Text>
      <Text style={styles.subheader}>
        {save.archiveKeys} keys · {save.insightPoints} insight points
      </Text>

      {archiveRooms.map((room) => {
        const unlocked = isRoomUnlocked(room.id, save);
        const roomLevels = getLevelsForRoom(room.id);
        const themeColor = themeColors[room.theme] || colors.accent;

        return (
          <View
            key={room.id}
            style={[styles.room, !unlocked && styles.roomLocked]}
          >
            {images.rooms[room.id] && (
              <Image
                source={images.rooms[room.id]}
                style={styles.roomImage}
                resizeMode="cover"
              />
            )}
            <View style={[styles.roomHeader, { borderLeftColor: themeColor }]}>
              <Text style={[styles.roomTitle, { color: unlocked ? themeColor : colors.textDim }]}>
                {room.title}
              </Text>
              {!unlocked && (
                <Text style={styles.lockText}>
                  {room.requiredKeys > 0 ? `\u{1F511} ${room.requiredKeys} keys needed` : 'Complete prior levels'}
                </Text>
              )}
            </View>

            {unlocked && (() => {
              const completedCount = roomLevels.filter((l) => isLevelCompleted(l.id, save)).length;
              return (
                <>
                  <View style={styles.roomDescRow}>
                    <Text style={styles.roomDesc}>{room.description}</Text>
                    <Text style={[styles.roomProgress, { color: themeColor }]}>
                      {completedCount}/{roomLevels.length}
                    </Text>
                  </View>
                  {roomLevels.map((level) => {
                    const playable = isLevelPlayable(level, save);
                    const completed = isLevelCompleted(level.id, save);
                    const isCapstone = level.puzzleType === 'investigation';

                    return (
                      <TouchableOpacity
                        key={level.id}
                        style={[
                          styles.levelBtn,
                          completed && styles.levelCompleted,
                          !playable && styles.levelLocked,
                          isCapstone && styles.levelCapstone,
                        ]}
                        onPress={() => playable && navigation.navigate('Puzzle', { levelId: level.id })}
                        disabled={!playable}
                      >
                        <View style={styles.levelRow}>
                          <Text style={[styles.levelIcon, completed && { color: colors.success }]}>
                            {completed ? '\u2713' : playable ? '\u25CB' : '\u2022'}
                          </Text>
                          <View style={styles.levelInfo}>
                            <Text style={[
                              styles.levelTitle,
                              completed && { color: colors.success },
                              !playable && { color: colors.textDim },
                            ]}>
                              {level.title}
                            </Text>
                            <Text style={styles.levelMeta}>
                              {level.puzzleType.replace(/_/g, ' ')} · {'●'.repeat(level.difficulty)}{'○'.repeat(5 - level.difficulty)}
                              {isCapstone && !playable ? '  ·  complete other levels first' : ''}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              );
            })()}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.boardBtn}
        onPress={() => navigation.navigate('InvestigationBoard')}
      >
        <Text style={styles.boardBtnText}>Investigation Board</Text>
        <Text style={styles.boardBtnSub}>
          {save.unlockedClues.length} clues collected
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  header: { ...fonts.title, marginBottom: spacing.xs },
  subheader: { ...fonts.caption, marginBottom: spacing.lg },
  room: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    overflow: 'hidden',
  },
  roomImage: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: -spacing.md,
    marginHorizontal: -spacing.md,
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  roomLocked: { opacity: 0.5 },
  roomHeader: {
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  roomTitle: { ...fonts.heading },
  roomDescRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  roomDesc: { ...fonts.caption, flex: 1 },
  roomProgress: { ...fonts.caption, fontWeight: '600', marginLeft: spacing.sm },
  lockText: { ...fonts.caption, color: colors.textDim, marginTop: 2 },
  levelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  levelCompleted: { backgroundColor: 'rgba(90,154,90,0.1)' },
  levelLocked: { opacity: 0.4 },
  levelCapstone: {
    borderWidth: 1,
    borderColor: colors.accentDim,
    borderStyle: 'dashed',
  },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelIcon: { color: colors.accent, fontSize: 16, width: 24 },
  levelInfo: { flex: 1 },
  levelTitle: { ...fonts.body, fontWeight: '500' },
  levelMeta: { ...fonts.caption, marginTop: 1 },
  boardBtn: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    marginTop: spacing.md,
  },
  boardBtnText: { ...fonts.heading, color: colors.accent },
  boardBtnSub: { ...fonts.caption, marginTop: spacing.xs },
});
