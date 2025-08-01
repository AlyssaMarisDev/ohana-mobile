import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type ActionMenuItemProps = {
  title: string;
  icon: ReactNode;
  color?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const ActionMenuItem = ({
  title,
  icon,
  color,
  onPress,
  style,
  textStyle,
}: ActionMenuItemProps) => {
  let iconElement = icon;
  if (React.isValidElement(icon)) {
    const iconProps = (icon.props || {}) as { style?: StyleProp<ViewStyle> };
    iconElement = React.cloneElement(icon, {
      ...(color ? { color } : {}),
      ...(iconProps.style !== undefined
        ? { style: [{ marginRight: 8 }, iconProps.style] }
        : { style: { marginRight: 8 } }),
    });
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.dropdownMenuItem, style]}
    >
      {iconElement}
      <Text
        style={[styles.dropdownMenuText, color ? { color } : null, textStyle]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export type ActionMenuProps = {
  visible: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ActionMenu = ({ visible, children, style }: ActionMenuProps) => {
  if (!visible) return null;
  return <View style={[styles.dropdownMenu, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
    minWidth: 140,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownMenuText: {
    fontWeight: '500',
    fontSize: 16,
  },
});
