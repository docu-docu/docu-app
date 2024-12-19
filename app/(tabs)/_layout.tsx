import React from 'react';
import { useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text, View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);

const IconSymbol = ({ name, size, color }: { name: string; size: number; color: string }) => (
  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }}>
    <Text style={{ color: '#fff', textAlign: 'center', fontSize: size / 3 }}>{name[0].toUpperCase()}</Text>
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getAnimatedStyle = (focused: boolean) => useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(focused ? 1 : 0.9, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
  }));

  const styles = StyleSheet.create({
    tabBar: {
      position: 'absolute',
      bottom: 10,
      left: width * 0.05,
      height: 75,
      backgroundColor: isDark ? '#000' : '#fff',
      borderRadius: 40,
      borderWidth: 2,
      borderColor: '#2f95dc',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 30,
      elevation: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      width: width * 0.9,
    },
    focusedTab: {
      width: 70,
      height: 60,
      backgroundColor: isDark ? '#111' : '#f5f5f5',
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unfocusedTab: {
      width: 70,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginTop: 5,
    },
    labelFocused: {
      fontSize: 11,
      fontWeight: '700',
      color: isDark ? '#fff' : '#000',
      marginTop: 5,
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
            <AnimatedView
              style={[
                focused ? styles.focusedTab : styles.unfocusedTab,
                getAnimatedStyle(focused),
              ]}
            >
              <IconSymbol name="folder" size={22} color={isDark ? '#fff' : '#000'} />
              <Text style={focused ? styles.labelFocused : styles.label}>DOCS</Text>
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedView
              style={[
                focused ? styles.focusedTab : styles.unfocusedTab,
                getAnimatedStyle(focused),
              ]}
            >
              <IconSymbol name="camera" size={22} color={isDark ? '#fff' : '#000'} />
              <Text style={focused ? styles.labelFocused : styles.label}>SCAN</Text>
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedView
              style={[
                focused ? styles.focusedTab : styles.unfocusedTab,
                getAnimatedStyle(focused),
              ]}
            >
              <IconSymbol name="gear" size={22} color={isDark ? '#fff' : '#000'} />
              <Text style={focused ? styles.labelFocused : styles.label}>SETTINGS</Text>
            </AnimatedView>
          ),
        }}
      />
    </Tabs>
  );
}
