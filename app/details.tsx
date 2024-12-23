import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, useColorScheme, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DocDetails() {
  const params = useLocalSearchParams();
  const { uri, title, date } = params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000', fontFamily: 'Tomorrow' }]}>
          Document Details
        </Text>
      </View>

      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: uri as string }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000', fontFamily: 'Tomorrow' }]}>
            File Information
          </Text>
          <Text style={[styles.info, { color: isDark ? '#ccc' : '#666', fontFamily: 'Tomorrow' }]}>
            Name: {title}
          </Text>
          <Text style={[styles.info, { color: isDark ? '#ccc' : '#666', fontFamily: 'Tomorrow' }]}>
            Date: {date}
          </Text>
          <Text style={[styles.info, { color: isDark ? '#ccc' : '#666', fontFamily: 'Tomorrow' }]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: SCREEN_WIDTH - 40, // Full width minus padding
    height: SCREEN_WIDTH - 40,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  }
});