import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import type { Passage } from '../types';

interface Props {
  passage: Passage;
}

export function PassageCard({ passage }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{passage.reference || passage.sourceLabel}</Text>
      <Text style={styles.title}>{passage.title}</Text>
      {passage.text ? <Text style={styles.quote}>"{passage.text}"</Text> : null}
      <Text style={styles.summary}>{passage.summary}</Text>
      <Text style={styles.meta}>
        {passage.genre} · {Math.abs(passage.timelineDate)} BCE · {passage.geographyTags.join(', ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  label: {
    ...fonts.caption,
    marginBottom: spacing.xs,
  },
  title: {
    ...fonts.heading,
    marginBottom: spacing.sm,
  },
  quote: {
    ...fonts.body,
    fontStyle: 'italic',
    color: colors.accent,
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  summary: {
    ...fonts.body,
    marginBottom: spacing.sm,
  },
  meta: {
    ...fonts.caption,
    color: colors.accentDim,
  },
});
