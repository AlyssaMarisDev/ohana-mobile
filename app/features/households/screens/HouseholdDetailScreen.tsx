import React, { useEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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

  const { households, isLoading: isLoadingHouseholds } = useHouseholds(false);

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
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Household Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{household.name}</Text>
          </View>
          {household.description && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{household.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewTasks}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons
                name="list-outline"
                size={24}
                color={configs.colors.primary}
              />
              <View style={styles.actionButtonText}>
                <Text style={styles.actionButtonTitle}>View Tasks</Text>
                <Text style={styles.actionButtonSubtitle}>
                  Manage tasks for this household
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={configs.colors.textSecondary}
              />
            </View>
          </TouchableOpacity>
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: configs.colors.textSecondary,
    width: 100,
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    color: configs.colors.textPrimary,
    flex: 1,
  },
  actionButton: {
    backgroundColor: configs.colors.foreground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: configs.colors.textSecondary,
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
