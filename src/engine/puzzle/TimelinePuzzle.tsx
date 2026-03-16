import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import type { TimelineConfig } from '../../types';

interface Props {
  config: TimelineConfig;
  onComplete: () => void;
}

const eventLabels: Record<string, string> = {
  desolation: 'Desolation',
  waiting: 'Waiting',
  restoration: 'Restoration',
  decree_to_restore: 'Decree to rebuild Jerusalem',
  anointed_cut_off: 'An anointed leader is cut off',
  temple_desolation: 'Desolation of the sanctuary',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TimelinePuzzle({ config, onComplete }: Props) {
  const shuffled = useMemo(() => shuffle([...config.events]), [config.events]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState(shuffled);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleTap = (event: string) => {
    const newPlaced = [...placed, event];
    const newAvail = available.filter((e) => e !== event);
    setPlaced(newPlaced);
    setAvailable(newAvail);

    if (newPlaced.length === config.correctOrder.length) {
      const isCorrect = newPlaced.every((e, i) => e === config.correctOrder[i]);
      if (isCorrect) {
        setFeedback('correct');
        setTimeout(onComplete, 800);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setPlaced([]);
          setAvailable(shuffle([...config.events]));
          setFeedback(null);
        }, 1200);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        Arrange the events in chronological order by tapping them.
      </Text>

      {/* Timeline slots */}
      <View style={styles.timeline}>
        {config.correctOrder.map((_, i) => (
          <View key={i} style={styles.slot}>
            <View style={styles.slotDot} />
            {i < config.correctOrder.length - 1 && <View style={styles.slotLine} />}
            <Text style={[
              styles.slotText,
              placed[i] ? styles.slotTextFilled : null,
              feedback === 'wrong' && placed[i] ? { color: colors.error } : null,
              feedback === 'correct' && placed[i] ? { color: colors.success } : null,
            ]}>
              {placed[i] ? (eventLabels[placed[i]] || placed[i]) : `Step ${i + 1}`}
            </Text>
          </View>
        ))}
      </View>

      {/* Available events */}
      <View style={styles.events}>
        {available.map((event) => (
          <TouchableOpacity
            key={event}
            style={styles.eventBtn}
            onPress={() => handleTap(event)}
          >
            <Text style={styles.eventText}>{eventLabels[event] || event}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedback === 'correct' && (
        <Text style={[styles.feedback, { color: colors.success }]}>Correct order!</Text>
      )}
      {feedback === 'wrong' && (
        <Text style={[styles.feedback, { color: colors.error }]}>Wrong order. Try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  instruction: { ...fonts.caption, marginBottom: spacing.lg },
  timeline: {
    marginBottom: spacing.lg,
    paddingLeft: spacing.md,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  slotDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentDim,
    marginRight: spacing.md,
  },
  slotLine: {
    position: 'absolute',
    left: 5,
    top: 12,
    width: 2,
    height: spacing.md + 12,
    backgroundColor: colors.surfaceLight,
  },
  slotText: {
    ...fonts.body,
    color: colors.textDim,
  },
  slotTextFilled: {
    color: colors.accent,
  },
  events: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  eventBtn: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  eventText: { ...fonts.body },
  feedback: { ...fonts.body, textAlign: 'center', marginTop: spacing.md },
});
