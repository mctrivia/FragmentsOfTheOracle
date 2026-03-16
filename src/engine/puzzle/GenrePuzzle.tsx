import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import type { GenreConfig, Passage } from '../../types';

interface Props {
  config: GenreConfig;
  passage: Passage;
  onComplete: () => void;
}

const genreLabels: Record<string, string> = {
  poetry: 'Poetry / Psalm',
  lament_psalm: 'Lament Psalm — a prayer of distress and trust',
  prophetic_oracle: 'Prophetic Oracle — a prediction of future events',
  historical_record: 'Historical Record — a factual account',
  legal_code: 'Legal Code',
  court_decree: 'Court Decree',
  prophecy: 'Prophecy',
  narrative: 'Narrative',
  apocalyptic: 'Apocalyptic',
  royal_hymn: 'Royal Hymn',
};

export function GenrePuzzle({ config, passage, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleChoice = (genre: string) => {
    setSelected(genre);
    if (genre === config.correctGenre) {
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

      <Text style={styles.prompt}>What genre best describes this text?</Text>

      {config.candidateGenres.map((genre) => {
        const isSelected = selected === genre;
        const isCorrect = feedback === 'correct' && isSelected;
        const isWrong = feedback === 'wrong' && isSelected;

        return (
          <TouchableOpacity
            key={genre}
            style={[
              styles.choice,
              isCorrect && styles.choiceCorrect,
              isWrong && styles.choiceWrong,
            ]}
            onPress={() => !feedback && handleChoice(genre)}
            disabled={!!feedback}
          >
            <Text style={[
              styles.choiceText,
              isCorrect && { color: colors.success },
              isWrong && { color: colors.error },
            ]}>
              {genreLabels[genre] || genre}
            </Text>
          </TouchableOpacity>
        );
      })}

      {feedback === 'correct' && (
        <Text style={[styles.feedback, { color: colors.success }]}>Correct!</Text>
      )}
      {feedback === 'wrong' && (
        <Text style={[styles.feedback, { color: colors.error }]}>Not quite. Try again.</Text>
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
  sourceLabel: { ...fonts.caption, marginBottom: spacing.xs },
  summary: { ...fonts.body, fontStyle: 'italic' },
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
