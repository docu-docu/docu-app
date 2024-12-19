import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { CameraView } from "expo-camera";
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

global.cameraRef = null;

export default function CameraScreen() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const cameraRef = React.useRef(null);

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
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
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
  buttonContainer: {
    position: 'absolute',
    bottom: 90,
    width: '100%',
    alignItems: 'center',
  },
  
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }
});