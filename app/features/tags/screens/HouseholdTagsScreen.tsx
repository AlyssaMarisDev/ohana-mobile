import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Text from '../../../common/components/Text';
import { useHouseholds } from '../../households/hooks/useHouseholds';
import { useHouseholdTags } from '../hooks/useHouseholdTags';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../../common/config';
import { Tag, TagService } from '../services/TagService';
import CreateTagModal from '../components/CreateTagModal';
import EditTagModal from '../components/EditTagModal';
import { logger } from '@/app/common/utils/logger';

type HouseholdTagsRouteProp = RouteProp<
  {
    HouseholdTags: { householdId: string };
  },
  'HouseholdTags'
>;

function HouseholdTagsScreen() {
  const route = useRoute<HouseholdTagsRouteProp>();
  const navigation = useNavigation();
  const { householdId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>(undefined);

  const {
    households,
    isLoading: isLoadingHouseholds,
    refetch: refetchHouseholds,
  } = useHouseholds(false);

  const {
    data: tags = [],
    isLoading: isLoadingTags,
    error: tagsError,
    refetch: refetchTags,
  } = useHouseholdTags(householdId);

  const household = households.find(h => h.id === householdId);

  // Update header title when household data is loaded
  useEffect(() => {
    if (household) {
      navigation.setOptions({
        title: `${household.name} Tags`,
      });
    }
  }, [household, navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchHouseholds(), refetchTags()]);
    } catch (error) {
      logger.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateTag = async (tagData: { name: string; color: string }) => {
    setIsCreatingTag(true);
    try {
      const tagService = new TagService();
      await tagService.createTag(householdId, tagData);
      // After successful creation, refresh the tags list
      await refetchTags();
      setIsCreateModalVisible(false);
    } catch (error) {
      logger.error('Error creating tag:', error);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleEditTag = async (tagData: { name: string; color: string }) => {
    if (!editingTag) return;

    setIsEditingTag(true);
    try {
      const tagService = new TagService();
      await tagService.updateTag(householdId, editingTag.id, tagData);
      // After successful update, refresh the tags list
      await refetchTags();
      setIsEditModalVisible(false);
      setEditingTag(undefined);
    } catch (error) {
      logger.error('Error updating tag:', error);
    } finally {
      setIsEditingTag(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!editingTag) return;

    setIsDeletingTag(true);
    try {
      const tagService = new TagService();
      await tagService.deleteTag(householdId, editingTag.id);
      // After successful deletion, refresh the tags list
      await refetchTags();
      setIsEditModalVisible(false);
      setEditingTag(undefined);
    } catch (error) {
      logger.error('Error deleting tag:', error);
    } finally {
      setIsDeletingTag(false);
    }
  };

  const handleEditPress = (tag: Tag) => {
    setEditingTag(tag);
    setIsEditModalVisible(true);
  };

  const renderTag = ({ item }: { item: Tag }) => (
    <View style={styles.tagItem}>
      <View style={styles.tagLeft}>
        <View style={[styles.tagColor, { backgroundColor: item.color }]} />
        <Text style={styles.tagName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditPress(item)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="create-outline"
          size={20}
          color={configs.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={configs.colors.primary} />
            </TouchableOpacity>
          </View>
          {tags.length > 0 ? (
            <FlatList
              data={[...tags].sort((a, b) => a.name.localeCompare(b.name))}
              renderItem={renderTag}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tagsList}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="pricetag-outline"
                size={48}
                color={configs.colors.textSecondary}
              />
              <Text style={styles.emptyText}>No tags found</Text>
              <Text style={styles.emptySubtext}>
                Tags will appear here when they are created for this household.
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Screen
      style={styles.container}
      refreshable={true}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      {isLoadingHouseholds || isLoadingTags ? (
        <Text style={styles.loadingText}>Loading tags...</Text>
      ) : !household ? (
        <Text style={styles.errorText}>Household not found</Text>
      ) : tagsError ? (
        <Text style={styles.errorText}>Failed to load tags</Text>
      ) : (
        renderContent()
      )}

      <CreateTagModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTag}
        isLoading={isCreatingTag}
      />

      <EditTagModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingTag(undefined);
        }}
        onSubmit={handleEditTag}
        onDelete={handleDeleteTag}
        isLoading={isEditingTag}
        isDeleting={isDeletingTag}
        tag={editingTag}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: configs.colors.textPrimary,
  },
  createButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: configs.colors.foreground,
  },
  tagsList: {
    paddingBottom: 20,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: configs.colors.foreground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  tagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  tagColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  tagName: {
    fontSize: 16,
    color: configs.colors.textPrimary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: configs.colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: configs.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: configs.colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: configs.colors.danger,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default HouseholdTagsScreen;
