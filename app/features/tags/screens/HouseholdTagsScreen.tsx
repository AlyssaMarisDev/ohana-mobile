import React, { useEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Text from '../../../common/components/Text';
import { useHouseholds } from '../../households/hooks/useHouseholds';
import { useHouseholdTags } from '../hooks/useHouseholdTags';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../../common/config';
import { Tag } from '../services/TagService';

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

  const { households, isLoading: isLoadingHouseholds } = useHouseholds(false);

  const {
    data: tags = [],
    isLoading: isLoadingTags,
    error: tagsError,
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
          <Text style={styles.sectionTitle}>Tags</Text>
          {tags.length > 0 ? (
            <FlatList
              data={tags}
              renderItem={renderTag}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tagsList}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 16,
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
