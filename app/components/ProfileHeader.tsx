import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import configs from "../config";

type ProfileHeaderProps = {
  onProfilePress?: () => void;
  profileImageUrl?: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onProfilePress,
  profileImageUrl,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={onProfilePress}
      activeOpacity={0.7}
    >
      <Image
        source={
          profileImageUrl
            ? { uri: profileImageUrl }
            : require("../../assets/icon.png") // Default avatar
        }
        style={styles.profileImage}
        defaultSource={require("../../assets/icon.png")}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: configs.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default ProfileHeader;
