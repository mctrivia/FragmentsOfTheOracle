import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  accentColor?: string;
}

const CIRCLE_SIZE = 10;
const CIRCLE_COUNT = 24;

function TornEdge({ position, accent }: { position: 'top' | 'bottom'; accent: string }) {
  const circles = Array.from({ length: CIRCLE_COUNT }, (_, i) => i);
  const isTop = position === 'top';

  return (
    <View
      style={[
        tornStyles.edgeRow,
        isTop ? tornStyles.edgeTop : tornStyles.edgeBottom,
      ]}
      pointerEvents="none"
    >
      {circles.map((i) => (
        <View
          key={i}
          style={[
            tornStyles.circle,
            {
              backgroundColor: colors.background,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
            },
            isTop ? { top: -(CIRCLE_SIZE / 2) } : { bottom: -(CIRCLE_SIZE / 2) },
          ]}
        />
      ))}
    </View>
  );
}

function CornerDecoration({
  corner,
  accent,
}: {
  corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  accent: string;
}) {
  const isTop = corner.startsWith('top');
  const isLeft = corner.endsWith('Left');

  return (
    <View
      style={[
        cornerStyles.wrapper,
        isTop ? { top: spacing.sm } : { bottom: spacing.sm },
        isLeft ? { left: spacing.sm } : { right: spacing.sm },
      ]}
      pointerEvents="none"
    >
      {/* Horizontal arm */}
      <View
        style={[
          cornerStyles.armH,
          { backgroundColor: accent },
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      {/* Vertical arm */}
      <View
        style={[
          cornerStyles.armV,
          { backgroundColor: accent },
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
    </View>
  );
}

export function ScrollParchment({ children, accentColor }: Props) {
  const accent = accentColor || colors.accent;

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.parchment, { borderColor: accent + '30' }]}>
        {/* Inner shadow layers */}
        <View style={[styles.innerShadow, styles.innerShadowTop]} pointerEvents="none" />
        <View style={[styles.innerShadow, styles.innerShadowBottom]} pointerEvents="none" />
        <View style={[styles.innerShadow, styles.innerShadowLeft]} pointerEvents="none" />
        <View style={[styles.innerShadow, styles.innerShadowRight]} pointerEvents="none" />

        {/* Torn edges */}
        <TornEdge position="top" accent={accent} />
        <TornEdge position="bottom" accent={accent} />

        {/* Corner decorations */}
        <CornerDecoration corner="topLeft" accent={accent} />
        <CornerDecoration corner="topRight" accent={accent} />
        <CornerDecoration corner="bottomLeft" accent={accent} />
        <CornerDecoration corner="bottomRight" accent={accent} />

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    paddingVertical: spacing.xs,
  },
  parchment: {
    backgroundColor: '#241c12',
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  innerShadow: {
    position: 'absolute',
    zIndex: 1,
  },
  innerShadowTop: {
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  innerShadowBottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  innerShadowLeft: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  innerShadowRight: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
});

const tornStyles = StyleSheet.create({
  edgeRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 2,
    height: CIRCLE_SIZE / 2,
    overflow: 'visible',
  },
  edgeTop: {
    top: 0,
  },
  edgeBottom: {
    bottom: 0,
  },
  circle: {},
});

const cornerStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 16,
    height: 16,
    zIndex: 3,
  },
  armH: {
    position: 'absolute',
    width: 16,
    height: 1.5,
  },
  armV: {
    position: 'absolute',
    width: 1.5,
    height: 16,
  },
});
