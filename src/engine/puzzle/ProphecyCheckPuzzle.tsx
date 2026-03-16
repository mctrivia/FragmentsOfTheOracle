import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import type { ProphecyCheckConfig, Passage } from '../../types';
import { colors, fonts, spacing } from '../../theme';
import { images } from '../../assets/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2;

interface Props {
  config: ProphecyCheckConfig;
  passage: Passage;
  onComplete: () => void;
}

interface SortedItem {
  id: string;
  text: string;
  actualCategory: 'supports' | 'contradicts';
  playerChoice: 'supports' | 'contradicts';
  correct: boolean;
}

export function ProphecyCheckPuzzle({ config, passage, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sorted, setSorted] = useState<SortedItem[]>([]);
  const [showVerdict, setShowVerdict] = useState(false);
  const [failed, setFailed] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const exitAnim = useRef(new Animated.Value(0)).current;
  const verdictAnim = useRef(new Animated.Value(0)).current;

  const evidence = config.evidence;
  const currentCard = currentIndex < evidence.length ? evidence[currentIndex] : null;

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSorted([]);
    setShowVerdict(false);
    setFailed(false);
    verdictAnim.setValue(0);
  }, [verdictAnim]);

  const supportsCount = useMemo(
    () => sorted.filter((s) => s.playerChoice === 'supports').length,
    [sorted],
  );
  const contradictsCount = useMemo(
    () => sorted.filter((s) => s.playerChoice === 'contradicts').length,
    [sorted],
  );

  // Did the player correctly identify at least one contradicting evidence?
  const hasCorrectContradict = sorted.some(
    (s) => s.playerChoice === 'contradicts' && s.actualCategory === 'contradicts',
  );

  // Slide in the current card
  useEffect(() => {
    if (currentCard) {
      slideAnim.setValue(SCREEN_WIDTH);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex, currentCard]);

  // Show verdict when all cards are sorted
  useEffect(() => {
    if (sorted.length === evidence.length && evidence.length > 0) {
      setShowVerdict(true);
      Animated.timing(verdictAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      if (hasCorrectContradict) {
        const timer = setTimeout(() => {
          onComplete();
        }, 4000);
        return () => clearTimeout(timer);
      } else {
        setFailed(true);
      }
    }
  }, [sorted.length, evidence.length, hasCorrectContradict]);

  const handleSort = useCallback(
    (choice: 'supports' | 'contradicts') => {
      if (!currentCard) return;

      const correct = choice === currentCard.category;
      const exitDirection = choice === 'supports' ? -SCREEN_WIDTH : SCREEN_WIDTH;

      Animated.timing(exitAnim, {
        toValue: exitDirection,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        exitAnim.setValue(0);
        setSorted((prev) => [
          ...prev,
          {
            id: currentCard.id,
            text: currentCard.text,
            actualCategory: currentCard.category,
            playerChoice: choice,
            correct,
          },
        ]);
        setCurrentIndex((prev) => prev + 1);
      });
    },
    [currentCard, exitAnim],
  );

  // Player's picks for the verdict display
  const playerSupports = sorted.filter((s) => s.playerChoice === 'supports').length;
  const playerContradicts = sorted.filter((s) => s.playerChoice === 'contradicts').length;
  const playerContradictsRatio =
    sorted.length > 0 ? playerContradicts / sorted.length : 0;

  return (
    <View style={styles.container}>
      {/* Requirement parchment box */}
      <View style={styles.requirementBox}>
        <View style={styles.requirementBorderTop} />
        <Text style={styles.requirementLabel}>Messianic Requirement</Text>
        <Text style={styles.requirementText}>{config.requirement}</Text>
        <View style={styles.requirementBorderBottom} />
      </View>

      {/* Passage text */}
      <Text style={styles.passageText} numberOfLines={3}>
        {passage.reference}: {passage.text}
      </Text>

      {/* Tallies */}
      <View style={styles.talliesRow}>
        <View style={styles.tallyBox}>
          <Text style={styles.tallyLabel}>Supports</Text>
          <Text style={[styles.tallyCount, { color: colors.success }]}>
            {supportsCount}
          </Text>
          <View style={styles.tallyIndicators}>
            {sorted
              .filter((s) => s.playerChoice === 'supports')
              .map((s) => (
                <View
                  key={s.id}
                  style={[
                    styles.tallyDot,
                    { backgroundColor: s.correct ? colors.success : colors.error },
                  ]}
                />
              ))}
          </View>
        </View>
        <View style={styles.tallyDivider} />
        <View style={styles.tallyBox}>
          <Text style={styles.tallyLabel}>Contradicts</Text>
          <Text style={[styles.tallyCount, { color: colors.error }]}>
            {contradictsCount}
          </Text>
          <View style={styles.tallyIndicators}>
            {sorted
              .filter((s) => s.playerChoice === 'contradicts')
              .map((s) => (
                <View
                  key={s.id}
                  style={[
                    styles.tallyDot,
                    { backgroundColor: s.correct ? colors.success : colors.error },
                  ]}
                />
              ))}
          </View>
        </View>
      </View>

      {/* Card area */}
      <View style={[styles.cardArea, showVerdict && { justifyContent: 'flex-start' }]}>
        {currentCard && !showVerdict && (
          <Animated.View
            style={[
              styles.evidenceCard,
              {
                transform: [
                  {
                    translateX: Animated.add(slideAnim, exitAnim),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.cardCounter}>
              Evidence {currentIndex + 1} of {evidence.length}
            </Text>
            <Text style={styles.cardText}>{currentCard.text}</Text>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.sortBtn, styles.supportsBtn]}
                onPress={() => handleSort('supports')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortBtnText}>Supports</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortBtn, styles.contradictsBtn]}
                onPress={() => handleSort('contradicts')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortBtnText}>Contradicts</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Verdict summary */}
        {showVerdict && (
          <Animated.View style={[styles.verdictContainer, { opacity: verdictAnim }]}>
            <Text style={styles.verdictTitle}>
              {failed ? 'Review Your Choices' : 'Evidence Summary'}
            </Text>

            {/* Your picks */}
            <View style={styles.verdictCounts}>
              <View style={styles.verdictCountBox}>
                <Text style={[styles.verdictCountNum, { color: colors.success }]}>
                  {playerSupports}
                </Text>
                <Text style={styles.verdictCountLabel}>You said supports</Text>
              </View>
              <Text style={styles.verdictVs}>vs</Text>
              <View style={styles.verdictCountBox}>
                <Text style={[styles.verdictCountNum, { color: colors.error }]}>
                  {playerContradicts}
                </Text>
                <Text style={styles.verdictCountLabel}>You said contradicts</Text>
              </View>
            </View>

            {/* Evidence breakdown showing player's choices */}
            <View style={styles.evidenceList}>
              {sorted.map((item) => (
                <View key={item.id} style={styles.evidenceRow}>
                  <Text style={styles.evidenceIcon}>
                    {item.correct ? '\u2713' : '\u2717'}
                  </Text>
                  <View style={styles.evidenceInfo}>
                    <Text style={styles.evidenceItemText} numberOfLines={2}>
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        styles.evidenceChoice,
                        { color: item.correct ? colors.success : colors.error },
                      ]}
                    >
                      You: {item.playerChoice}
                      {!item.correct ? ` (actually ${item.actualCategory})` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Gauge bar based on player's picks */}
            <View style={styles.gaugeTrack}>
              <View
                style={[
                  styles.gaugeSupports,
                  { flex: playerSupports || 0.1 },
                ]}
              />
              <View
                style={[
                  styles.gaugeContradicts,
                  { flex: playerContradicts || 0.1 },
                ]}
              />
            </View>
            <View style={styles.gaugeLabels}>
              <Text style={[styles.gaugeLabel, { color: colors.success }]}>
                Supports
              </Text>
              <Text style={[styles.gaugeLabel, { color: colors.error }]}>
                Contradicts
              </Text>
            </View>

            {failed ? (
              <>
                <Text style={styles.failText}>
                  Look more carefully — some of this evidence clearly contradicts the requirement.
                </Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={handleRetry}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Image
                  source={
                    playerContradictsRatio > 0.5
                      ? images.verdict.unfulfilled
                      : images.verdict.fulfilled
                  }
                  style={styles.verdictStamp}
                  resizeMode="contain"
                />
                <View style={styles.verdictLine} />
                <Text style={styles.verdictText}>
                  {playerContradictsRatio > 0.5
                    ? 'The evidence weighs against fulfillment.'
                    : 'The evidence leans toward fulfillment.'}
                </Text>
              </>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  requirementBox: {
    backgroundColor: '#2e2416',
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    overflow: 'hidden',
  },
  requirementBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  requirementBorderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.accent,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  requirementLabel: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
    color: colors.accent,
  },
  requirementText: {
    ...fonts.heading,
    color: colors.text,
    lineHeight: 26,
  },
  passageText: {
    ...fonts.caption,
    fontStyle: 'italic',
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  talliesRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  tallyBox: {
    flex: 1,
    alignItems: 'center',
  },
  tallyLabel: {
    ...fonts.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tallyCount: {
    fontSize: 24,
    fontWeight: '700',
  },
  tallyIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xs,
    gap: 3,
  },
  tallyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tallyDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.surfaceLight,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardCounter: {
    ...fonts.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    ...fonts.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 26,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  supportsBtn: {
    backgroundColor: '#2a4a2a',
    borderWidth: 1,
    borderColor: colors.success,
  },
  contradictsBtn: {
    backgroundColor: '#4a2a2a',
    borderWidth: 1,
    borderColor: colors.error,
  },
  sortBtnText: {
    ...fonts.button,
    color: colors.text,
    fontWeight: '600',
  },
  verdictContainer: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accentDim,
    alignItems: 'center',
  },
  verdictTitle: {
    ...fonts.heading,
    color: colors.accent,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  verdictCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  verdictCountBox: {
    alignItems: 'center',
  },
  verdictCountNum: {
    fontSize: 36,
    fontWeight: '700',
  },
  verdictCountLabel: {
    ...fonts.caption,
    marginTop: 2,
  },
  verdictVs: {
    ...fonts.caption,
    fontSize: 16,
    color: colors.textDim,
  },
  gaugeTrack: {
    flexDirection: 'row',
    width: '100%',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
    marginBottom: spacing.xs,
  },
  gaugeSupports: {
    backgroundColor: colors.success,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  gaugeContradicts: {
    backgroundColor: colors.error,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.lg,
  },
  gaugeLabel: {
    ...fonts.caption,
    fontSize: 11,
  },
  verdictStamp: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  verdictLine: {
    width: 60,
    height: 1,
    backgroundColor: colors.accentDim,
    marginBottom: spacing.md,
  },
  verdictText: {
    ...fonts.body,
    textAlign: 'center',
    fontStyle: 'italic',
    color: colors.accent,
    lineHeight: 24,
  },
  evidenceList: {
    width: '100%',
    marginBottom: spacing.md,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceLight,
  },
  evidenceIcon: {
    fontSize: 16,
    fontWeight: '700',
    width: 24,
    textAlign: 'center',
    marginTop: 2,
    color: colors.text,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceItemText: {
    ...fonts.caption,
    color: colors.text,
    lineHeight: 18,
  },
  evidenceChoice: {
    ...fonts.caption,
    fontSize: 11,
    marginTop: 2,
  },
  failText: {
    ...fonts.body,
    textAlign: 'center',
    color: colors.error,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  retryBtn: {
    backgroundColor: '#4a2a2a',
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  retryBtnText: {
    ...fonts.button,
    color: colors.text,
    fontWeight: '600',
  },
});
