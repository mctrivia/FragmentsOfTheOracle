import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { images } from '../../assets/images';
import type { ReconstructionConfig, Passage } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLOT_HEIGHT = 52;

interface Props {
  config: ReconstructionConfig;
  passage: Passage;
  onComplete: () => void;
}

function splitIntoFragments(text: string, count: number): string[] {
  const sentences = text.split(/(?<=[.?!;,])\s+/).filter(Boolean);
  if (sentences.length >= count) {
    const frags: string[] = [];
    const per = Math.ceil(sentences.length / count);
    for (let i = 0; i < sentences.length; i += per) {
      frags.push(sentences.slice(i, i + per).join(' '));
    }
    return frags.slice(0, count);
  }
  const words = text.split(' ');
  const per = Math.ceil(words.length / count);
  const frags: string[] = [];
  for (let i = 0; i < words.length; i += per) {
    frags.push(words.slice(i, i + per).join(' '));
  }
  return frags.slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Never start already solved
  if (a.every((v, i) => v === arr[i]) && a.length > 1) {
    [a[0], a[1]] = [a[1], a[0]];
  }
  return a;
}

// ─── Draggable piece ────────────────────────────────────────────────────
interface DraggablePieceProps {
  text: string;
  pieceIndex: number;
  rotation: number;
  onDrop: (pieceIndex: number, screenX: number, screenY: number) => boolean;
}

function DraggablePiece({ text, pieceIndex, rotation, onDrop }: DraggablePieceProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const liftScale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gs) =>
          Math.abs(gs.dx) > 3 || Math.abs(gs.dy) > 3,
        onPanResponderGrant: () => {
          setIsDragging(true);
          pan.setValue({ x: 0, y: 0 });
          Animated.spring(liftScale, {
            toValue: 1.1,
            friction: 6,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderMove: Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false },
        ),
        onPanResponderRelease: (_, gesture) => {
          setIsDragging(false);
          const accepted = onDropRef.current(
            pieceIndex,
            gesture.moveX,
            gesture.moveY,
          );
          if (!accepted) {
            Animated.parallel([
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                friction: 6,
                useNativeDriver: false,
              }),
              Animated.spring(liftScale, {
                toValue: 1,
                friction: 6,
                useNativeDriver: false,
              }),
            ]).start();
          }
        },
      }),
    [pieceIndex],
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.piece,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: liftScale },
            { rotate: `${rotation}deg` },
          ],
          zIndex: isDragging ? 999 : 1,
          elevation: isDragging ? 12 : 3,
        },
      ]}
    >
      <ImageBackground
        source={images.ui.parchmentTexture}
        style={styles.pieceInner}
        imageStyle={styles.pieceParchment}
        resizeMode="cover"
      >
        <Text selectable={false} style={styles.pieceText}>{text}</Text>
      </ImageBackground>
    </Animated.View>
  );
}

// ─── Main puzzle ────────────────────────────────────────────────────────
export function ReconstructionPuzzle({ config, passage, onComplete }: Props) {
  const correctTexts = useMemo(
    () => splitIntoFragments(passage.text || passage.summary, config.fragmentCount),
    [passage, config.fragmentCount],
  );
  const numPieces = correctTexts.length;

  // Shuffled ordering of piece indices (which correctIndex appears in which pool position)
  const [shuffledOrder] = useState(() => {
    const indices = Array.from({ length: numPieces }, (_, i) => i);
    return shuffle(indices);
  });

  // placedPieces[slotIdx] = correctIndex placed there, or null
  const placedRef = useRef<(number | null)[]>(new Array(numPieces).fill(null));
  const [placedPieces, setPlacedPieces] = useState<(number | null)[]>(
    () => new Array(numPieces).fill(null),
  );
  const [solved, setSolved] = useState(false);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout>>();

  // Random rotations for visual scatter
  const rotations = useMemo(
    () => shuffledOrder.map(() => (Math.random() - 0.5) * 7),
    [shuffledOrder],
  );

  // Slot measurement for drop hit-testing
  const slotRefs = useRef<(View | null)[]>([]);
  const slotPositions = useRef<{ x: number; y: number; w: number; h: number }[]>([]);

  const measureSlots = useCallback(() => {
    slotRefs.current.forEach((ref, i) => {
      ref?.measureInWindow((x, y, w, h) => {
        slotPositions.current[i] = { x, y, w, h };
      });
    });
  }, []);

  // Re-measure when slots change or on mount
  useEffect(() => {
    const t = setTimeout(measureSlots, 150);
    return () => clearTimeout(t);
  }, [placedPieces, measureSlots]);

  // Handle a piece being dropped at screen coords
  const handleDrop = useCallback(
    (pieceIdx: number, sx: number, sy: number): boolean => {
      const current = placedRef.current;

      for (let i = 0; i < slotPositions.current.length; i++) {
        const slot = slotPositions.current[i];
        if (!slot || current[i] !== null) continue;

        const inX = sx >= slot.x && sx <= slot.x + slot.w;
        const inY = sy >= slot.y && sy <= slot.y + slot.h;

        if (inX && inY) {
          if (pieceIdx === i) {
            // Correct!
            const newPlaced = [...current];
            newPlaced[i] = pieceIdx;
            placedRef.current = newPlaced;
            setPlacedPieces(newPlaced);

            if (newPlaced.every((p) => p !== null)) {
              setSolved(true);
              setTimeout(onComplete, 1500);
            }
            return true;
          } else {
            // Wrong slot — flash red
            setWrongSlot(i);
            clearTimeout(wrongTimer.current);
            wrongTimer.current = setTimeout(() => setWrongSlot(null), 500);
            return false;
          }
        }
      }
      return false; // not over any slot
    },
    [onComplete],
  );

  // Which pieces are still in the pool
  const availablePieces = shuffledOrder.filter(
    (idx) => !placedRef.current.includes(idx),
  );

  const numPlaced = numPieces - availablePieces.length;

  // Solved animation
  const solvedAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (solved) {
      Animated.timing(solvedAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [solved, solvedAnim]);

  return (
    <ImageBackground
      source={images.puzzles.reconstruction}
      style={styles.workbench}
      imageStyle={styles.workbenchImage}
      resizeMode="cover"
    >
      {/* Header with verse reference */}
      <View style={styles.verseHeader}>
        <Text selectable={false} style={styles.verseBook}>{passage.reference}</Text>
        <Text selectable={false} style={styles.instruction}>
          Drag each fragment to its correct position
        </Text>
      </View>

      {/* Drop slots */}
      <View style={styles.slotsArea} onLayout={measureSlots}>
        {correctTexts.map((text, i) => {
          const filled = placedPieces[i] !== null;
          const isWrong = wrongSlot === i;
          return (
            <View
              key={`slot-${i}`}
              ref={(r) => { slotRefs.current[i] = r; }}
              onLayout={measureSlots}
              style={[
                styles.slot,
                filled && styles.slotFilled,
                isWrong && styles.slotWrong,
              ]}
            >
              {filled ? (
                <ImageBackground
                  source={images.ui.parchmentTexture}
                  style={styles.slotFilledInner}
                  imageStyle={styles.slotFilledParchment}
                  resizeMode="cover"
                >
                  <Text style={styles.slotFilledText}>{correctTexts[i]}</Text>
                </ImageBackground>
              ) : (
                <View style={styles.slotEmptyInner}>
                  <Text style={styles.slotNumber}>{i + 1}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>
          {numPlaced}/{numPieces} placed
        </Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Pieces pool */}
      <View style={styles.pool}>
        {availablePieces.map((pieceIdx) => (
          <DraggablePiece
            key={`piece-${pieceIdx}`}
            text={correctTexts[pieceIdx]}
            pieceIndex={pieceIdx}
            rotation={rotations[pieceIdx]}
            onDrop={handleDrop}
          />
        ))}
      </View>

      {/* Solved overlay */}
      {solved && (
        <Animated.View
          style={[
            styles.solvedOverlay,
            {
              opacity: solvedAnim,
              transform: [
                {
                  scale: solvedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.solvedLabel}>scroll restored</Text>
          <ImageBackground
            source={images.ui.parchmentTexture}
            style={styles.solvedParchment}
            imageStyle={styles.solvedParchmentImg}
            resizeMode="cover"
          >
            <Text style={styles.solvedText}>{passage.text}</Text>
          </ImageBackground>
          <Text style={styles.solvedRef}>{passage.reference}</Text>
        </Animated.View>
      )}
    </ImageBackground>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  workbench: {
    flex: 1,
    padding: spacing.sm,
  },
  workbenchImage: {
    opacity: 0.25,
  },

  // Header
  verseHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
  },
  verseBook: {
    ...fonts.heading,
    color: colors.accent,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 2,
  },
  instruction: {
    ...fonts.caption,
    textAlign: 'center',
  },

  // Drop slots
  slotsArea: {
    marginBottom: spacing.xs,
  },
  slot: {
    minHeight: SLOT_HEIGHT,
    borderRadius: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(201, 168, 76, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: colors.success,
    backgroundColor: 'transparent',
  },
  slotWrong: {
    borderColor: colors.error,
    borderStyle: 'solid',
    backgroundColor: 'rgba(154, 74, 74, 0.25)',
  },
  slotEmptyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    flex: 1,
    minHeight: SLOT_HEIGHT,
  },
  slotNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(201, 168, 76, 0.35)',
  },
  slotFilledInner: {
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: SLOT_HEIGHT,
    justifyContent: 'center',
  },
  slotFilledParchment: {
    borderRadius: 5,
    opacity: 0.7,
  },
  slotFilledText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#3a2a15',
    fontWeight: '500',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(201, 168, 76, 0.2)',
  },
  dividerText: {
    ...fonts.caption,
    color: colors.accentDim,
    marginHorizontal: spacing.sm,
    fontSize: 12,
  },

  // Pieces pool
  pool: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  piece: {
    width: '46%',
    margin: '2%',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    ...(Platform.OS === 'web' ? { cursor: 'grab', userSelect: 'none' } : {}),
  } as any,
  pieceInner: {
    padding: spacing.sm,
    minHeight: 56,
    justifyContent: 'center',
  },
  pieceParchment: {
    borderRadius: 4,
    opacity: 0.85,
  },
  pieceText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#3a2a15',
    fontWeight: '500',
    ...(Platform.OS === 'web' ? { userSelect: 'none' } : {}),
  } as any,

  // Solved overlay
  solvedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 20, 16, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 8,
  },
  solvedLabel: {
    ...fonts.caption,
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  solvedParchment: {
    borderRadius: 8,
    padding: spacing.lg,
    width: '100%',
    overflow: 'hidden',
  },
  solvedParchmentImg: {
    borderRadius: 8,
    opacity: 0.75,
  },
  solvedText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#3a2a15',
    fontWeight: '500',
    textAlign: 'center',
  },
  solvedRef: {
    ...fonts.caption,
    color: colors.accent,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
});
