import React from "react";

declare global {
  var cameraRef: React.RefObject<{
    takePictureAsync: (options: {
      imageType: string;
      base64: boolean;
      skipProcessing: boolean;
    }) => Promise<{ uri: string }>;
  }>;
}
import { useColorScheme } from "react-native";
import { Tabs } from "expo-router";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

const { width } = Dimensions.get("window");
const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const pathname = usePathname();

  const getAnimatedStyle = (focused: boolean) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: withSpring(focused ? 1 : 0.9, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    }));

  const handleCameraPress = async () => {
    if (pathname !== "/camera") {
      console.log("Navigating to camera");
      router.push("/camera");
      return;
    }

    try {
      console.log("Attempting to take picture...");
      if (global.cameraRef?.current) {
        const photo = await global.cameraRef.current.takePictureAsync({
          imageType: "jpg",
          base64: false,
          skipProcessing: false,
        });
        console.log("Photo taken successfully:", photo.uri);

        // Immediately navigate to name-scan with the photo URI
        router.replace({
          pathname: "/name-scan",
          params: { photoUri: photo.uri },
        });
      }
    } catch (error) {
      console.error("Failed to take picture:", error);
    }
  };

  const styles = StyleSheet.create({
    tabBar: {
      position: "absolute",
      bottom: 25,
      left: 20,
      right: 20,
      height: 75,
      backgroundColor: isDark ? "#000" : "#fff",
      borderRadius: 25,
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 30,
      elevation: 20,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 40,
      marginRight: 10,
      marginLeft: 10,
      borderWidth: 2,
      borderColor: isDark ? "#3d3d3d" : "#fff",
    },
    sideTab: {
      width: 100,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,
    },
    cameraTab: {
      position: "absolute",
      bottom: 0,
      left: "50%",
      marginLeft: -45,
      width: 90,
      height: 90,
      backgroundColor: "#2f95dc",
      borderRadius: 45,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#2f95dc",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 25,
      borderWidth: 3,
      borderColor: isDark ? "#000" : "#fff",
    },
    innerCircle: {
      position: "absolute",
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: "#1e88e5",
      opacity: 0.7,
      transform: [{ scale: 0.85 }],
    },
    glassEffect: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: 45,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transform: [{ scaleY: 0.6 }],
      top: 10,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
      marginTop: 4,
    },
  });

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="docs"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedView style={[styles.sideTab, getAnimatedStyle(focused)]}>
              <Feather
                name="folder"
                size={24}
                color={focused ? "#2f95dc" : isDark ? "#666" : "#999"}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? "#2f95dc" : isDark ? "#666" : "#999" },
                ]}
              >
                DOCS
              </Text>
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedView
              style={[styles.cameraTab, getAnimatedStyle(focused)]}
              onTouchEnd={handleCameraPress}
            >
              <View style={styles.innerCircle} />
              <View style={styles.glassEffect} />
              <Feather name="camera" size={32} color="#fff" />
              <Text style={[styles.label, { color: "#fff", marginTop: 2 }]}>
                SCAN
              </Text>
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedView style={[styles.sideTab, getAnimatedStyle(focused)]}>
              <Feather
                name="settings"
                size={24}
                color={focused ? "#2f95dc" : isDark ? "#666" : "#999"}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? "#2f95dc" : isDark ? "#666" : "#999" },
                ]}
              >
                SETTINGS
              </Text>
            </AnimatedView>
          ),
        }}
      />
    </Tabs>
  );
}
