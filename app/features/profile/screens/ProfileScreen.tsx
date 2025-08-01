import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../../common/components/Screen';
import configs from '../../../common/config';
import { useMembers } from '../../members/hooks/useMembers';
import { useAuth } from '../../auth/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { logger } from '@/app/common/utils/logger';

function ProfileScreen() {
  const navigation = useNavigation();
  const { member, refetch } = useMembers(true);
  const { logout, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login' as never);
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (isAuthenticated) {
        await refetch();
      } else {
        // If user is not authenticated, they should be redirected to login
        logger.info('User not authenticated during refresh');
      }
    } catch (error) {
      logger.error('Error refreshing member data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!member) {
    return (
      <Screen style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={configs.colors.primary || '#0000ff'}
          />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      style={styles.container}
      refreshable={true}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={require('../../../../assets/icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{member?.name || 'John Doe'}</Text>
        <Text style={styles.userEmail}>
          {member?.email || 'john.doe@example.com'}
        </Text>
        <Text style={styles.userDetails}>
          {member?.age ? `${member.age} years old` : ''} •{' '}
          {member?.gender || ''}
        </Text>
      </View>

      {/* Profile Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="person-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Edit Profile</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Change Email</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Change Password</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Notifications</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Appearance</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Help & Support</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Terms of Service</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={configs.colors.textPrimary}
            />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={configs.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: configs.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: configs.colors.textPrimary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: configs.colors.foreground,
  },
  profileImage: {
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
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: configs.colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: configs.colors.textSecondary,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: configs.colors.textSecondary,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    backgroundColor: configs.colors.gray4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    marginLeft: 8,
  },
});

export default ProfileScreen;
