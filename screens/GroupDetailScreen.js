import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import PendingBillItem from '../components/PendingBillItem';

const GroupDetailScreen = ({ route, navigation }) => {
  const { id: groupId } = route.params;
  const { groups, friends, pendingBills, addExpense } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  
  // Find the group
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Group not found</Text>
      </View>
    );
  }
  
  // Get members info
  const members = group.members.map(memberId => {
    if (memberId === user.id) {
      return { id: user.id, name: 'You', avatar: user.avatar };
    }
    return friends.find(friend => friend.id === memberId) || { id: memberId, name: 'Unknown User' };
  });
  
  // Get group bills
  const groupBills = pendingBills.filter(bill => bill.groupId === groupId)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  const handleAddExpense = async () => {
    if (!expenseDescription.trim()) {
      Alert.alert('Error', 'Please enter an expense description');
      return;
    }
    
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Create expense object
    const expense = {
      description: expenseDescription.trim(),
      amount: amount,
      paidBy: user.id,
      owedBy: group.members.filter(memberId => memberId !== user.id),
    };
    
    const result = await addExpense(groupId, expense);
    
    if (result.success) {
      setExpenseModalVisible(false);
      setExpenseDescription('');
      setExpenseAmount('');
    } else {
      Alert.alert('Error', result.error || 'Failed to add expense');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={expenseModalVisible}
        onRequestClose={() => setExpenseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setExpenseModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                value={expenseDescription}
                onChangeText={setExpenseDescription}
                placeholder="What was this expense for?"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Paid By</Text>
              <View style={styles.paidByContainer}>
                <Image 
                  source={{ uri: user.avatar || 'https://ui-avatars.com/api/?name=You' }} 
                  style={styles.paidByAvatar} 
                />
                <Text style={styles.paidByText}>You</Text>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Split Among</Text>
              <View style={styles.splitContainer}>
                {members.map(member => (
                  <View key={member.id} style={styles.memberItem}>
                    <Image 
                      source={{ uri: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}` }}
                      style={styles.memberAvatar} 
                    />
                    <Text style={styles.memberName}>{member.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddExpense}
            >
              <Text style={styles.saveButtonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Group Info Card */}
      <View style={styles.groupCard}>
        <Text style={styles.groupName}>{group.name}</Text>
        {group.description && (
          <Text style={styles.groupDescription}>{group.description}</Text>
        )}
        
        <View style={styles.groupStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${group.totalExpenses.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{members.length}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{groupBills.length}</Text>
            <Text style={styles.statLabel}>Bills</Text>
          </View>
        </View>
      </View>
      
      {/* Group Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setExpenseModalVisible(true)}
        >
          <Ionicons name="cash-outline" size={20} color="#5EA2EF" />
          <Text style={styles.actionText}>Add Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            // Navigate to ChatScreen in the MessagesStack
            navigation.navigate('MessagesTab', {
              screen: 'Chat',
              params: { 
                id: groupId,
                name: group.name
              }
            });
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#5EA2EF" />
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            Alert.alert(
              'Group Settings',
              'What would you like to do?',
              [
                {
                  text: 'Manage Members',
                  onPress: () => {
                    Alert.alert('Members', 'Add or remove members from this group');
                  }
                },
                {
                  text: 'Manage Admins',
                  onPress: () => {
                    Alert.alert('Admins', 'Promote or demote group admins');
                  }
                },
                {
                  text: 'Edit Group',
                  onPress: () => {
                    Alert.alert('Edit', 'Change group name, photo, or description');
                  }
                },
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ]
            );
          }}
        >
          <Ionicons name="settings-outline" size={20} color="#5EA2EF" />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      {/* Members Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
        <View style={styles.membersGrid}>
          {members.map(member => (
            <View key={member.id} style={styles.memberCard}>
              <Image 
                source={{ uri: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}` }}
                style={styles.memberCardAvatar}
              />
              <Text style={styles.memberCardName} numberOfLines={1}>
                {member.name}
              </Text>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[styles.memberCard, styles.addMemberCard]}
            onPress={() => {
              // Show modal to select a friend to add as a member
              Alert.alert(
                'Add Member',
                'Select a friend to add to this group:',
                friends
                  .filter(friend => !group.members.includes(friend.id))
                  .map(friend => ({
                    text: friend.name,
                    onPress: () => {
                      // Add the friend to the group
                      Alert.alert(
                        'Success',
                        `${friend.name} has been added to ${group.name}`,
                        [{ text: 'OK' }]
                      );
                    }
                  }))
                  .concat([
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    }
                  ])
              );
            }}
          >
            <View style={styles.addMemberButton}>
              <Ionicons name="add" size={24} color="#5EA2EF" />
            </View>
            <Text style={styles.addMemberText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Expenses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        
        {groupBills.length > 0 ? (
          groupBills.map(bill => (
            <PendingBillItem 
              key={bill.id} 
              bill={bill} 
              onPress={() => {}} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#DADADA" />
            <Text style={styles.emptyStateText}>No expenses yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add an expense to start splitting bills
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 50,
  },
  groupCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5EA2EF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EBEBEB',
  },
  actionsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#5EA2EF',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  memberCard: {
    width: '25%',
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  memberCardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  memberCardName: {
    fontSize: 12,
    textAlign: 'center',
  },
  addMemberCard: {
    justifyContent: 'center',
  },
  addMemberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5EA2EF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  addMemberText: {
    fontSize: 12,
    color: '#5EA2EF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  footer: {
    height: 30,
  },
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
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  paidByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
  paidByAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  paidByText: {
    fontSize: 16,
  },
  splitContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupDetailScreen;
