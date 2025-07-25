import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TagList, TagComponent } from '../index';
import { Tag } from '../services/TagService';

interface TagExampleProps {
  householdId: string;
}

export const TagExample: React.FC<TagExampleProps> = ({ householdId }) => {
  const handleTagPress = (tagId: string) => {
    console.log('Tag pressed:', tagId);
  };

  return (
    <View style={styles.container}>
      <TagList
        householdId={householdId}
        size="medium"
        onTagPress={handleTagPress}
        maxTags={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
