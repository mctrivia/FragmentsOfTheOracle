import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { colors, fonts, spacing } from '../theme';
import { useGameStore } from '../store/useGameStore';
import { getClue } from '../data';
import { images } from '../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'InvestigationBoard'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function InvestigationBoardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { save } = useGameStore();

  if (!save) return null;

  const unlockedClues = save.unlockedClues.map(getClue).filter(Boolean);
  const connections = save.boardConnections;

  return (
    <ImageBackground
      source={images.puzzles.investigation}
      style={[styles.container, { paddingTop: insets.top }]}
      resizeMode="cover"
      imageStyle={{ opacity: 0.15 }}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Investigation Board</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {unlockedClues.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Complete puzzles to collect clue cards for the board.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Collected Clues ({unlockedClues.length})
            </Text>

            <View style={styles.cluesGrid}>
              {unlockedClues.map((clue) => {
                const isConnected = connections.some(
                  ([a, b]) => a === clue!.id || b === clue!.id,
                );
                return (
                  <View
                    key={clue!.id}
                    style={[styles.clueCard, isConnected && styles.clueConnected]}
                  >
                    <Text style={styles.clueType}>{clue!.type.replace(/_/g, ' ')}</Text>
                    <Text style={styles.clueTitle}>{clue!.title}</Text>
                    <Text style={styles.clueBody}>{clue!.body}</Text>
                  </View>
                );
              })}
            </View>

            {connections.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
                  Connections ({connections.length})
                </Text>
                {connections.map(([a, b], i) => {
                  const clueA = getClue(a);
                  const clueB = getClue(b);
                  return (
                    <View key={i} style={styles.connectionRow}>
                      <Image source={images.board.pin} style={styles.pinIcon} resizeMode="contain" />
                      <Text style={styles.connectionText}>
                        {clueA?.title || a} — {clueB?.title || b}
                      </Text>
                      <Image source={images.board.pin} style={styles.pinIcon} resizeMode="contain" />
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
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
  backBtn: { ...fonts.body, color: colors.accent },
  title: { ...fonts.heading },
  content: {
    padding: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: { ...fonts.body, color: colors.textDim, textAlign: 'center' },
  sectionTitle: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  cluesGrid: {
    gap: spacing.sm,
  },
  clueCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  clueConnected: {
    borderColor: colors.success,
  },
  clueType: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
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
    fontSize: 14,
  },
  connectionRow: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    width: 16,
    height: 16,
  },
  connectionText: {
    ...fonts.caption,
    color: colors.success,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
