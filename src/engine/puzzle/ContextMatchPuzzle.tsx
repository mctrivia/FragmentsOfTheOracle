import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import type { ContextMatchConfig, Passage } from '../../types';

interface Props {
  config: ContextMatchConfig;
  passage: Passage;
  onComplete: () => void;
}

export function ContextMatchPuzzle({ config, passage, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleChoice = (id: string) => {
    setSelected(id);
    if (id === config.correctChoiceId) {
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
      <View style={styles.passageBox}>
        <Text style={styles.sourceLabel}>{passage.reference || passage.sourceLabel}</Text>
        <Text style={styles.summary}>"{passage.text || passage.summary}"</Text>
      </View>

      <Text style={styles.prompt}>{config.prompt}</Text>

      {config.choices.map((choice) => {
        const isSelected = selected === choice.id;
        const isCorrect = feedback === 'correct' && isSelected;
        const isWrong = feedback === 'wrong' && isSelected;

        return (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choice,
              isCorrect && styles.choiceCorrect,
              isWrong && styles.choiceWrong,
            ]}
            onPress={() => !feedback && handleChoice(choice.id)}
            disabled={!!feedback}
          >
            <Text
              style={[
                styles.choiceText,
                isCorrect && styles.choiceTextCorrect,
                isWrong && styles.choiceTextWrong,
              ]}
            >
              {choice.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {feedback === 'correct' && (
        <Text style={styles.feedbackCorrect}>Correct!</Text>
      )}
      {feedback === 'wrong' && (
        <Text style={styles.feedbackWrong}>Not quite. Try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  passageBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  sourceLabel: {
    ...fonts.caption,
    marginBottom: spacing.xs,
  },
  summary: {
    ...fonts.body,
    fontStyle: 'italic',
  },
  prompt: {
    ...fonts.heading,
    fontSize: 17,
    marginBottom: spacing.md,
  },
  choice: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  choiceCorrect: {
    borderColor: colors.success,
    backgroundColor: '#1a2a1a',
  },
  choiceWrong: {
    borderColor: colors.error,
    backgroundColor: '#2a1a1a',
  },
  choiceText: {
    ...fonts.body,
  },
  choiceTextCorrect: {
    color: colors.success,
  },
  choiceTextWrong: {
    color: colors.error,
  },
  feedbackCorrect: {
    ...fonts.body,
    color: colors.success,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  feedbackWrong: {
    ...fonts.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
