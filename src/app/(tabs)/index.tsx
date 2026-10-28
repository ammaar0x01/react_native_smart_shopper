import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable, 
  Image,
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  useWindowDimensions,
  Alert,
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalStyles } from '@/global.styles';
// ----------------------------------------------


interface ShoppingItem {
  id: string;
  name: string;
  price: string;
  image: string;
  completed: boolean;
  category: string;
}

interface SavedShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

const STORAGE_KEY = '@shopping_lists_storage';

const INITIAL_LISTS: SavedShoppingList[] = [
  {
    id: 'list-1',
    name: 'Tech & Gadgets',
    items: [
      { 
        id: '1', 
        name: 'Acer Aspire Gaming Laptop', 
        price: 'R 6,499', 
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        completed: false, 
        category: 'Computers' 
      },
    ]
  }
];

export default function ShoppingView() {
  const [lists, setLists] = useState<SavedShoppingList[]>(INITIAL_LISTS);
  const [activeListId, setActiveListId] = useState<string>(INITIAL_LISTS[0].id);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // New List Form State
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Modal State for Adding Item
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('General');
  const [newItemImage, setNewItemImage] = useState('');

  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 40 : 20;

  useEffect(() => {
    loadStoredLists();
  }, []);

  const loadStoredLists = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedLists: SavedShoppingList[] = JSON.parse(storedData);
        if (parsedLists && parsedLists.length > 0) {
          setLists(parsedLists);
          setActiveListId(parsedLists[0].id);
        }
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LISTS));
      }
    } catch (error) {
      console.error('Failed to load shopping lists offline', error);
    }
  };

  const saveListsToStorage = async (updatedLists: SavedShoppingList[]) => {
    try {
      setLists(updatedLists);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    } catch (error) {
      console.error('Failed to save shopping lists offline', error);
    }
  };

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Camera access is required to take product photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewItemImage(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Media library access is required to upload product photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewItemImage(result.assets[0].uri);
    }
  };

  const handleCreateNewList = () => {
    if (!newListName.trim()) return;
    const newList: SavedShoppingList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      items: [],
    };
    const updatedLists = [...lists, newList];
    saveListsToStorage(updatedLists);
    setActiveListId(newList.id);
    setNewListName('');
    setShowNewListInput(false);
  };

  const handleDeleteList = (listId: string) => {
    if (lists.length <= 1) return;
    const updatedLists = lists.filter((l) => l.id !== listId);
    saveListsToStorage(updatedLists);
    if (activeListId === listId) {
      setActiveListId(updatedLists[0].id);
    }
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Validation', 'Please enter a product name.');
      return;
    }
    
    const formattedPrice = newItemPrice.trim() 
      ? (newItemPrice.startsWith('R') ? newItemPrice.trim() : `R ${newItemPrice.trim()}`) 
      : 'R 0.00';

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price: formattedPrice,

      // image: newItemImage.trim() 
      // ? newItemImage.trim() 
      // : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      image: newItemImage.trim() 
        ? newItemImage.trim() 
        // : 'https://images.unsplash.com/photo-1655795451796-390245baacd2?q=80&w=720&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
       
        // : 'https://images.pexels.com/photos/102155/pexels-photo-102155.jpeg?_gl=1*xpng7i*_ga*MTI2MzMzOTQyMy4xNzkzMjE3MTI3*_ga_8JE65Q40S6*czE3OTMyMTcxMjckbzEkZzEkdDE3OTMyMTczNTckajQ0JGwwJGgw', 
        : 'https://images.pexels.com/photos/102155/pexels-photo-102155.jpeg', 
     
      // --- more default images 
      // https://images.unsplash.com/photo-1632342664765-b067a9e89a44?q=80&w=726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
      // https://images.unsplash.com/photo-1650803321876-63010399313e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
      // https://images.unsplash.com/photo-1655795451796-390245baacd2?q=80&w=720&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
      // https://images.unsplash.com/photo-1633471905984-3a4bf834e4c6?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D

      completed: false,
      category: newItemCategory.trim() || 'General',
    };

    const updatedLists = lists.map((l) => {
      if (l.id === activeListId) {
        return { ...l, items: [newItem, ...l.items] };
      }
      return l;
    });

    saveListsToStorage(updatedLists);
    
    // Reset and close modal
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory('General');
    setNewItemImage('');
    setAddItemModalVisible(false);
  };

  const handleToggleItem = (itemId: string) => {
    const updatedLists = lists.map((l) => {
      if (l.id === activeListId) {
        const updatedItems = l.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...l, items: updatedItems };
      }
      return l;
    });
    saveListsToStorage(updatedLists);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedLists = lists.map((l) => {
      if (l.id === activeListId) {
        return { ...l, items: l.items.filter((item) => item.id !== itemId) };
      }
      return l;
    });
    saveListsToStorage(updatedLists);
  };

  const filteredItems = activeList.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = activeList.items.filter((i) => i.completed).length;
  const totalCount = activeList.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Shopping Lists</Text>
            <Text style={styles.headerSubtitle}>Manage your saved lists & track items offline.</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items in this list..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>

        {/* === Saved Lists Selector Bar */}
        <View style={styles.savedListsSection}>
          <View style={styles.savedListsHeaderRow}>
            <Text style={styles.sectionLabel}>Your Lists ({lists.length})</Text>
            <Pressable 
              style={styles.newListTrigger} 
              onPress={() => setShowNewListInput(!showNewListInput)}
            >
              <Ionicons name={showNewListInput ? "close" : "add"} size={14} color="#E59400" />
              <Text style={styles.newListTriggerText}>{showNewListInput ? "Cancel" : "New List"}</Text>
            </Pressable>
          </View>

          {showNewListInput && (
            <View style={styles.newListForm}>
              <TextInput
                style={[styles.textInput, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                placeholder="List Name (e.g. Groceries)"
                placeholderTextColor="#9CA3AF"
                value={newListName}
                onChangeText={setNewListName}
                onSubmitEditing={handleCreateNewList}
              />
              <Pressable style={styles.createListButton} onPress={handleCreateNewList}>
                <Text style={styles.createListButtonText}>Save List</Text>
              </Pressable>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} 
          style={styles.listsScrollRow}>
            {lists.map((list) => {
              const isActive = list.id === activeListId;
              return (
                <Pressable
                  key={list.id}
                  style={[styles.listPill, isActive && styles.listPillActive]}
                  onPress={() => setActiveListId(list.id)}
                >
                  {/* <Ionicons 
                    name={isActive ? "folder-open" : "folder-outline"} 
                    size={14} 
                    color={isActive ? "#FFFFFF" : "#4B5563"} 
                    style={{ marginRight: 6 }}
                  /> */}
                  <Text style={[styles.listPillText, isActive && styles.listPillTextActive]}>
                    {list.name} ({list.items.length})
                  </Text>
                  
                  {lists.length > 1 && (
                    <Pressable 
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                      style={styles.deleteListIcon}
                    >
                      <Ionicons name="close-circle" size={14} color={isActive ? "#FDE68A" : "#9CA3AF"} />
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* === Progress Card & Trigger to open Add Item Modal */}
        <View style={styles.progressCardContainer}>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.selectedListTitle}>{activeList.name}</Text>
              <Text style={styles.progressCount}>{completedCount} of {totalCount} items purchased</Text>
            </View>

            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{progressPercent}%</Text>
            </View>
          </View>

          <Pressable 
            style={styles.openModalButton} 
            onPress={() => setAddItemModalVisible(true)}
          >
            {/* <Ionicons name="add-circle" size={20} color="#FFFFFF" style={{ marginRight: 6 }} /> */}
            <Text style={styles.openModalButtonText}>Add New Item</Text>
          </Pressable>
        </View>

        {/* === Items List (Responsive Grid for Web) */}
        <View style={styles.listSection}>
          <Text style={styles.formSectionTitle}>Items in this List ({filteredItems.length})</Text>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching items found.' : 'This list is currently empty.'}
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {filteredItems.map((item) => {
                // Determine card width based on screen width
                let cardWidth = '100%'; // Mobile default (1 per row)
                if (width >= 1024) {
                  cardWidth = '32%'; // 3 items per row on wider screens
                } else if (width >= 768) {
                  cardWidth = '48%'; // 2 items per row on tablets / smaller web screens
                }

                return (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.todoCard, 
                      { width: cardWidth as any },
                      item.completed && styles.todoCardCompleted
                    ]}
                    onPress={() => handleToggleItem(item.id)}
                  >
                    {/* Checkbox */}
                    <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                      {item.completed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>

                    {/* Product Thumbnail */}
                    <Image source={{ uri: item.image }} style={styles.productThumbnail} resizeMode="cover" />

                    {/* Item Details */}
                    <View style={styles.itemDetails}>
                      <Text 
                        style={[styles.itemName, item.completed && styles.itemNameCompleted]} 
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <View style={styles.itemMetaRow}>
                        <Text style={styles.itemCategory}>{item.category}</Text>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                      </View>
                    </View>

                    {/* Delete Button */}
                    <Pressable 
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }} 
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* === Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Add Item to "{activeList.name}"</Text>
              <Pressable onPress={() => setAddItemModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputSubLabel}>Product Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Mechanical Keyboard"
                placeholderTextColor="#9CA3AF"
                value={newItemName}
                onChangeText={setNewItemName}
              />

              <Text style={styles.inputSubLabel}>Estimated Price</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 1299"
                placeholderTextColor="#9CA3AF"
                value={newItemPrice}
                onChangeText={setNewItemPrice}
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputSubLabel}>Attach Product Image</Text>
              <View style={styles.imageActionRow}>
                <Pressable style={styles.imageActionButton1} onPress={handleTakePhoto}>
                  <Ionicons name="camera-outline" size={18} color="#D97706" />
                  <Text style={styles.imageActionText}>Take Photo</Text>
                </Pressable>

                <Pressable style={styles.imageActionButton2} onPress={handlePickImage}>
                  <Ionicons name="image-outline" size={18} color="#D97706" />
                  <Text style={styles.imageActionText}>Upload Image</Text>
                </Pressable>
              </View>

              {newItemImage !== '' && (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: newItemImage }} style={styles.photoPreview} resizeMode="cover" />
                  <View style={styles.previewMeta}>
                    <Text style={styles.previewLabel}>Image attached successfully</Text>
                    <Pressable onPress={() => setNewItemImage('')}>
                      <Text style={styles.removePhotoText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              <View style={styles.modalFooterButtons}>

                <Pressable style={styles.addButton} onPress={handleAddItem}>
                  <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.addButtonText}>Save Item</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // === LAYOUT 
  outerContainer: GlobalStyles.mainContainer, 

  scrollContent: GlobalStyles.scrollContent,  

  // --- Header
  headerContainer: GlobalStyles.headerContainer, 

  headerTitle: GlobalStyles.pageHeading, 

  headerSubtitle: GlobalStyles.pageSubheading, 
  // -------------------------------------------

  // backButton: {
  //   padding: 10,
  //   borderRadius: 10,
  //   backgroundColor: '#FEF3C7',
  // },


  // --- search 
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    // maxWidth: 400,

  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
    // @ts-ignore
    outlineStyle: 'none',
  } as any,


  savedListsSection: {
    // marginBottom: 20,
    marginBottom: 50,
    marginTop: 10,
    // margin: 10, 
    // backgroundColor: 'rgba(255, 204, 128, 0.74)',
    padding: 20,  

    //  boxShadow: "0px 6px 6px rgba(0, 0, 0, 0.1)",
    //  boxShadow: "0px 5px 0px rgba(106, 105, 105, 0.1)",

    // elevation: 5, 
    // elevation: 1, 

    // borderRadius: 10, 
    // borderColor: 'rgb(141, 141, 141)', 
    // borderWidth: 1, 

    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  savedListsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    // padding: 20,  

  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10, 
  },
  newListTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newListTriggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  newListForm: {
    flexDirection: 'row',
    marginBottom: 20,
    // margin: 0,
  },
  createListButton: {
    // backgroundColor: '#E59400',
    backgroundColor: '#1aaa00',

    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 46,
  },
  createListButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  listsScrollRow: {
    flexDirection: 'row',
    padding: 10, 
  },
  listPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  listPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  listPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  listPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteListIcon: {
    marginLeft: 6,
  },

  // --- progress
  progressCardContainer: {
    marginBottom: 20,
    maxWidth: 500,
    // maxWidth: 900,

  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  progressInfo: {
    flex: 1,
  },
  selectedListTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  progressCount: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },
  badgeContainer: {
    // backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // --- (modal) add a new item 
  openModalButton: {
    // backgroundColor: '#E59400',
    backgroundColor: '#1aaa00',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    // maxWidth: 500,
    // maxWidth: 900,
    // maxWidth: 200,
  },
  openModalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },


  // --- Modal Specific Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    // padding:10, 
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    padding: 10, 
  },
  modalFooterButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  modalCancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 15,
  },

  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
    // margin: 10, 
    marginHorizontal: 10, 

  },
  inputSubLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
    marginHorizontal: 10, 

  },


  imageActionRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 10, 

  },
  imageActionButton1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbf9d5',
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 9,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
    imageActionButton2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbf9d5',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 9,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },

  imageActionText: {
    color: '#D97706',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },


  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  photoPreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  previewMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  removePhotoText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1aaa00',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10, 
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },

  // --- list of items 
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // Spacing between grid items
  },
  listSection: {
    marginTop: 4,
    // maxWidth: 400,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  todoCardCompleted: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  productThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#9CA3AF',
  },


});