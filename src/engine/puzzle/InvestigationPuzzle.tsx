import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import type { InvestigationConfig, InvestigationConnection } from '../../types';
import { getClue } from '../../data';

interface Props {
  config: InvestigationConfig;
  onComplete: () => void;
}

export function InvestigationPuzzle({ config, onComplete }: Props) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [foundConnections, setFoundConnections] = useState<InvestigationConnection[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showingInsight, setShowingInsight] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const handleNodeTap = (nodeId: string) => {
    if (showingInsight || complete) return;

    if (!selectedNode) {
      setSelectedNode(nodeId);
      return;
    }

    if (selectedNode === nodeId) {
      setSelectedNode(null);
      return;
    }

    const pair: [string, string] = [selectedNode, nodeId].sort() as [string, string];

    // Already found this connection?
    const alreadyFound = foundConnections.some(
      (c) => {
        const sorted = [...c.pair].sort();
        return sorted[0] === pair[0] && sorted[1] === pair[1];
      },
    );
    if (alreadyFound) {
      setSelectedNode(null);
      setFeedback({ type: 'error', text: 'Already connected.' });
      setTimeout(() => setFeedback(null), 1200);
      return;
    }

    // Check if valid
    const match = config.validConnections.find(
      (c) => {
        const sorted = [...c.pair].sort();
        return (sorted[0] === pair[0] && sorted[1] === pair[1]);
      },
    );

    if (match) {
      const newConns = [...foundConnections, match];
      setFoundConnections(newConns);
      setSelectedNode(null);
      setShowingInsight(match.insight);

      // Check completion after player reads insight
      if (newConns.length >= config.validConnections.length) {
        // Will complete after insight is dismissed
      }
    } else {
      setSelectedNode(null);
      setFeedback({ type: 'error', text: 'These clues don\'t connect directly. Look for a shared pattern.' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const dismissInsight = () => {
    setShowingInsight(null);
    if (foundConnections.length >= config.validConnections.length) {
      setComplete(true);
      setTimeout(onComplete, 3000);
    }
  };

  const isNodeConnected = (nodeId: string) =>
    foundConnections.some((c) => c.pair.includes(nodeId));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.instruction}>
        Examine the clues you've gathered. Select two that share a pattern to reveal what connects them.
      </Text>

      <Text style={styles.progress}>
        Insights revealed: {foundConnections.length} / {config.validConnections.length}
      </Text>

      {/* Clue cards — shown in full */}
      <View style={styles.cardsContainer}>
        {config.nodeIds.map((nodeId) => {
          const clue = getClue(nodeId);
          if (!clue) return null;
          const isSelected = selectedNode === nodeId;
          const connected = isNodeConnected(nodeId);

          return (
            <TouchableOpacity
              key={nodeId}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                connected && styles.cardConnected,
              ]}
              onPress={() => handleNodeTap(nodeId)}
              activeOpacity={0.7}
            >
              <Text style={styles.cardType}>{clue.type.replace(/_/g, ' ')}</Text>
              <Text style={[
                styles.cardTitle,
                isSelected && { color: colors.white },
                connected && { color: colors.success },
              ]}>
                {clue.title}
              </Text>
              <Text style={styles.cardBody}>{clue.body}</Text>
              {isSelected && (
                <Text style={styles.cardHint}>Now select another clue to connect...</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback for wrong connections */}
      {feedback && (
        <View style={[styles.feedbackBox, feedback.type === 'error' && styles.feedbackError]}>
          <Text style={styles.feedbackText}>{feedback.text}</Text>
        </View>
      )}

      {/* Insight reveal overlay */}
      {showingInsight && (
        <View style={styles.insightOverlay}>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>PATTERN REVEALED</Text>
            <Text style={styles.insightText}>{showingInsight}</Text>
            <TouchableOpacity style={styles.insightBtn} onPress={dismissInsight}>
              <Text style={styles.insightBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Revealed insights list */}
      {foundConnections.length > 0 && !showingInsight && (
        <View style={styles.revealedSection}>
          <Text style={styles.revealedTitle}>Revealed Insights</Text>
          {foundConnections.map((conn, i) => {
            const clueA = getClue(conn.pair[0]);
            const clueB = getClue(conn.pair[1]);
            return (
              <View key={i} style={styles.revealedCard}>
                <Text style={styles.revealedLink}>
                  {clueA?.title} + {clueB?.title}
                </Text>
                <Text style={styles.revealedInsight}>{conn.insight}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Final revelation */}
      {complete && (
        <View style={styles.finalReveal}>
          <Text style={styles.finalTitle}>The Pattern Is Clear</Text>
          <Text style={styles.finalText}>
            Every passage you examined had a specific author, audience, and moment.
            The "prophecies" were not predictions — they were reinterpretations,
            created by lifting lines from their original contexts and reading them
            as if they pointed somewhere else.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { paddingBottom: spacing.xxl },
  instruction: {
    ...fonts.body,
    color: colors.textDim,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  progress: {
    ...fonts.caption,
    color: colors.accent,
    marginBottom: spacing.lg,
  },
  cardsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.surfaceLight,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#2a2418',
  },
  cardConnected: {
    borderColor: colors.success,
    opacity: 0.7,
  },
  cardType: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...fonts.heading,
    fontSize: 17,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  cardBody: {
    ...fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  cardHint: {
    ...fonts.caption,
    color: colors.accent,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  feedbackBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  feedbackError: {},
  feedbackText: {
    ...fonts.body,
    fontSize: 14,
    color: colors.textDim,
  },
  insightOverlay: {
    backgroundColor: 'rgba(26, 20, 16, 0.95)',
    borderRadius: 12,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  insightCard: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
  },
  insightLabel: {
    ...fonts.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  insightText: {
    ...fonts.body,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  insightBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
    alignSelf: 'center',
  },
  insightBtnText: {
    ...fonts.button,
  },
  revealedSection: {
    marginTop: spacing.lg,
  },
  revealedTitle: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    color: colors.success,
  },
  revealedCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  revealedLink: {
    ...fonts.caption,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  revealedInsight: {
    ...fonts.body,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  finalReveal: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  finalTitle: {
    ...fonts.heading,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  finalText: {
    ...fonts.body,
    lineHeight: 26,
    textAlign: 'center',
  },
});
