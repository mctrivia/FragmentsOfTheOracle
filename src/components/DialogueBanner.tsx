import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import type { Dialogue } from '../types';
import { getCharacterImage } from '../assets/images';

interface Props {
  dialogue: Dialogue;
}

export function DialogueBanner({ dialogue }: Props) {
  const portrait = getCharacterImage(dialogue.speaker);

  return (
    <View style={styles.container}>
      {portrait && (
        <Image source={portrait} style={styles.portrait} resizeMode="cover" />
      )}
      <View style={styles.textBlock}>
        <Text style={styles.speaker}>{dialogue.speaker}</Text>
        <Text style={styles.text}>"{dialogue.text}"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  portrait: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  textBlock: {
    flex: 1,
  },
  speaker: {
    ...fonts.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  text: {
    ...fonts.body,
    fontStyle: 'italic',
  },
});
