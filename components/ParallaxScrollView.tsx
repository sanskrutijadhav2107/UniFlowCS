// components/ParallaxScrollView.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

type HeaderBg = { light?: string; dark?: string } | string;

type Props = {
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerHeight?: number;
  headerBackgroundColor?: HeaderBg;
};

export default function ParallaxScrollView({
  children,
  headerImage,
  headerHeight = 220,
  headerBackgroundColor = '#A1CEDC',
}: Props) {
  const scrollY = useSharedValue(0);

  // scroll handler updates the shared value
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // header transform/opacity (depends on scrollY.value)
  const headerAnimStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight / 2],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 2, headerHeight],
      [1, 0.95, 0.7],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  }, [scrollY.value]); // <-- explicit dependency array

  // image scale/parallax effect
  const imageAnimStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-headerHeight, 0, headerHeight], [1.6, 1, 0.95], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, headerHeight], [0, -headerHeight * 0.15], Extrapolate.CLAMP);

    return {
      transform: [{ scale }, { translateY }],
    };
  }, [scrollY.value]); // <-- explicit dependency array

  // background color logic (supports {light,dark} or string)
  const headerBgColor =
    typeof headerBackgroundColor === 'string'
      ? headerBackgroundColor
      : headerBackgroundColor?.light ?? '#A1CEDC';

  return (
    <View style={styles.container}>
      {/* Header container (absolute) */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }, headerAnimStyle]}>
        {/* Background color layer */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: headerBgColor }]} />

        {/* Animated header image (if provided) */}
        {headerImage ? (
          <Animated.View style={[StyleSheet.absoluteFill, styles.centerContent, imageAnimStyle]}>
            {headerImage}
          </Animated.View>
        ) : null}
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 40 }}
        // For web consistency, enable bounce behavior only on native
        bounces={Platform.OS !== 'web'}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
