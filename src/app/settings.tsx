import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { GlobalStyles } from '@/global.styles';

const SHOPPING_STORAGE_KEY = '@shopping_lists_storage';
const NOTES_STORAGE_KEY = '@notes_app_data';
const CURRENCY_STORAGE_KEY = '@app_currency_setting';

// Expanded list of global currencies
const ALL_CURRENCIES = [
  { label: 'South African Rand (R)', symbol: 'R', code: 'ZAR' },
  { label: 'US Dollar ($)', symbol: '$', code: 'USD' },
  { label: 'Euro (€)', symbol: '€', code: 'EUR' },
  { label: 'British Pound (£)', symbol: '£', code: 'GBP' },
  { label: 'Australian Dollar (A$)', symbol: 'A$', code: 'AUD' },
  { label: 'Canadian Dollar (C$)', symbol: 'C$', code: 'CAD' },
  { label: 'Indian Rupee (₹)', symbol: '₹', code: 'INR' },
  { label: 'Japanese Yen (¥)', symbol: '¥', code: 'JPY' },
  { label: 'Chinese Yuan (¥)', symbol: '¥', code: 'CNY' },
  { label: 'Brazilian Real (R$)', symbol: 'R$', code: 'BRL' },
  { label: 'Mexican Peso ($)', symbol: '$', code: 'MXN' },
  { label: 'New Zealand Dollar (NZ$)', symbol: 'NZ$', code: 'NZD' },
  { label: 'Swiss Franc (CHF)', symbol: 'CHF', code: 'CHF' },
  { label: 'Singapore Dollar (S$)', symbol: 'S$', code: 'SGD' },
];

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 40 : 20;

  const [currentCurrency, setCurrentCurrency] = useState<string>('R');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrency) {
        setCurrentCurrency(savedCurrency);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  // const handleCurrencyChange = async (symbol: string) => {
  //   try {
  //     setCurrentCurrency(symbol);
  //     await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, symbol);
  //     setModalVisible(false);
  //     setSearchQuery('');
  //     if (Platform.OS === 'web') {
  //       window.alert(`Currency changed to ${symbol}`);
  //     } else {
  //       Alert.alert('Success', `Currency updated to ${symbol}`);
  //     }
  //   } catch (error) {
  //     console.error('Failed to save currency', error);
  //   }
  // };


    // const handleCurrencyChange = async (code: string) => {
    const handleCurrencyChange = async (code: string, symbol: string) => {

    try {
      setCurrentCurrency(code);
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, code);
      setModalVisible(false);
      setSearchQuery('');
      if (Platform.OS === 'web') {
        window.alert(`Currency changed to ${symbol}`);
        // window.alert(`Currency changed to ${code} ${symbol}`);

      } 
      else {
        // Alert.alert('Success', `Currency updated to ${code} ${symbol}`);
        Alert.alert('Success', `Currency updated to ${symbol}`);
      }
    }
    
    catch (error) {
      console.error('Failed to save currency', error);
    }
  
  }


  // Find currently selected currency label for display
  const selectedCurrencyObj = ALL_CURRENCIES.find((c) => c.code === currentCurrency) || {
    label: `Custom (${currentCurrency})`,
    symbol: currentCurrency,
  };

  // Filter currencies based on search query inside combobox
  const filteredCurrencies = ALL_CURRENCIES.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // EXPORT DATA
  const handleExportData = async () => {
    try {
      const shoppingData = await AsyncStorage.getItem(SHOPPING_STORAGE_KEY);
      const notesData = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      const currencyData = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);

      const backupObject = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        currency: currencyData || 'R',
        shoppingLists: shoppingData ? JSON.parse(shoppingData) : [],
        notes: notesData ? JSON.parse(notesData) : [],
      };

      const jsonString = JSON.stringify(backupObject, null, 2);
      const fileName = `ListifyBackup_${new Date().toISOString().split('T')[0]}.json`;

      if (Platform.OS === 'web') {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device.');
        }
      }
    } catch (error) {
      console.error('Export failed', error);
      Alert.alert('Error', 'Failed to export backup file.');
    }
  };

  // IMPORT DATA
  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      let fileContent = '';

      if (Platform.OS === 'web') {
        const response = await fetch(asset.uri);
        fileContent = await response.text();
      } else {
        fileContent = await FileSystem.readAsStringAsync(asset.uri);
      }

      const parsedData = JSON.parse(fileContent);

      if (!parsedData || (!parsedData.shoppingLists && !parsedData.notes)) {
        throw new Error('Invalid backup file format.');
      }

      if (parsedData.shoppingLists) {
        await AsyncStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(parsedData.shoppingLists));
      }
      if (parsedData.notes) {
        await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(parsedData.notes));
      }
      if (parsedData.currency) {
        await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, parsedData.currency);
        setCurrentCurrency(parsedData.currency);
      }

      if (Platform.OS === 'web') {
        window.alert('Data imported successfully! Please refresh the app.');
      } else {
        Alert.alert('Success', 'Data imported successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/shopping' as any) },
        ]);
      }
    } catch (error) {
      console.error('Import failed', error);
      Alert.alert('Error', 'Failed to import backup file. Make sure it is a valid JSON export.');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingHorizontal: horizontalPadding }]} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your preferences, data backups, and currency.</Text>
        </View>
        {/* <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#E59400" />
        </Pressable> */}
      </View>

      {/* Currency Section with Combobox Trigger */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          {/* <Ionicons name="cash-outline" size={20} color="#E59400" style={{ marginRight: 8 }} /> */}
          <Text style={styles.sectionTitle}>Default Currency</Text>
        </View>
        <Text style={styles.sectionDesc}>Select the currency symbol used across your shopping lists and data exports.</Text>

        <Pressable 
          style={styles.comboboxTrigger} 
          onPress={() => setModalVisible(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <View style={styles.currencySymbolBadge}>
              <Text style={styles.currencySymbolText}>{selectedCurrencyObj.symbol}</Text>
            </View> */}

            <Text style={styles.comboboxTriggerText}>{selectedCurrencyObj.label}</Text>
          </View>

          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>
      </View>

      {/* Backup & Restore Data Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          {/* <Ionicons name="server-outline" size={20} color="#E59400" style={{ marginRight: 8 }} /> */}
          <Text style={styles.sectionTitle}>Backup & Restore</Text>
        </View>
        <Text style={styles.sectionDesc}>
          Export all your shopping lists, notes, and currency settings into a secure JSON backup file, or restore them anytime.
        </Text>

        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.exportButton} onPress={handleExportData}>
            <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.exportButtonText}>Export Data</Text>
          </Pressable>

          <Pressable style={styles.importButton} onPress={handleImportData}>
            <Ionicons name="cloud-upload-outline" size={18} color="#1F2937" style={{ marginRight: 8 }} />
            <Text style={styles.importButtonText}>Import Data</Text>
          </Pressable>
        </View>
      </View>


      {/* --- Combobox Modal Selection */}
      <Modal
        animationType="slide"
        // animationType="fade"
        // animationType="none"

        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Select Currency</Text>
              <Pressable onPress={() => { setModalVisible(false); setSearchQuery(''); }}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>

            {/* Search Input for filtering currencies */}
            <View style={styles.modalSearchContainer}>
              <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search currency name or symbol..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            {/* Currency List */}
            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                // const isSelected = currentCurrency === item.symbol;
                const isSelected = currentCurrency === item.code;

                return (
                  <Pressable
                    style={[styles.currencyOptionItem, isSelected && styles.currencyOptionItemActive]}
                    // onPress={() => handleCurrencyChange(item.symbol)}
                    // onPress={() => handleCurrencyChange(item.code)}

                    onPress={() => handleCurrencyChange(item.code, item.label)}

                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* <View style={[styles.currencySymbolBadge, isSelected && { backgroundColor: '#E59400' }]}> */}
                     
                      <View style={[styles.currencySymbolBadge, isSelected && { backgroundColor: '#1aaa00' }]}>
                        <Text style={[styles.currencySymbolText, isSelected && { color: '#FFFFFF' }]}>{item.symbol}</Text>
                      </View>
                      <Text style={[styles.currencyOptionText, isSelected && { fontWeight: '700', color: '#1aaa00' }]}>
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#1aaa00" />}
                  </Pressable>
                );
              }}
            />

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // === LAYOUT 
    container: GlobalStyles.mainContainer, 
  
    scrollContent: GlobalStyles.scrollContent,  


    // === Header 
    headerContainer: GlobalStyles.headerContainer, 
  
      headerTitle: GlobalStyles.pageHeading, 
  
    headerSubtitle: GlobalStyles.pageSubheading, 
  
  


  // container: {
  //   flex: 1,
  //   backgroundColor: '#F9FAFB',
  //   // paddingTop: 30,
  //   // padding: 20,
  //   // paddingTop: 40, 

  //   paddingHorizontal: 20,

  // },
  // scrollContent: {
  //   paddingTop: 50,

  //   paddingBottom: 40,
  // },


  // // --- header
  // headerContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   // marginBottom: 24,
  //   // paddingTop: 50,
  //   // paddingBottom: 6,
  // },
  // headerTitle: {
  //   // fontSize: 34,
  //   fontSize: 42,
  //   fontWeight: '700',
  //   color: '#111827',
  //   letterSpacing: -1, 
  // },
  // headerSubtitle: {
  //   fontSize: 14,
  //   color: '#6B7280',
  //   marginTop: 4,
  // },


  backButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  comboboxTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  comboboxTriggerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  currencySymbolBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  currencySymbolText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D97706',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#E59400',
    backgroundColor: '#1aaa00',

    
    paddingVertical: 14,
    borderRadius: 12,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  importButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  importButtonText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 15,
  },
  // Modal Combobox Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24.0,
    padding: 20,
    height: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
    // @ts-ignore
    outlineStyle: 'none',
  } as any,
  currencyOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderRadius: 8,
  },
  currencyOptionItemActive: {
    backgroundColor: '#FEF3C7',
  },
  currencyOptionText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
});

