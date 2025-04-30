import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import ChatMessage from '../components/ChatMessage';

const ChatScreen = ({ route, navigation }) => {
  const { id: chatId, name: chatName, isGroup = false, isAdmin = false } = route.params;
  const { messages, sendMessage, groups, friends, addExpense, updateGroup } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [messageText, setMessageText] = useState('');
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [billDescription, setBillDescription] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [groupSettingsVisible, setGroupSettingsVisible] = useState(false);
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState(chatName);
  const [selectedTab, setSelectedTab] = useState('members'); // 'members', 'admins'
  const flatListRef = useRef(null);
  
  // Get chat messages
  const chatMessages = messages[chatId] || [];
  
  // Get group or conversation data
  const group = isGroup ? groups.find(g => g.id === chatId) : null;
  
  // Get members info
  const members = isGroup && group ? group.members.map(memberId => {
    if (memberId === user.id) {
      return { id: user.id, name: 'You', avatar: user.avatar };
    }
    return friends.find(friend => friend.id === memberId) || { id: memberId, name: 'Unknown User' };
  }) : [];
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (chatMessages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);
  
  const handleSendMessage = async () => {
    if (messageText.trim().length === 0) return;
    
    const result = await sendMessage(chatId, messageText.trim());
    
    if (result.success) {
      setMessageText('');
    } else {
      // Handle error
      console.log('Failed to send message:', result.error);
    }
  };
  
  // Function to show the menu options when 3-dot is clicked
  const handleMenuPress = () => {
    setMenuVisible(true);
  };
  
  // Set the header right button when component mounts
  useEffect(() => {
    if (isGroup) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity 
            style={{ marginRight: 15, padding: 5, backgroundColor: '#F2F2F7', borderRadius: 15 }}
            onPress={handleMenuPress}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#5EA2EF" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation, isGroup]);
  
  // Handle receipt scan data when returning from the ReceiptScanScreen
  useEffect(() => {
    if (route.params?.scannedItems && route.params?.receiptTotal) {
      const items = route.params.scannedItems;
      const total = route.params.receiptTotal;
      
      // Generate a bill description from the scanned items
      const itemNames = items.map(item => item.name).join(', ');
      const billDescription = `Receipt: ${itemNames}`;
      
      // Set the values to create a bill
      setBillDescription(billDescription);
      setBillAmount(total);
      setBillModalVisible(true);
      
      // Clear the route params to prevent showing the modal again on navigation
      navigation.setParams({ scannedItems: undefined, receiptTotal: undefined });
    }
  }, [route.params?.scannedItems, route.params?.receiptTotal]);
  
  const handleAddExpense = () => {
    setMenuVisible(false);
    // We'll navigate to ReceiptScan screen for the new flow
    navigation.navigate('ReceiptScan', { groupId: chatId });
  };
  
  const handleGroupSettings = () => {
    setMenuVisible(false);
    // Navigate to dedicated GroupSettings screen
    navigation.navigate('GroupSettings', { 
      id: chatId, 
      name: chatName,
      isAdmin
    });
  };
  
  const handleGroupOverview = () => {
    setMenuVisible(false);
    // Navigate to GroupOverview screen which replaces the GroupDetail screen
    navigation.navigate('GroupOverview', { 
      id: chatId, 
      name: chatName
    });
  };
  
  const handleManageMembers = () => {
    setGroupSettingsVisible(false);
    setMembersModalVisible(true);
  };
  
  const handleEditGroup = () => {
    setGroupSettingsVisible(false);
    setEditedGroupName(chatName);
    setEditGroupModalVisible(true);
  };
  
  const removeGroupMember = async (memberId) => {
    if (!isGroup || !group) return;
    
    try {
      // Remove the member from the group
      const updatedMembers = group.members.filter(id => id !== memberId);
      const updatedGroup = { ...group, members: updatedMembers };
      
      // Find the member name for the system message
      const memberName = members.find(m => m.id === memberId)?.name || 'Unknown User';
      const displayName = memberName === 'You' ? 'you' : memberName;
      
      // Update the group
      await updateGroup(group.id, updatedGroup);
      
      // Add a system message about the removal
      await sendMessage(
        chatId, 
        `${displayName === 'you' ? 'You have' : `${displayName} has`} been removed from the group`,
        { isSystemMessage: true }
      );
      
      if (memberId === user.id) {
        // If the current user was removed, go back to the conversation list
        navigation.goBack();
      }
      
      // Close the modal
      setMembersModalVisible(false);
    } catch (error) {
      console.error('Error removing member:', error);
      Alert.alert('Error', 'Failed to remove member from group');
    }
  };
  
  const toggleAdminStatus = async (memberId) => {
    if (!isGroup || !group) return;
    try {
      // Check if the member is already an admin
      const isCurrentlyAdmin = group.admins && group.admins.includes(memberId);
      
      // Update the admins list
      let updatedAdmins = group.admins || [];
      if (isCurrentlyAdmin) {
        // Remove admin status
        updatedAdmins = updatedAdmins.filter(id => id !== memberId);
      } else {
        // Add admin status
        updatedAdmins = [...updatedAdmins, memberId];
      }
      
      // Find the member name for the system message
      const memberName = members.find(m => m.id === memberId)?.name || 'Unknown User';
      const displayName = memberName === 'You' ? 'You' : memberName;
      
      // Update the group
      const updatedGroup = { ...group, admins: updatedAdmins };
      await updateGroup(group.id, updatedGroup);
      
      // Add a system message about the admin status change
      await sendMessage(
        chatId, 
        `${displayName} ${isCurrentlyAdmin ? 'is no longer' : 'is now'} an admin`,
        { isSystemMessage: true }
      );
      
      // Close the modal
      setMembersModalVisible(false);
    } catch (error) {
      console.error('Error toggling admin status:', error);
      Alert.alert('Error', 'Failed to update admin status');
    }
  };
  
  const saveGroupName = async () => {
    if (!isGroup || !group || !editedGroupName.trim()) return;
    
    try {
      const updatedGroup = { ...group, name: editedGroupName.trim() };
      await updateGroup(group.id, updatedGroup);
      
      // Add a system message about the name change
      await sendMessage(
        chatId, 
        `Group name has been changed to "${editedGroupName.trim()}"`,
        { isSystemMessage: true }
      );
      
      // Close the modal and update navigation params
      setEditGroupModalVisible(false);
      navigation.setParams({ name: editedGroupName.trim() });
    } catch (error) {
      console.error('Error updating group name:', error);
      Alert.alert('Error', 'Failed to update group name');
    }
  };
  
  const handleAddBill = async () => {
    if (!billDescription.trim()) {
      Alert.alert('Error', 'Please enter a bill description');
      return;
    }
    
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Create expense object
    const expense = {
      description: billDescription.trim(),
      amount: amount,
      paidBy: user.id,
      owedBy: isGroup && group ? 
        group.members.filter(memberId => memberId !== user.id) : 
        [chatId.split('-').find(id => id !== user.id)],
    };
    
    const result = await addExpense(chatId, expense);
    
    if (result.success) {
      setBillModalVisible(false);
      setBillDescription('');
      setBillAmount('');
      
      // Send a special bill message
      await sendMessage(chatId, `💰 I've added a new bill: ${billDescription} for $${amount}`);
    } else {
      Alert.alert('Error', result.error || 'Failed to add bill');
    }
  };

  const renderMemberItem = ({ item }) => {
    const isCurrentUser = item.id === user.id;
    const canRemove = isAdmin && !isCurrentUser;
    const isItemAdmin = group.admins && group.admins.includes(item.id);
    
    return (
      <View style={styles.memberItem}>
        <Image 
          source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}` }}
          style={styles.memberAvatar}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          {isItemAdmin && <Text style={styles.adminBadge}>Admin</Text>}
        </View>
        
        {selectedTab === 'members' && canRemove && (
          <TouchableOpacity 
            style={styles.memberAction}
            onPress={() => {
              Alert.alert(
                'Remove Member',
                `Are you sure you want to remove ${item.name} from this group?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeGroupMember(item.id) }
                ]
              );
            }}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
        
        {selectedTab === 'admins' && isAdmin && !isCurrentUser && (
          <TouchableOpacity 
            style={styles.memberAction}
            onPress={() => toggleAdminStatus(item.id)}
          >
            <Text style={isItemAdmin ? styles.demoteText : styles.promoteText}>
              {isItemAdmin ? 'Demote' : 'Promote'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#DADADA" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to send a message!
            </Text>
          </View>
        }
      />
      
      {/* Options Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleAddExpense}
            >
              <Ionicons name="cash-outline" size={24} color="#5EA2EF" />
              <Text style={styles.menuItemText}>Add Expense</Text>
            </TouchableOpacity>
            
            {isGroup && (
              <>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleGroupSettings}
                >
                  <Ionicons name="settings-outline" size={24} color="#5EA2EF" />
                  <Text style={styles.menuItemText}>Group Settings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleGroupOverview}
                >
                  <Ionicons name="pie-chart-outline" size={24} color="#5EA2EF" />
                  <Text style={styles.menuItemText}>Group Overview</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Group Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={groupSettingsVisible}
        onRequestClose={() => setGroupSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Group Settings</Text>
              <TouchableOpacity onPress={() => setGroupSettingsVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={handleManageMembers}
            >
              <Ionicons name="people-outline" size={24} color="#5EA2EF" />
              <Text style={styles.settingsItemText}>Manage Members</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
            
            {isAdmin && (
              <>
                <TouchableOpacity 
                  style={styles.settingsItem}
                  onPress={handleEditGroup}
                >
                  <Ionicons name="create-outline" size={24} color="#5EA2EF" />
                  <Text style={styles.settingsItemText}>Edit Group</Text>
                  <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Manage Members Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={membersModalVisible}
        onRequestClose={() => setMembersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.membersContainer}>
            <View style={styles.membersHeader}>
              <Text style={styles.membersTitle}>Group Members</Text>
              <TouchableOpacity onPress={() => setMembersModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.membersTabs}>
              <TouchableOpacity 
                style={[
                  styles.membersTab,
                  selectedTab === 'members' && styles.activeTab
                ]}
                onPress={() => setSelectedTab('members')}
              >
                <Text style={[
                  styles.membersTabText,
                  selectedTab === 'members' && styles.activeTabText
                ]}>Members</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.membersTab,
                  selectedTab === 'admins' && styles.activeTab
                ]}
                onPress={() => setSelectedTab('admins')}
              >
                <Text style={[
                  styles.membersTabText,
                  selectedTab === 'admins' && styles.activeTabText
                ]}>Admins</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={members}
              renderItem={renderMemberItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.membersList}
            />
          </View>
        </View>
      </Modal>
      
      {/* Edit Group Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editGroupModalVisible}
        onRequestClose={() => setEditGroupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editGroupContainer}>
            <View style={styles.editGroupHeader}>
              <Text style={styles.editGroupTitle}>Edit Group</Text>
              <TouchableOpacity onPress={() => setEditGroupModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.editGroupForm}>
              <Text style={styles.editGroupLabel}>Group Name</Text>
              <TextInput
                style={styles.editGroupInput}
                value={editedGroupName}
                onChangeText={setEditedGroupName}
                placeholder="Enter group name"
              />
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveGroupName}
                disabled={!editedGroupName.trim()}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Bill Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={billModalVisible}
        onRequestClose={() => setBillModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Bill</Text>
              <TouchableOpacity onPress={() => setBillModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.modalInput}
                value={billDescription}
                onChangeText={setBillDescription}
                placeholder="What is this bill for?"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount ($)</Text>
              <TextInput
                style={styles.modalInput}
                value={billAmount}
                onChangeText={setBillAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.addBillButton}
              onPress={handleAddBill}
            >
              <Text style={styles.addBillButtonText}>Create Bill</Text>
            </TouchableOpacity>
            
            <Text style={styles.billNoteText}>
              This will create a bill and notify all {isGroup ? 'group members' : 'participants'}
            </Text>
          </View>
        </View>
      </Modal>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          multiline
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={messageText.trim().length === 0}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={messageText.trim().length === 0 ? "#BDBDBD" : "#5EA2EF"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButton: {
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bill Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addBillButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addBillButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  billNoteText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  // Options Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  // Group Settings Styles
  settingsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 'auto',
    maxHeight: '80%',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  // Members Management Styles
  membersContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 'auto',
    height: '70%',
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  membersTabs: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 15,
    padding: 2,
  },
  membersTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  membersTabText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#5EA2EF',
    fontWeight: '600',
  },
  membersList: {
    paddingVertical: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  adminBadge: {
    fontSize: 12,
    color: '#5EA2EF',
  },
  memberAction: {
    paddingHorizontal: 8,
  },
  promoteText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  demoteText: {
    color: '#FF9500',
    fontWeight: '600',
  },
  // Edit Group Styles
  editGroupContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 'auto',
  },
  editGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editGroupForm: {
    paddingVertical: 10,
  },
  editGroupLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  editGroupInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
