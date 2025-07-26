import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTodayTags } from '../hooks/useTodayTags';
import { Tag } from './Tag';
import ErrorMessage from '../../../common/components/ErrorMessage';

interface TagListProps {
  householdId: string;
  size?: 'small' | 'medium' | 'large';
  onTagPress?: (tagId: string) => void;
  maxTags?: number;
}

export const TagList: React.FC<TagListProps> = ({
  householdId,
  size = 'medium',
  onTagPress,
  maxTags,
}) => {
  const { data: tags, isLoading, error } = useTodayTags(householdId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tags...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage error="Failed to load tags" visible={true} />
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

  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;

  return (
    <View style={styles.container}>
      <FlatList
        data={displayTags}
        keyExtractor={item => item.id}
        horizontal={false}
        numColumns={3}
        renderItem={({ item }) => (
          <Tag tag={item} size={size} onPress={() => onTagPress?.(item.id)} />
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
