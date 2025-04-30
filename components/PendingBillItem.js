import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

const PendingBillItem = ({ bill, onPress }) => {
  const { groups, friends } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  
  // Find the group and payer
  const group = groups.find(g => g.id === bill.groupId);
  const payer = bill.paidBy === user.id 
    ? { name: 'You' } 
    : friends.find(f => f.id === bill.paidBy) || { name: 'Unknown' };
  
  // Check if current user owes money
  const userOwes = bill.owedBy.includes(user.id);
  
  // Format due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    
    // Check if due today or tomorrow
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      // Format as MM/DD
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // Calculate split amount (assuming equal split among all who owe)
  const totalOwers = bill.owedBy.length;
  const splitAmount = totalOwers > 0 ? bill.amount / totalOwers : bill.amount;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        userOwes ? styles.owedContainer : {}
      ]}
      onPress={() => onPress(bill)}
      activeOpacity={0.7}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="receipt-outline" size={20} color={userOwes ? "#F44336" : "#4CAF50"} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.description}>{bill.description}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.paidBy}>
              {payer.name} paid
            </Text>
            <Text style={styles.groupName}>
              • {group ? group.name : 'Unknown Group'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={[
          styles.amount,
          userOwes ? styles.owedAmount : styles.paidAmount
        ]}>
          {userOwes ? `-$${splitAmount.toFixed(2)}` : `+$${bill.amount.toFixed(2)}`}
        </Text>
        <Text style={styles.dueDate}>Due {formatDueDate(bill.dueDate)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: 'space-between',
  },
  owedContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidBy: {
    fontSize: 14,
    color: '#666',
  },
  groupName: {
    fontSize: 14,
    color: '#5EA2EF',
    marginLeft: 4,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  owedAmount: {
    color: '#F44336',
  },
  paidAmount: {
    color: '#4CAF50',
  },
  dueDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default PendingBillItem;
