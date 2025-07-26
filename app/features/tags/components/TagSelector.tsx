import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useHouseholdTags } from '../hooks/useHouseholdTags';
import { Tag } from './Tag';
import ErrorMessage from '../../../common/components/ErrorMessage';
import configs from '../../../common/config';

interface TagSelectorProps {
  householdId: string;
  selectedTagIds: string[];
  onTagToggle: (tagId: string) => void;
  maxHeight?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  householdId,
  selectedTagIds,
  onTagToggle,
  maxHeight = 120,
}) => {
  const { data: tags, isLoading, error } = useHouseholdTags(householdId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Tags</Text>
        <Text style={styles.loadingText}>Loading tags...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Tags</Text>
        <ErrorMessage error="Failed to load tags" visible={true} />
      </View>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Tags</Text>
        <Text style={styles.emptyText}>No tags available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags (optional)</Text>
      <ScrollView
        style={[styles.tagContainer, { maxHeight }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tagGrid}>
          {tags.map(tag => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                onPress={() => onTagToggle(tag.id)}
                style={styles.tagWrapper}
              >
                <Tag tag={tag} size="small" isSelected={isSelected} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 8,
  },
  tagContainer: {
    // Removed border and background to eliminate the box
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagWrapper: {
    position: 'relative',
  },
  selectedCount: {
    fontSize: 12,
    color: configs.colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: configs.colors.textSecondary,
    fontStyle: 'italic',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: configs.colors.textSecondary,
    fontStyle: 'italic',
    padding: 16,
  },
});
