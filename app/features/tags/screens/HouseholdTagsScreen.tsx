import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import Text from '../../../common/components/Text';
import { useHouseholds } from '../../households/hooks/useHouseholds';
import { useHouseholdTags } from '../hooks/useHouseholdTags';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../../common/config';
import { Tag } from '../services/TagService';
import CreateTagModal from '../components/CreateTagModal';

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
      (navigation as any).setOptions({
        title: `${household.name} Tags`,
      });
    }
  }, [household, navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchHouseholds(), refetchTags()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateTag = async (tagData: { name: string; color: string }) => {
    setIsCreatingTag(true);
    try {
      // TODO: Implement tag creation API call
      console.log('Creating tag:', tagData);
      // After successful creation, refresh the tags list
      await refetchTags();
      setIsCreateModalVisible(false);
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const renderTag = ({ item }: { item: Tag }) => (
    <View style={styles.tagItem}>
      <View style={[styles.tagColor, { backgroundColor: item.color }]} />
      <Text style={styles.tagName}>{item.name}</Text>
    </View>
  );

  if (isLoadingHouseholds || isLoadingTags) {
    return (
      <Screen style={styles.container}>
        <Text style={styles.loadingText}>Loading tags...</Text>
      </Screen>
    );
  }

  if (!household) {
    return (
      <Screen style={styles.container}>
        <Text style={styles.errorText}>Household not found</Text>
      </Screen>
    );
  }

  if (tagsError) {
    return (
      <Screen style={styles.container}>
        <Text style={styles.errorText}>Failed to load tags</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[configs.colors.primary]}
                  tintColor={configs.colors.primary}
                />
              }
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

      <CreateTagModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTag}
        isLoading={isCreatingTag}
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
    backgroundColor: configs.colors.foreground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
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
