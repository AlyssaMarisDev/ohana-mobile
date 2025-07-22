import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import configs from '../../common/config';
import { useMembers } from '../members/hooks/useMembers';
import { useHouseholds } from '../households/hooks/useHouseholds';

type SidebarProps = {
  isVisible: boolean;
  onClose: () => void;
  onProfilePress: () => void;
  onTodayPress: () => void;
  onHouseholdPress: (householdId: string) => void;
};

const { width } = Dimensions.get('window');

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  onProfilePress,
  onTodayPress,
  onHouseholdPress,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-width)).current;
  const { member } = useMembers(isVisible);
  const { households, isLoading: householdsLoading } = useHouseholds(isVisible);

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleProfilePress = () => {
    onClose(); // Close the sidebar
    onProfilePress(); // Navigate to profile
  };

  const handleTodayPress = () => {
    onClose(); // Close the sidebar
    onTodayPress(); // Navigate to today
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Section */}
          <TouchableOpacity
            style={styles.userProfileSection}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <View style={styles.profileContainer}>
              <Image
                source={require('../../../assets/icon.png')} // Stock profile image
                style={styles.profileImage}
              />
              <Text style={styles.userName}>
                {member?.name || 'Loading...'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleTodayPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="today-outline" size={20} color="#666" />
                <Text style={styles.menuItemText}>Today</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Households Section */}
          <View style={styles.householdsSection}>
            <Text style={styles.sectionTitle}>Households</Text>
            {householdsLoading ? (
              <Text style={styles.loadingText}>Loading households...</Text>
            ) : households.length > 0 ? (
              households.map(household => (
                <TouchableOpacity
                  key={household.id}
                  style={styles.householdItem}
                  onPress={() => onHouseholdPress(household.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.householdName}>{household.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No households found</Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8, // 80% of screen width
    height: '100%',
    backgroundColor: configs.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  userProfileSection: {
    paddingTop: 60, // Account for status bar
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: configs.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  householdsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  householdItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  householdName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default Sidebar;
