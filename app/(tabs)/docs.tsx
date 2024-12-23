import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      console.log('Starting loadDocuments...');
      // Check Camera directory first
      const cameraDir = `${FileSystem.cacheDirectory}Camera/`;
      const docsDir = `${FileSystem.documentDirectory}scans/`;
      
      console.log('Directories:', {
        cameraDir,
        docsDir
      });
  
      // Ensure scans directory exists
      const dirExists = await FileSystem.getInfoAsync(docsDir);
      console.log('Scans directory exists:', dirExists.exists);
      
      if (!dirExists.exists) {
        console.log('Creating scans directory...');
        await FileSystem.makeDirectoryAsync(docsDir, { intermediates: true });
      }
  
      // Move any new photos from Camera to scans
      const cameraExists = await FileSystem.getInfoAsync(cameraDir);
      console.log('Camera directory exists:', cameraExists.exists);
      
      if (cameraExists.exists) {
        const cameraFiles = await FileSystem.readDirectoryAsync(cameraDir);
        console.log('Found camera files:', cameraFiles);
        
        for (const file of cameraFiles) {
          if (file.endsWith('.jpg')) {
            console.log('Processing camera file:', file);
            const timestamp = new Date().getTime();
            const newFileName = `scan_${timestamp}.jpg`;
            try {
              console.log(`Moving ${file} to ${newFileName}`);
              await FileSystem.moveAsync({
                from: `${cameraDir}${file}`,
                to: `${docsDir}${newFileName}`
              });
              console.log('File moved successfully');
            } catch (moveError) {
              console.error('Error moving file:', moveError);
            }
          }
        }
      }
  
      // Load all documents
      console.log('Reading documents directory...');
      const files = await FileSystem.readDirectoryAsync(docsDir);
      console.log('Found document files:', files);
      
      const docsWithInfo = await Promise.all(
        files.map(async (filename) => {
          const fileInfo = await FileSystem.getInfoAsync(`${docsDir}${filename}`);
          return {
            id: filename,
            title: filename.split('.')[0],
            date: new Date(fileInfo.modificationTime * 1000).toISOString().split('T')[0],
            uri: fileInfo.uri
          };
        })
      );
      
      console.log('Processed documents:', docsWithInfo);
      
      const sortedDocs = docsWithInfo.sort((a, b) => b.date.localeCompare(a.date));
      setDocuments(sortedDocs);
      setFilteredDocuments(sortedDocs);
      
      console.log('Documents loaded successfully');
    } catch (error) {
      console.error('Error in loadDocuments:', error);
    }
  };


  // Load documents when screen focuses
  useFocusEffect(
  React.useCallback(() => {
    console.log('Docs screen focused, loading documents...');
    loadDocuments();
  }, [])
);

  // Search functionality
  useEffect(() => {
    const filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const DocumentTile = ({ title, date, uri }) => {
    const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
  
    const handlePressIn = () => {
      const timeout = setTimeout(() => {
        setShowDeleteConfirm(true);
      }, 1500);
      setPressTimeout(timeout);
    };
  
    const handlePressOut = () => {
      if (pressTimeout) {
        clearTimeout(pressTimeout);
        setPressTimeout(null);
      }
    };
  
    const handleDelete = async () => {
      try {
        await FileSystem.deleteAsync(uri);
        loadDocuments(); // This will refresh the list
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    };
  
    return (
      <TouchableOpacity 
        style={[
          styles.documentTile,  // Changed from documentTitle to documentTile
          { backgroundColor: showDeleteConfirm ? '#ff4444' : isDark ? '#1a1a1a' : '#f5f5f5' }
        ]}
        onPress={() => {
          if (showDeleteConfirm) {
            handleDelete();
          } else {
            router.push({
              pathname: '/details',
              params: { uri, title, date }
            });
          }
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {showDeleteConfirm ? (
          <View style={styles.tileContent}>
            <Feather name="trash-2" size={24} color="#fff" />
            <Text style={[styles.deleteText, { fontFamily: 'Tomorrow' }]}>
              Release to Delete
            </Text>
          </View>
        ) : (
          <View style={styles.tileContent}>
            <Ionicons name="document-text-outline" size={24} color={isDark ? '#fff' : '#666'} />
            <Text 
              style={[styles.documentTitle, { color: isDark ? '#fff' : '#000', fontFamily: 'Tomorrow' }]} 
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text 
              style={[styles.documentDate, { color: isDark ? '#ccc' : '#666', fontFamily: 'Tomorrow' }]}
            >
              {date}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: 'Tomorrow' }]}>Documents</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { fontFamily: 'Tomorrow' }]}
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.documentsGrid}>
          {filteredDocuments.map((doc) => (
            <DocumentTile 
              key={doc.id} 
              title={doc.title} 
              date={doc.date}
              uri={doc.uri}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  documentTile: {
    width: (SCREEN_WIDTH - 40) / 2,
    height: 120,
    margin: 5,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    color: '#fff',
    textAlign: 'center',
  },
});

