import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  scrollEnabled?: boolean;
}

export function PuzzleShell({ title, subtitle, children, scrollEnabled = true }: Props) {
  const inner = (
    <>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </>
  );

  if (!scrollEnabled) {
    return (
      <View style={[styles.scroll, styles.container, { flex: 1 }]}>
        {inner}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {inner}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...fonts.heading,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...fonts.caption,
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
});
