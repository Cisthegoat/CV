import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

import ActivityItem from '../components/ActivityItem';
import PendingBillItem from '../components/PendingBillItem';
import ExpenseChart from '../components/ExpenseChart';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { 
    activities, 
    pendingBills, 
    groups, 
    loading, 
  } = useContext(DataContext);
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, we would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Calculate total owed and owing
  const calculateBalances = () => {
    let totalOwed = 0;
    let totalOwing = 0;

    pendingBills.forEach(bill => {
      if (bill.paidBy === user.id) {
        // You paid, others owe you
        const splitAmount = bill.amount / bill.owedBy.length;
        totalOwed += splitAmount * bill.owedBy.length;
      } else if (bill.owedBy.includes(user.id)) {
        // You owe someone
        const splitAmount = bill.amount / bill.owedBy.length;
        totalOwing += splitAmount;
      }
    });

    return { totalOwed, totalOwing };
  };

  const { totalOwed, totalOwing } = calculateBalances();
  const netBalance = totalOwed - totalOwing;

  // Get bills where user owes money
  const userPendingBills = pendingBills.filter(bill => 
    bill.owedBy.includes(user.id) || bill.paidBy === user.id
  ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#5EA2EF']}
        />
      }
    >
      {/* Balance Summary */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>Your Balance</Text>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                "Your Balance Explained",
                "This shows the difference between what people owe you and what you owe others. A positive number means you're owed more than you owe.",
                [{ text: "Got it" }]
              );
            }}
          >
            <Ionicons name="help-circle-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text style={[
          styles.netBalance,
          netBalance >= 0 ? styles.positiveBalance : styles.negativeBalance
        ]}>
          {netBalance >= 0 ? '+' : ''} ${netBalance.toFixed(2)}
        </Text>
        
        <View style={styles.detailBalanceRow}>
          <View style={styles.detailBalance}>
            <Text style={styles.detailBalanceLabel}>You are owed</Text>
            <Text style={styles.positiveBalance}>${totalOwed.toFixed(2)}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailBalance}>
            <Text style={styles.detailBalanceLabel}>You owe</Text>
            <Text style={styles.negativeBalance}>${totalOwing.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Spending Chart */}
      {pendingBills.length > 0 && (
        <ExpenseChart />
      )}
      
      {/* Pending Bills */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Bills</Text>
          {userPendingBills.length > 0 && (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {userPendingBills.length > 0 ? (
          userPendingBills.slice(0, 3).map(bill => (
            <PendingBillItem 
              key={bill.id} 
              bill={bill} 
              onPress={() => navigation.navigate('GroupDetail', { 
                id: bill.groupId,
                name: groups.find(g => g.id === bill.groupId)?.name
              })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#DADADA" />
            <Text style={styles.emptyStateText}>No pending bills</Text>
          </View>
        )}
      </View>
      
      {/* Recent Activity */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.length > 0 && (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {activities.length > 0 ? (
          activities.slice(0, 5).map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#DADADA" />
            <Text style={styles.emptyStateText}>No recent activity</Text>
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
    padding: 15,
  },
  balanceContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  netBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#F44336',
  },
  detailBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailBalance: {
    flex: 1,
  },
  detailBalanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  separator: {
    width: 1,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 12,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#5EA2EF',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#8E8E93',
    fontSize: 16,
  },
  footer: {
    height: 50,
  }
});

export default HomeScreen;
