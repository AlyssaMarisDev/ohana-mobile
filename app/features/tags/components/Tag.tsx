import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tag as TagType } from '../services/TagService';

interface TagProps {
  tag: TagType;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  isSelected?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  tag,
  size = 'medium',
  onPress: _onPress,
  isSelected = false,
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
        sizeStyles[size],
        isSelected
          ? {
              backgroundColor: tag.color,
              borderWidth: 1,
              borderColor: tag.color,
            }
          : {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: tag.color,
            },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: sizeStyles[size].fontSize },
          isSelected ? { color: 'black' } : { color: tag.color },
        ]}
      >
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
