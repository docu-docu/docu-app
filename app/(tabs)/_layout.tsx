import React from 'react';
import { Text, useColorScheme, View, StyleSheet, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);

const IconSymbol = ({ name, size, color, style }: { name: string; size: number; color: string; style?: object }) => {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}>
      <Text style={{ color: '#fff', fontSize: size / 3, textAlign: 'center' }}>{name[0].toUpperCase()}</Text>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getAnimatedStyle = (focused: boolean) => useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1 : 0.9, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

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
      shadowOffset: {
        width: 0,
        height: 20,
      },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 30,
      elevation: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      width: width * 0.9,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
    },
    focusedTab: {
      width: 70,
      height: 60,
      backgroundColor: isDark ? '#111' : '#f5f5f5',
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
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
      opacity: 0.7,
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
      screenOptions={({ route }) => ({
        tabBarStyle: route.name === 'camera' ? { display: 'none' } : styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
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
              <IconSymbol
                name="folder"
                size={22}
                color={isDark ? '#fff' : '#000'}
                style={{ opacity: focused ? 1 : 0.5 }}
              />
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
              <IconSymbol
                name="camera"
                size={22}
                color={isDark ? '#fff' : '#000'}
                style={{ opacity: focused ? 1 : 0.5 }}
              />
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
              <IconSymbol
                name="gear"
                size={22}
                color={isDark ? '#fff' : '#000'}
                style={{ opacity: focused ? 1 : 0.5 }}
              />
              <Text style={focused ? styles.labelFocused : styles.label}>SETUP</Text>
            </AnimatedView>
          ),
        }}
      />
    </Tabs>
  );
}
