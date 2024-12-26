import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TILE_SIZE = (SCREEN_WIDTH - 40) / 3;

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      const docsDir = `${FileSystem.documentDirectory}scans/`;
      const dirExists = await FileSystem.getInfoAsync(docsDir);

      if (!dirExists.exists) {
        await FileSystem.makeDirectoryAsync(docsDir, { intermediates: true });
      }

      const files = await FileSystem.readDirectoryAsync(docsDir);
      const docsWithInfo = await Promise.all(
        files.map(async (filename) => {
          const fileInfo = await FileSystem.getInfoAsync(
            `${docsDir}${filename}`,
          );
          return {
            id: filename,
            title: filename.split(".")[0],
            date: new Date(fileInfo.modificationTime * 1000)
              .toISOString()
              .split("T")[0],
            uri: fileInfo.uri,
          };
        }),
      );

      setDocuments(docsWithInfo);
      setFilteredDocuments(docsWithInfo);
    } catch (error) {
      console.error("Error in loadDocuments:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDocuments();
    }, []),
  );

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const handleDelete = async (id, uri) => {
    Alert.alert("Delete Document", `Are you sure you want to delete ${id}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(uri);
            loadDocuments();
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        },
      },
    ]);
  };

  const DocumentTile = ({ id, title, date, uri }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isBeingDragged = useSharedValue(false);

    const gesture = Gesture.Pan()
      .onBegin(() => {
        isBeingDragged.value = true;
      })
      .onUpdate((e) => {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      })
      .onEnd(() => {
        isBeingDragged.value = false;

        const isNearTrash =
          translateY.value < -150 && translateX.value > SCREEN_WIDTH / 2 - 50;
        if (isNearTrash) {
          handleDelete(id, uri);
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      zIndex: isBeingDragged.value ? 1 : 0,
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.documentTile, animatedStyle]}>
          <TouchableOpacity
            style={styles.tileContent}
            onPress={() => {
              router.push({
                pathname: "/details",
                params: { uri, title, date },
              });
            }}
          >
            <Ionicons name="document-text-outline" size={24} color="#666" />
            <Text style={styles.documentTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.documentDate}>{date}</Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <Ionicons
          name="trash-outline"
          size={24}
          color="red"
          style={styles.trashIcon}
        />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.documentsGrid}>
          {filteredDocuments.map((doc) => (
            <DocumentTile key={doc.id} {...doc} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  trashIcon: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 44,
    backgroundColor: "#f5f5f5",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  documentTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    elevation: 3,
  },
  tileContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  documentTitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    color: "#333",
  },
  documentDate: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
});
