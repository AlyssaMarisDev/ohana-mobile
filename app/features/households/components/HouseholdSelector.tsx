import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Household } from '../services/householdService';
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedHousehold = households.find(h => h.id === selectedHouseholdId);

  const handleSelectHousehold = (householdId: string) => {
    onSelectHousehold(householdId);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
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
          name="chevron-down"
          size={20}
          color={configs.colors.gray3}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Household</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={configs.colors.gray3}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.householdList}>
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
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: configs.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: configs.colors.gray0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: configs.colors.black,
  },
  closeButton: {
    padding: 5,
  },
  householdList: {
    maxHeight: 400,
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
