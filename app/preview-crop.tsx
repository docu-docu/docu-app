// app/preview-crop.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import { detectDocumentEdges } from './utils/documentDetector';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PreviewCropScreen() {
  const params = useLocalSearchParams();
  const photoUri = params.photoUri as string;
  const [loading, setLoading] = useState(true);
  const [processedUri, setProcessedUri] = useState<string | null>(null);

  useEffect(() => {
    if (!photoUri) {
      console.log('No photo URI found, returning to docs');
      router.replace('/(tabs)/docs');
      return;
    }
    processImage();
  }, [photoUri]);

  const processImage = async () => {
    try {
      console.log('Starting image processing');
      
      // Get detected corners
      const detectedCorners = await detectDocumentEdges(photoUri);
      console.log('Corners detected:', detectedCorners);

      // Add padding to crop to avoid cutting off edges
      const padding = 10; // pixels of padding
      const cropResult = await ImageManipulator.manipulateAsync(
        photoUri,
        [
          {
            crop: {
              originX: Math.max(0, Math.min(...detectedCorners.map(c => c.x)) - padding),
              originY: Math.max(0, Math.min(...detectedCorners.map(c => c.y)) - padding),
              width: Math.min(
                Math.max(...detectedCorners.map(c => c.x)) - Math.min(...detectedCorners.map(c => c.x)) + (padding * 2)
              ),
              height: Math.min(
                Math.max(...detectedCorners.map(c => c.y)) - Math.min(...detectedCorners.map(c => c.y)) + (padding * 2)
              )
            }
          }
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log('Image cropped successfully');

      setProcessedUri(cropResult.uri);
      setLoading(false);
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to original image
      setProcessedUri(photoUri);
      setLoading(false);
    }
  };

  const handleRetake = () => {
    // Navigate to camera tab instead of using back
    router.replace('/(tabs)/camera');
  };

  const confirmImage = () => {
    router.replace({
      pathname: '/name-scan',
      params: { photoUri: processedUri }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={styles.loadingText}>Processing document...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: processedUri || photoUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRetake}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={confirmImage}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Use Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  primaryButton: {
    backgroundColor: '#2f95dc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#fff',
  },
});