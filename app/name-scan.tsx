import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';

export default function NameScan() {
  const [fileName, setFileName] = useState('');
  const params = useLocalSearchParams();
  const photoUri = params.photoUri as string;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Check if we have a photo URI on mount
  useEffect(() => {
    console.log('Name scan mounted with photo URI:', photoUri);
    if (!photoUri) {
      console.log('No photo URI provided, returning to docs');
      router.replace('/(tabs)/docs');
    }
  }, [photoUri]);

  const savePhoto = async () => {
    console.log('Starting save process...');
    if (!fileName.trim()) {
      console.log('No filename provided');
      return;
    }
    
    try {
      const timestamp = new Date().getTime();
      const newFileName = `${fileName.trim()}_${timestamp}.jpg`;
      const docsDir = `${FileSystem.documentDirectory}scans/`;
      const newUri = `${docsDir}${newFileName}`;
      
      console.log('Saving file:', {
        from: photoUri,
        to: newUri
      });

      const dirExists = await FileSystem.getInfoAsync(docsDir);
      if (!dirExists.exists) {
        console.log('Creating directory...');
        await FileSystem.makeDirectoryAsync(docsDir, { intermediates: true });
      }

      console.log('Moving file...');
      await FileSystem.moveAsync({
        from: photoUri,
        to: newUri
      });

      console.log('File saved successfully');
      router.replace('/(tabs)/docs');
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { fontFamily: 'Tomorrow' }]}>Name Your Scan</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Tomorrow' }]}>File Name</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Tomorrow' }]}
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
          <Text style={[styles.buttonText, { fontFamily: 'Tomorrow' }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#000',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
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
  },
});