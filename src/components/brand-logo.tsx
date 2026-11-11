import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

const logoMark = require('@/assets/images/logo-mark.png');

interface BrandLogoProps {
  /** Height and width of the logo mark in pixels. */
  size?: number;
  /** Tint applied to the single-colour mark. */
  tintColor?: string;
  /** Colour of the "Smart Shopper" wordmark. */
  textColor?: string;
  showWordmark?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

/**
 * The Smart Shopper brand lockup: a shopping bag with a check cut out of it.
 * Uses a single-colour mark so it can sit on light, dark, or lime surfaces.
 */
export function BrandLogo({
  size = 32,
  tintColor = '#0B0F0D',
  textColor = '#0B0F0D',
  showWordmark = true,
  textStyle,
  style,
}: BrandLogoProps) {
  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Smart Shopper"
    >
      <Image
        source={logoMark}
        style={{ width: size, height: size }}
        contentFit="contain"
        tintColor={tintColor}
      />

      {showWordmark && (
        <Text
          style={[
            styles.wordmark,
            { color: textColor, fontSize: Math.round(size * 0.62) },
            textStyle,
          ]}
        >
          Smart Shopper
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
