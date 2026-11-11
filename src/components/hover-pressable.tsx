import { useState } from 'react';
import { Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

interface HoverPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
}

/**
 * A Pressable that adds a hover state on web while keeping the normal pressed
 * feedback on touch devices.
 */
export function HoverPressable({
  style,
  hoverStyle,
  pressedStyle,
  onHoverIn,
  onHoverOut,
  ...props
}: HoverPressableProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      {...props}
      onHoverIn={(event) => {
        setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      style={({ pressed }) => [
        style,
        hovered && hoverStyle,
        pressed && pressedStyle,
      ]}
    />
  );
}
