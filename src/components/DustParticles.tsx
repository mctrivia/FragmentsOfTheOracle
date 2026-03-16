import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  count?: number;
}

interface Particle {
  x: number;
  size: number;
  duration: number;
  delay: number;
  startY: number;
  anim: Animated.Value;
}

export function DustParticles({ count = 12 }: Props) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * SCREEN_WIDTH,
      size: 2 + Math.random() * 2,
      duration: 6000 + Math.random() * 6000,
      delay: Math.random() * 4000,
      startY: SCREEN_HEIGHT * 0.3 + Math.random() * SCREEN_HEIGHT * 0.6,
      anim: new Animated.Value(0),
    }));
  }, [count]);

  useEffect(() => {
    particles.forEach((p) => {
      const animate = () => {
        p.anim.setValue(0);
        Animated.timing(p.anim, {
          toValue: 1,
          duration: p.duration,
          delay: p.delay,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            p.delay = 0;
            animate();
          }
        });
      };
      animate();
    });
  }, [particles]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [p.startY, p.startY - 150 - Math.random() * 100],
        });

        const opacity = p.anim.interpolate({
          inputRange: [0, 0.15, 0.5, 0.85, 1],
          outputRange: [0, 0.5, 0.35, 0.15, 0],
        });

        const translateX = p.anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [p.x, p.x + (Math.random() - 0.5) * 30, p.x + (Math.random() - 0.5) * 50],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                transform: [{ translateX }, { translateY }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#c9a84c',
  },
});
