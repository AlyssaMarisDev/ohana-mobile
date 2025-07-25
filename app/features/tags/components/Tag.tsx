import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tag as TagType } from '../services/TagService';

interface TagProps {
  tag: TagType;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  tag,
  size = 'medium',
  onPress: _onPress,
}) => {
  const sizeStyles = {
    small: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 12 },
    medium: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 14 },
    large: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 16 },
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tag.color },
        sizeStyles[size],
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {tag.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 4,
    marginBottom: 4,
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
});
