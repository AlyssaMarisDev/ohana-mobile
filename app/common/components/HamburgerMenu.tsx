import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import configs from '../config/colors';

type HamburgerMenuProps = {
  onPress: () => void;
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.hamburgerButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="menu" size={24} color={configs.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    marginRight: 12,
    marginLeft: 12,
  },
});

export default HamburgerMenu;
