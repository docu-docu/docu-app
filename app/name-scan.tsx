import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

useEffect(() => {
  const checkFile = async () => {
    if (photoUri) {
      const exists = await FileSystem.getInfoAsync(photoUri);
      console.log('Photo exists check:', exists);
    }
  };
  checkFile();
}, [photoUri]);


export default function NameScan() {
  const [fileName, setFileName] = useState('');
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const savePhoto = async () => {
    console.log('Starting save process...', photoUri);
    if (!fileName.trim()) return;
    
    try {
      const timestamp = new Date().getTime();
      const newFileName = `${fileName.trim()}_${timestamp}.jpg`;
      const docsDir = `${FileSystem.documentDirectory}scans/`;
      const newUri = `${docsDir}${newFileName}`;
  
      // Ensure directory exists
      const dirExists = await FileSystem.getInfoAsync(docsDir);
      if (!dirExists.exists) {
        await FileSystem.makeDirectoryAsync(docsDir, { intermediates: true });
      }
  
      await FileSystem.moveAsync({
        from: photoUri,
        to: newUri
      });
  
      console.log('File saved successfully at:', newUri);
      
      // Use replace instead of push to prevent stacking
      router.replace('/(tabs)/docs');
    } catch (error) {
      console.error('Error saving file:', error);
    }

    
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 40,
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
      fontFamily: 'Tomorrow',
    },
    inputContainer: {
      marginBottom: 30,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: isDark ? '#fff' : '#000',
      fontFamily: 'Tomorrow',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#3d3d3d' : '#ccc',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      fontFamily: 'Tomorrow',
    },
    button: {
      backgroundColor: '#2f95dc',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Tomorrow',
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Name Your Scan</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>File Name</Text>
          <TextInput
            style={styles.input}
            value={fileName}
            onChangeText={setFileName}
            placeholder="Enter file name"
            placeholderTextColor={isDark ? '#666' : '#999'}
            autoFocus
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={savePhoto}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}