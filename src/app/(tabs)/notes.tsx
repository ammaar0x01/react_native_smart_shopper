import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  //   SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GlobalStyles } from "@/global.styles";
// --------------------------------------------------------------


const STORAGE_KEY = "@notes_app_data";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes) as Note[]);
      }
    } catch (error) {
      console.error("Failed to load notes.");
    }
  };

  const saveNotesToStorage = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Failed to save notes.");
    }
  };

  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) {
      if (Platform.OS === "web") {
        window.alert("Note cannot be empty.");
      } else {
        Alert.alert("Validation", "Note cannot be empty.");
      }
      return;
    }

    const timestamp = new Date().toLocaleString();

    if (currentNoteId) {
      const updatedNotes: Note[] = notes.map((note) =>
        note.id === currentNoteId
          ? { ...note, title, content, updatedAt: timestamp }
          : note,
      );
      saveNotesToStorage(updatedNotes);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim() || "Untitled Note",
        content: content.trim(),
        updatedAt: timestamp,
      };
      saveNotesToStorage([newNote, ...notes]);
    }

    closeModal();
  };

  // Cross-platform delete fix (supports Web & Native)
  const handleDeleteNote = (id: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this note?",
      );
      if (confirmed) {
        const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
        saveNotesToStorage(updatedNotes);
      }
    } else {
      Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
            saveNotesToStorage(updatedNotes);
          },
        },
      ]);
    }
  };

  const openModalForEdit = (note: Note) => {
    setCurrentNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const openModalForCreate = () => {
    setCurrentNoteId(null);
    setTitle("");
    setContent("");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentNoteId(null);
    setTitle("");
    setContent("");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { width } = useWindowDimensions();

  const horizontalPadding = width >= 768 ? 40 : 20;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>My Notes</Text>

          {/* <Text style={styles.headerTitle} className='jim-nightshade-regular'>My Notes</Text> */}
          <Text style={styles.noteCount}>{notes.length} notes</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notes found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.noteCard}
                activeOpacity={0.7}
                onPress={() => openModalForEdit(item)}
              >
                <View style={styles.noteContentContainer}>
                  <Text style={styles.noteTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.noteSnippet} numberOfLines={2}>
                    {item.content}
                  </Text>
                  <Text style={styles.noteDate}>{item.updatedAt}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNote(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff5252" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={openModalForCreate}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Add/Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {currentNoteId ? "Edit Note" : "New Note"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.inputTitle}
                placeholder="Title"
                placeholderTextColor="#aaa"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={styles.inputBody}
                placeholder="Start typing your note here..."
                placeholderTextColor="#aaa"
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveNote}
                >
                  <Text style={styles.saveButtonText}>Save Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* </SafeAreaView> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // === LAYOUT
  outerContainer: GlobalStyles.mainContainer,

  scrollContent: GlobalStyles.scrollContent,

  // === Header
  headerContainer: GlobalStyles.headerContainer,

  headerTitle: GlobalStyles.pageHeading,

  headerSubtitle: GlobalStyles.pageSubheading,
  // -----------------------------------------

  noteCount: {
    fontSize: 14,
    color: "#666",
  },

  // ---search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,

    // marginHorizontal: 20,
    marginVertical: 10,

    paddingHorizontal: 12,
    paddingVertical: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    // padding: 0,
    padding: 10,
    outlineStyle: "none",
  } as any,

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 5,
  },
  noteCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  noteContentContainer: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  noteSnippet: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 11,
    color: "#999",
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    // backgroundColor: '#007AFF',
    backgroundColor: "#1aaa00",

    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  // --- MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    marginBottom: 15,
    padding: 10,
  },
  inputBody: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    marginBottom: 20,
    padding: 10,
    borderWidth: 0,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f1f2f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
