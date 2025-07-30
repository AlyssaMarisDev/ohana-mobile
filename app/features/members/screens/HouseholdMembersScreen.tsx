import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Screen from '../../../common/components/Screen';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import Text from '../../../common/components/Text';
import { useHouseholds } from '../../households/hooks/useHouseholds';
import { useHouseholdMembers } from '../hooks/useHouseholdMembers';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../../common/config';
import { Member } from '../services/MemberService';

type HouseholdMembersRouteProp = RouteProp<
  {
    HouseholdMembers: { householdId: string };
  },
  'HouseholdMembers'
>;

function HouseholdMembersScreen() {
  const route = useRoute<HouseholdMembersRouteProp>();
  const navigation = useNavigation();
  const { householdId } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const {
    households,
    isLoading: isLoadingHouseholds,
    refetch: refetchHouseholds,
  } = useHouseholds(false);

  const {
    data: members = [],
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useHouseholdMembers(householdId, true);

  const household = households.find(h => h.id === householdId);

  // Update header title when household data is loaded
  useEffect(() => {
    if (household) {
      (navigation as any).setOptions({
        title: `${household.name} Members`,
      });
    }
  }, [household, navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchHouseholds(), refetchMembers()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberItem}>
      <Image
        source={require('../../../../assets/icon.png')}
        style={styles.memberImage}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDetails}>
          {item.age ? `${item.age} years old` : ''} • {item.gender || ''}
        </Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members</Text>
          {members.length > 0 ? (
            <FlatList
              data={members}
              renderItem={renderMember}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.membersList}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={48}
                color={configs.colors.textSecondary}
              />
              <Text style={styles.emptyText}>No members found</Text>
              <Text style={styles.emptySubtext}>
                Members will appear here when they join this household.
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
      {isLoadingHouseholds || isLoadingMembers ? (
        <Text style={styles.loadingText}>Loading members...</Text>
      ) : !household ? (
        <Text style={styles.errorText}>Household not found</Text>
      ) : membersError ? (
        <Text style={styles.errorText}>Failed to load members</Text>
      ) : (
        renderContent()
      )}
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
  membersList: {
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: configs.colors.foreground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    borderWidth: 2,
    borderColor: configs.colors.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 14,
    color: configs.colors.textSecondary,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: configs.colors.textSecondary,
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

export default HouseholdMembersScreen;
