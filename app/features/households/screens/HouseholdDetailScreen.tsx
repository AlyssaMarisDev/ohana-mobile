import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Text from '../../../common/components/Text';
import { useHouseholds } from '../hooks/useHouseholds';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../../common/config';

type HouseholdDetailRouteProp = RouteProp<
  {
    HouseholdDetail: { householdId: string };
  },
  'HouseholdDetail'
>;

function HouseholdDetailScreen() {
  const route = useRoute<HouseholdDetailRouteProp>();
  const navigation = useNavigation();
  const { householdId } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const {
    households,
    isLoading: isLoadingHouseholds,
    refetch: refetchHouseholds,
  } = useHouseholds(false);

  const household = households.find(h => h.id === householdId);

  // Update header title when household data is loaded
  useEffect(() => {
    if (household) {
      (navigation as any).setOptions({
        title: household.name,
      });
    }
  }, [household, navigation]);

  const handleViewTasks = () => {
    (navigation as any).navigate('HouseholdTasks', { householdId });
  };

  const handleViewTags = () => {
    (navigation as any).navigate('HouseholdTags', { householdId });
  };

  const handleViewMembers = () => {
    (navigation as any).navigate('HouseholdMembers', { householdId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchHouseholds();
    } catch (error) {
      console.error('Error refreshing household data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoadingHouseholds) {
    return (
      <Screen style={styles.container}>
        <Text style={styles.loadingText}>Loading household details...</Text>
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

  return (
    <Screen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[configs.colors.primary]}
            tintColor={configs.colors.primary}
          />
        }
      >
        {/* Household Header */}
        <View style={styles.householdHeader}>
          <Image
            source={require('../../../../assets/icon.png')}
            style={styles.householdImage}
          />
          <Text style={styles.householdName}>{household.name}</Text>
          {household.description && (
            <Text style={styles.householdDescription}>
              {household.description}
            </Text>
          )}
        </View>

        {/* Household Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>

          <TouchableOpacity style={styles.optionItem} onPress={handleViewTasks}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="list-outline"
                size={20}
                color={configs.colors.textPrimary}
              />
              <Text style={styles.optionText}>View Tasks</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={configs.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handleViewTags}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={configs.colors.textPrimary}
              />
              <Text style={styles.optionText}>View Tags</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={configs.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleViewMembers}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name="people-outline"
                size={20}
                color={configs.colors.textPrimary}
              />
              <Text style={styles.optionText}>View Members</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={configs.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: configs.colors.background,
  },
  householdHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: configs.colors.foreground,
  },
  householdImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: configs.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  householdName: {
    fontSize: 24,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 4,
  },
  householdDescription: {
    fontSize: 16,
    color: configs.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: configs.colors.gray4,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: configs.colors.textPrimary,
    marginLeft: 12,
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

export default HouseholdDetailScreen;
