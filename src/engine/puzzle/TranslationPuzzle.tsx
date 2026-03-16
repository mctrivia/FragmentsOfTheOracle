import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import type { TranslationConfig, Passage } from '../../types';

interface Props {
  config: TranslationConfig;
  passage: Passage;
  onComplete: () => void;
}

export function TranslationPuzzle({ config, passage, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleChoice = (id: string) => {
    setSelected(id);
    if (id === config.correctTranslationId) {
      setFeedback('correct');
      setTimeout(onComplete, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sourceBox}>
        <Text style={styles.sourceLabel}>Source Term</Text>
        <Text style={styles.sourceWord}>{config.sourceWord.replace(/_/g, ' ')}</Text>
        <Text style={styles.context}>from: {passage.title} ({passage.sourceLabel})</Text>
      </View>

      <Text style={styles.prompt}>
        Which translation best fits the original context?
      </Text>

      {config.candidateTranslations.map((t) => {
        const isSelected = selected === t.id;
        const isCorrect = feedback === 'correct' && isSelected;
        const isWrong = feedback === 'wrong' && isSelected;

        return (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.choice,
              isCorrect && styles.choiceCorrect,
              isWrong && styles.choiceWrong,
            ]}
            onPress={() => !feedback && handleChoice(t.id)}
            disabled={!!feedback}
          >
            <Text style={[
              styles.choiceText,
              isCorrect && { color: colors.success },
              isWrong && { color: colors.error },
            ]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {feedback === 'correct' && (
        <Text style={[styles.feedback, { color: colors.success }]}>Correct translation!</Text>
      )}
      {feedback === 'wrong' && (
        <Text style={[styles.feedback, { color: colors.error }]}>Not quite. Try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sourceBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  sourceLabel: { ...fonts.caption, marginBottom: spacing.xs },
  sourceWord: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  context: { ...fonts.caption },
  prompt: { ...fonts.heading, fontSize: 17, marginBottom: spacing.md },
  choice: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  choiceCorrect: { borderColor: colors.success, backgroundColor: '#1a2a1a' },
  choiceWrong: { borderColor: colors.error, backgroundColor: '#2a1a1a' },
  choiceText: { ...fonts.body },
  feedback: { ...fonts.body, textAlign: 'center', marginTop: spacing.md },
});
