import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { CameraView } from "expo-camera";
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraScreen() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  
  // Create a ref without useRef hook
  const cameraRef = React.createRef();

  // Set the camera ref to be accessible globally
  React.useEffect(() => {
    global.cameraRef = cameraRef;
    return () => {
      global.cameraRef = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        flash={flashEnabled ? "on" : "off"}
      >
        {/* <TouchableOpacity
          style={styles.flash}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <Ionicons
            name={flashEnabled ? "flash" : "flash-outline"}
            color="white"
            size={25}
          />
        </TouchableOpacity> */}

        <View style={styles.topLeftCorner} />
        <View style={styles.topRightCorner} />
        <View style={styles.bottomLeftCorner} />
        <View style={styles.bottomRightCorner} />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  allowText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  topLeftCorner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderLeftWidth: 3,
    borderLeftColor: 'white',
    borderRadius: 3,
    borderTopWidth: 3,
    borderTopColor: 'white',
    left: '20%',
    top: '30%',
  },
  topRightCorner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 3,
    borderRightWidth: 3,
    borderRightColor: 'white',
    borderTopWidth: 3,
    borderTopColor: 'white',
    right: '20%',
    top: '30%',
  },
  bottomLeftCorner: {
    borderRadius: 3,
    position: 'absolute',
    width: 60,
    height: 60,
    borderLeftWidth: 3,
    borderLeftColor: 'white',
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    left: '20%',
    bottom: '30%',
  },
  bottomRightCorner: {
    borderRadius: 3,
    position: 'absolute',
    width: 60,
    height: 60,
    borderRightWidth: 3,
    borderRightColor: 'white',
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    right: '20%',
    bottom: '30%',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 150,
    borderRadius: 10,
    padding: 10,
  },
  flash: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});