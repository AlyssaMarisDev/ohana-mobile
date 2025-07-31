import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Tag } from '../services/TagService';
import { Tag as TagComponent } from './Tag';
import ErrorMessage from '../../../common/components/ErrorMessage';

interface TagListProps {
  tags?: Tag[];
  isLoading?: boolean;
  error?: Error | null;
  size?: 'small' | 'medium' | 'large';
  onTagPress?: (tagId: string) => void;
  maxTags?: number;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  isLoading = false,
  size = 'medium',
  onTagPress,
  maxTags,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tags...</Text>
      </View>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No tags available</Text>
      </View>
    );
  }

  // Sort tags by name for consistent display
  const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name));
  const displayTags = maxTags ? sortedTags.slice(0, maxTags) : sortedTags;

  return (
    <View style={styles.container}>
      <FlatList
        data={displayTags}
        keyExtractor={item => item.id}
        horizontal={false}
        numColumns={3}
        renderItem={({ item }) => (
          <TagComponent
            tag={item}
            size={size}
            onPress={() => onTagPress?.(item.id)}
          />
        )}
        contentContainerStyle={styles.tagList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagList: {
    paddingVertical: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});
