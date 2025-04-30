import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import ExpenseItem from '../components/ExpenseItem';

const GroupOverviewScreen = ({ route, navigation }) => {
  const { id: groupId } = route.params || {};
  const { groups, pendingBills, activities, friends } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  
  const [group, setGroup] = useState(null);
  const [groupBills, setGroupBills] = useState([]);
  const [groupActivities, setGroupActivities] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  
  useEffect(() => {
    // Find the group
    const currentGroup = groups.find(g => g.id === groupId);
    if (currentGroup) {
      setGroup(currentGroup);
      
      // Get bills for this group
      const bills = pendingBills.filter(bill => bill.groupId === groupId);
      setGroupBills(bills);
      
      // Get activities for this group
      const filteredActivities = activities.filter(activity => activity.groupId === groupId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10); // Get the 10 most recent activities
      setGroupActivities(filteredActivities);
      
      // Calculate totals
      let owed = 0;
      let paid = 0;
      
      bills.forEach(bill => {
        // If user paid this bill
        if (bill.paidBy === user.id) {
          paid += bill.amount;
        }
        
        // If user owes on this bill
        if (bill.owedBy && bill.owedBy.includes(user.id)) {
          const splitAmount = bill.amount / (bill.owedBy.length + 1); // +1 for payer
          owed += splitAmount;
        }
      });
      
      setTotalOwed(owed);
      setTotalPaid(paid);
    }
  }, [groupId, groups, pendingBills, activities, user.id]);
  
  const renderBillItem = ({ item }) => {
    // Find payer name
    const payer = item.paidBy === user.id 
      ? 'You' 
      : friends.find(f => f.id === item.paidBy)?.name || 'Unknown';
    
    return (
      <ExpenseItem
        expense={{
          ...item,
          payerName: payer,
          date: new Date(item.timestamp)
        }}
        onPress={() => {/* Navigate to expense details */}}
      />
    );
  };
  
  const renderActivityItem = ({ item }) => {
    // Format the date
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return (
      <View style={styles.activityItem}>
        <View style={[
          styles.activityIconContainer,
          item.type === 'payment' ? styles.paymentIcon : styles.expenseIcon
        ]}>
          <Ionicons 
            name={item.type === 'payment' ? 'cash-outline' : 'receipt-outline'} 
            size={18} 
            color="white" 
          />
        </View>
        
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>{item.description}</Text>
          <Text style={styles.activityDate}>{formattedDate}</Text>
        </View>
      </View>
    );
  };
  
  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading group overview...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>{group.name[0]}</Text>
        </View>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.memberCount}>{group.members?.length || 0} Members</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceTitle}>You Paid</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(totalPaid)}</Text>
        </View>
        
        <View style={styles.balanceDivider} />
        
        <View style={styles.balanceItem}>
          <Text style={styles.balanceTitle}>You Owe</Text>
          <Text style={[styles.balanceAmount, styles.owedAmount]}>{formatCurrency(totalOwed)}</Text>
        </View>
        
        <View style={styles.balanceDivider} />
        
        <View style={styles.balanceItem}>
          <Text style={styles.balanceTitle}>Net Balance</Text>
          <Text style={[
            styles.balanceAmount,
            totalPaid > totalOwed ? styles.positiveBalance : styles.negativeBalance
          ]}>
            {formatCurrency(totalPaid - totalOwed)}
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {groupBills.length > 0 ? (
          <FlatList
            data={groupBills.slice(0, 5)} // Show 5 most recent bills
            renderItem={renderBillItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={50} color="#DADADA" />
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first expense to start splitting bills
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        
        {groupActivities.length > 0 ? (
          <FlatList
            data={groupActivities}
            renderItem={renderActivityItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={50} color="#DADADA" />
            <Text style={styles.emptyText}>No recent activity</Text>
            <Text style={styles.emptySubtext}>
              Activity will appear here as you use the group
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Chat', { id: groupId, name: group.name })}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#5EA2EF' }]}>
            <Ionicons name="chatbubble-outline" size={22} color="white" />
          </View>
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ReceiptScan', { groupId })}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="receipt-outline" size={22} color="white" />
          </View>
          <Text style={styles.actionText}>Add Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('GroupSettings', { 
            id: groupId, 
            name: group.name,
            isAdmin: group.admins?.includes(user.id) || group.createdBy === user.id
          })}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="settings-outline" size={22} color="white" />
          </View>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5EA2EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupAvatarText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  balanceContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 8,
  },
  balanceTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  owedAmount: {
    color: '#FF3B30',
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#FF3B30',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#5EA2EF',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIcon: {
    backgroundColor: '#5EA2EF',
  },
  paymentIcon: {
    backgroundColor: '#4CAF50',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default GroupOverviewScreen;