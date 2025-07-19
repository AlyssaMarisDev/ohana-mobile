import React from "react";
import { StyleProp, ViewStyle, StyleSheet, View } from "react-native";
import Screen from "./Screen";
import ProfileHeader from "./ProfileHeader";
import { useAuth } from "../context/AuthContext";

type ScreenWithProfileProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showProfile?: boolean;
  onProfilePress?: () => void;
  profileImageUrl?: string;
};

function ScreenWithProfile({
  children,
  style,
  showProfile = true,
  onProfilePress,
  profileImageUrl,
}: ScreenWithProfileProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Screen style={style}>
      {children}
      {showProfile && isAuthenticated && (
        <View style={styles.profileContainer}>
          <ProfileHeader
            onProfilePress={onProfilePress}
            profileImageUrl={profileImageUrl}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // Adjust based on your safe area needs
    paddingRight: 16,
  },
});

export default ScreenWithProfile;
