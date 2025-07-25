import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Household } from '../services/HouseholdService';
import configs from '../../../common/config';

interface HouseholdSelectorProps {
  households: Household[];
  selectedHouseholdId: string | null;
  onSelectHousehold: (householdId: string) => void;
  isLoading?: boolean;
}

function HouseholdSelector({
  households,
  selectedHouseholdId,
  onSelectHousehold,
  isLoading = false,
}: HouseholdSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedHousehold = households.find(h => h.id === selectedHouseholdId);

  const handleSelectHousehold = (householdId: string) => {
    onSelectHousehold(householdId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isLoading) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={toggleDropdown}
        disabled={isLoading}
      >
        <View style={styles.selectorContent}>
          <MaterialCommunityIcons
            name="home"
            size={20}
            color={configs.colors.gray3}
            style={styles.icon}
          />
          <Text style={styles.selectorText}>
            {selectedHousehold ? selectedHousehold.name : 'Select a household'}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={configs.colors.gray3}
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <ScrollView
            style={styles.dropdownList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {households.map(household => (
              <TouchableOpacity
                key={household.id}
                style={[
                  styles.householdOption,
                  selectedHouseholdId === household.id &&
                    styles.selectedHousehold,
                ]}
                onPress={() => handleSelectHousehold(household.id)}
              >
                <Text
                  style={[
                    styles.householdOptionText,
                    selectedHouseholdId === household.id &&
                      styles.selectedHouseholdText,
                  ]}
                >
                  {household.name}
                </Text>
                {selectedHouseholdId === household.id && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={configs.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: configs.colors.gray0,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: configs.colors.gray0,
    padding: 15,
    width: '100%',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  selectorText: {
    fontSize: 16,
    color: configs.colors.gray4,
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: configs.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: configs.colors.gray0,
    marginTop: 5,
    maxHeight: 200,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownList: {
    maxHeight: 200,
  },
  householdOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: configs.colors.gray0,
  },
  selectedHousehold: {
    backgroundColor: configs.colors.gray0,
  },
  householdOptionText: {
    fontSize: 16,
    color: configs.colors.gray4,
    flex: 1,
  },
  selectedHouseholdText: {
    color: configs.colors.primary,
    fontWeight: '500',
  },
});

export default HouseholdSelector;
