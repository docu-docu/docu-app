import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      // Check Camera directory first
      const cameraDir = `${FileSystem.cacheDirectory}Camera/`;
      const docsDir = `${FileSystem.documentDirectory}scans/`;
      
      // Ensure scans directory exists
      const dirExists = await FileSystem.getInfoAsync(docsDir);
      if (!dirExists.exists) {
        await FileSystem.makeDirectoryAsync(docsDir, { intermediates: true });
      }

      // Move any new photos from Camera to scans
      const cameraExists = await FileSystem.getInfoAsync(cameraDir);
      if (cameraExists.exists) {
        const cameraFiles = await FileSystem.readDirectoryAsync(cameraDir);
        for (const file of cameraFiles) {
          if (file.endsWith('.jpg')) {
            const timestamp = new Date().getTime();
            const newFileName = `scan_${timestamp}.jpg`;
            try {
              await FileSystem.moveAsync({
                from: `${cameraDir}${file}`,
                to: `${docsDir}${newFileName}`
              });
            } catch (moveError) {
              console.error('Error moving file:', moveError);
            }
          }
        }
      }

      // Load all documents
      const files = await FileSystem.readDirectoryAsync(docsDir);
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
      
      const sortedDocs = docsWithInfo.sort((a, b) => b.date.localeCompare(a.date));
      setDocuments(sortedDocs);
      setFilteredDocuments(sortedDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  // Load documents when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      loadDocuments();
      
      // Set up polling for new documents
      const interval = setInterval(loadDocuments, 1000);
      return () => clearInterval(interval);
    }, [])
  );

  // Search functionality
  useEffect(() => {
    const filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const DocumentTile = ({ title, date, uri }) => (
    <TouchableOpacity 
      style={styles.documentTile}
      onPress={() => {
        console.log('Opening document:', uri);
      }}
    >
      <Ionicons name="document-text-outline" size={24} color="#666" />
      <Text style={[styles.documentTitle, { fontFamily: 'Tomorrow' }]} numberOfLines={1}>{title}</Text>
      <Text style={[styles.documentDate, { fontFamily: 'Tomorrow' }]}>{date}</Text>
    </TouchableOpacity>
  );

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
    paddingTop: 25,
    paddingBottom: 20,
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
});