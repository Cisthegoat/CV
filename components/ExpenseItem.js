import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ExpenseItem = ({ expense, currentUserId, onPress }) => {
  // Determine if the current user is the payer
  const isPayer = expense.paidBy === currentUserId;
  
  // Determine if this user has settled this expense
  const isSettled = expense.settledBy.includes(currentUserId);
  
  // Calculate amount per person
  const amountPerPerson = expense.amount / expense.splitBetween.length;
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(expense)}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Feather 
            name={expense.category === 'food' ? 'coffee' : 
                expense.category === 'transport' ? 'navigation' : 
                expense.category === 'entertainment' ? 'film' : 
                expense.category === 'utilities' ? 'home' : 'dollar-sign'} 
            size={20} 
            color="#FFFFFF" 
          />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{expense.description}</Text>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.payerInfo}>
            {isPayer ? 'You paid' : `${expense.payerName} paid`}
          </Text>
          
          <View style={styles.amountContainer}>
            <Text style={[
              styles.amount,
              isPayer ? styles.amountPositive : (isSettled ? styles.amountSettled : styles.amountNegative)
            ]}>
              {isPayer ? '+' : (isSettled ? '✓' : '-')}${amountPerPerson.toFixed(2)}
            </Text>
          </View>
        </View>
        
        {!isSettled && !isPayer && (
          <View style={styles.settleContainer}>
            <Text style={styles.settleText}>Not settled</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B37B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  date: {
    fontSize: 12,
    color: '#999999',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  payerInfo: {
    fontSize: 14,
    color: '#666666',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountPositive: {
    color: '#27AE60',
  },
  amountNegative: {
    color: '#E74C3C',
  },
  amountSettled: {
    color: '#3498DB',
  },
  settleContainer: {
    marginTop: 4,
  },
  settleText: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '500',
  },
});

export default ExpenseItem;
