import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReceiptScanScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  
  // Mock OCR processing function
  const processReceiptImage = (imageUri) => {
    // In a real app, this would send the image to an OCR service
    // For demo purposes, we'll simulate a processing delay and return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock detected items
        const mockItems = [
          { id: '1', name: 'Burger', price: 12.99 },
          { id: '2', name: 'Fries', price: 4.99 },
          { id: '3', name: 'Soda', price: 2.49 },
          { id: '4', name: 'Chicken Wings', price: 9.99 },
          { id: '5', name: 'Tax', price: 3.05 }
        ];
        resolve(mockItems);
      }, 2000); // 2 second delay to simulate processing
    });
  };
  
  // Simulate taking a photo
  const handleTakePhoto = () => {
    setIsScanning(true);
    
    // Simulate a camera capture with a timeout
    setTimeout(() => {
      // Mock captured image URI (in a real app, this would be from the camera)
      const mockImageUri = 'https://ui-avatars.com/api/?name=Receipt&size=200&background=22DDAA&color=fff';
      setScannedReceipt(mockImageUri);
      setIsScanning(false);
      
      // Start "processing" the receipt
      processReceiptImage(mockImageUri)
        .then(items => {
          setReceiptItems(items);
          setScanComplete(true);
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to process receipt');
          console.error(error);
        });
    }, 1500);
  };
  
  // Simulate choosing a file
  const handleChooseFile = () => {
    setIsScanning(true);
    
    // Simulate file selection with a timeout
    setTimeout(() => {
      // Mock selected file URI
      const mockFileUri = 'https://ui-avatars.com/api/?name=Receipt&size=200&background=5EA2EF&color=fff';
      setScannedReceipt(mockFileUri);
      setIsScanning(false);
      
      // Start "processing" the receipt
      processReceiptImage(mockFileUri)
        .then(items => {
          setReceiptItems(items);
          setScanComplete(true);
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to process receipt');
          console.error(error);
        });
    }, 1500);
  };
  
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setEditedName(item.name);
    setEditedPrice(item.price.toString());
    setIsEditModalVisible(true);
  };
  
  const handleAddItem = () => {
    const newId = (Math.max(...receiptItems.map(item => parseInt(item.id))) + 1).toString();
    const newItem = { id: newId, name: 'New Item', price: 0 };
    setReceiptItems([...receiptItems, newItem]);
    handleEditItem(newItem);
  };
  
  const handleRemoveItem = (itemId) => {
    setReceiptItems(receiptItems.filter(item => item.id !== itemId));
  };
  
  const saveEditedItem = () => {
    const price = parseFloat(editedPrice);
    if (isNaN(price)) {
      Alert.alert('Invalid Price', 'Please enter a valid price');
      return;
    }
    
    const updatedItems = receiptItems.map(item => 
      item.id === currentItem.id 
        ? { ...item, name: editedName, price: price } 
        : item
    );
    
    setReceiptItems(updatedItems);
    setIsEditModalVisible(false);
  };
  
  const calculateTotal = () => {
    return receiptItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };
  
  const handleCreateBill = () => {
    // Pass the receipt data back to the previous screen
    navigation.navigate('Chat', { 
      id: groupId,
      scannedItems: receiptItems,
      receiptTotal: calculateTotal()
    });
  };
  
  const renderReceiptItem = ({ item }) => (
    <View style={styles.receiptItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.itemActionButton}
          onPress={() => handleEditItem(item)}
        >
          <Ionicons name="pencil" size={18} color="#5EA2EF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.itemActionButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Ionicons name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Receipt</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {!scanComplete ? (
        <View style={styles.scanContainer}>
          {scannedReceipt ? (
            <View style={styles.processingContainer}>
              <Image source={{ uri: scannedReceipt }} style={styles.receiptImage} />
              <Text style={styles.processingText}>
                {isScanning ? 'Capturing...' : 'Processing receipt...'}
              </Text>
              {!isScanning && (
                <View style={styles.loadingIndicator}>
                  <View style={styles.loadingBar} />
                </View>
              )}
            </View>
          ) : (
            <>
              <View style={styles.scanPlaceholder}>
                <Ionicons name="receipt-outline" size={80} color="#DADADA" />
                <Text style={styles.scanText}>
                  Scan your receipt to automatically create a bill
                </Text>
              </View>
              
              <View style={styles.scanOptions}>
                <TouchableOpacity 
                  style={[styles.scanButton, styles.primaryButton]}
                  onPress={handleTakePhoto}
                  disabled={isScanning}
                >
                  <Ionicons name="camera-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.scanButton, styles.secondaryButton]}
                  onPress={handleChooseFile}
                  disabled={isScanning}
                >
                  <Ionicons name="document-outline" size={24} color="#5EA2EF" />
                  <Text style={[styles.buttonText, { color: '#5EA2EF' }]}>Upload File</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Scanned Items</Text>
            <TouchableOpacity onPress={handleAddItem}>
              <Ionicons name="add-circle" size={24} color="#5EA2EF" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={receiptItems}
            renderItem={renderReceiptItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.itemsList}
          />
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.createBillButton}
            onPress={handleCreateBill}
          >
            <Text style={styles.createBillText}>Create Bill</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.rescanButton}
            onPress={() => {
              setScannedReceipt(null);
              setScanComplete(false);
              setReceiptItems([]);
            }}
          >
            <Text style={styles.rescanText}>Scan Another Receipt</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Edit Item Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Item Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter item name"
            />
            
            <Text style={styles.modalLabel}>Price</Text>
            <TextInput
              style={styles.modalInput}
              value={editedPrice}
              onChangeText={setEditedPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            
            <TouchableOpacity
              style={styles.saveItemButton}
              onPress={saveEditedItem}
            >
              <Text style={styles.saveItemText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  scanText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  scanOptions: {
    width: '100%',
    flexDirection: 'column',
    gap: 15,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#5EA2EF',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#5EA2EF',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  processingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  receiptImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  processingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  loadingIndicator: {
    width: '80%',
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    width: '70%',
    backgroundColor: '#5EA2EF',
    borderRadius: 3,
    animation: 'loading 2s infinite',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemsList: {
    paddingBottom: 20,
  },
  receiptItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  itemActions: {
    flexDirection: 'row',
  },
  itemActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5EA2EF',
  },
  createBillButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createBillText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rescanButton: {
    padding: 15,
    alignItems: 'center',
  },
  rescanText: {
    color: '#5EA2EF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  saveItemButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiptScanScreen;