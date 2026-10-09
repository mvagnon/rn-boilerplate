import { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { useReducedMotion } from 'react-native-reanimated';

import { expo } from '../../app.json';
import manifest from '@/assets/bootsplash/manifest.json';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export interface AnimatedBootSplashProps {
  ready: boolean;
  onHidden: () => void;
}

/** Keeps the startup overlay visible until the first screen is ready. */
export function AnimatedBootSplash({ ready, onHidden }: AnimatedBootSplashProps) {
  const [opacity] = useState(() => new Animated.Value(1));
  const [footerOpacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(0));
  const [isOverlayReady, setOverlayReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const { container, logo } = BootSplash.useHideAnimation({
    manifest,
    logo: require('@/assets/bootsplash/logo.png'),
    animate: () => setOverlayReady(true),
  });
  const colors = container.style.backgroundColor === manifest.darkBackground
    ? Colors.dark : Colors.light;

  useEffect(() => {
    if (!isOverlayReady) return;
    const animation = Animated.timing(footerOpacity, {
      useNativeDriver: true,
      toValue: ready ? 0 : 1,
      duration: 160,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [isOverlayReady, ready, footerOpacity]);

  useEffect(() => {
    if (!isOverlayReady || !ready) return;
    if (!reduceMotion) {
      Animated.stagger(250, [
        Animated.spring(translateY, {
          useNativeDriver: true,
          toValue: -50,
          isInteraction: false,
        }),
        Animated.spring(translateY, {
          useNativeDriver: true,
          toValue: Dimensions.get('window').height,
          isInteraction: false,
        }),
      ]).start();
    }
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: reduceMotion ? 160 : 150,
      delay: reduceMotion ? 0 : 350,
      isInteraction: false,
    }).start(({ finished }) => {
      if (finished) onHidden();
    });
    return () => {
      opacity.stopAnimation();
      translateY.stopAnimation();
    };
  }, [isOverlayReady, ready, reduceMotion, opacity, translateY, onHidden]);

  return (
    <Animated.View {...container} accessibilityViewIsModal style={[container.style, { opacity }]}>
      <Animated.Image
        {...logo}
        accessible={false}
        style={[logo.style, { transform: [{ translateY }] }]}
      />
      <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
        <ThemedText style={[styles.brand, { color: colors.text }]}>{expo.name}</ThemedText>
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  brand: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
