// app/utils/documentDetector.ts
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

interface Point { x: number; y: number }

export async function detectDocumentEdges(imageUri: string): Promise<Point[]> {
  try {
    console.log('Starting document edge detection');

    // Get original dimensions first
    const originalDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      Image.getSize(imageUri, (w, h) => resolve({ width: w, height: h }), reject);
    });
    console.log('Original dimensions:', originalDimensions);
    
    // Step 1: Resize image for processing
    console.log('Resizing image...');
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }],
      { base64: true, format: ImageManipulator.SaveFormat.JPEG }
    );
    console.log('Image resized successfully');

    // Step 2: Get resized dimensions
    const resizedDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      Image.getSize(resized.uri, (w, h) => resolve({ width: w, height: h }), reject);
    });
    console.log('Resized dimensions:', resizedDimensions);

    // Calculate scaling factors
    const scaleX = originalDimensions.width / resizedDimensions.width;
    const scaleY = originalDimensions.height / resizedDimensions.height;

    // Generate corners with 10% margin in original image coordinates
    const margin = 0.1;
    const corners: Point[] = [
      { 
        x: originalDimensions.width * margin, 
        y: originalDimensions.height * margin 
      },
      { 
        x: originalDimensions.width * (1 - margin), 
        y: originalDimensions.height * margin 
      },
      { 
        x: originalDimensions.width * (1 - margin), 
        y: originalDimensions.height * (1 - margin) 
      },
      { 
        x: originalDimensions.width * margin, 
        y: originalDimensions.height * (1 - margin) 
      }
    ];

    console.log('Detected corners:', corners);
    return corners;

  } catch (error) {
    console.error('Error in detectDocumentEdges:', error);
    throw error;
  }
}