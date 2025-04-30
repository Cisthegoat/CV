import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import {
  generateInitialGroups,
  generateInitialFriends,
  generateInitialMessages,
  generateInitialActivities,
  generateInitialPendingBills
} from '../utils/mockData';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState({});
  const [activities, setActivities] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Load data from AsyncStorage
      const storedGroups = await AsyncStorage.getItem('groups');
      const storedFriends = await AsyncStorage.getItem('friends');
      const storedMessages = await AsyncStorage.getItem('messages');
      const storedActivities = await AsyncStorage.getItem('activities');
      const storedPendingBills = await AsyncStorage.getItem('pendingBills');

      // Initialize with enhanced mock data if nothing exists
      if (storedGroups) setGroups(JSON.parse(storedGroups));
      else {
        const initialGroups = generateInitialGroups(user.id);
        setGroups(initialGroups);
        await AsyncStorage.setItem('groups', JSON.stringify(initialGroups));
      }

      if (storedFriends) setFriends(JSON.parse(storedFriends));
      else {
        const initialFriends = generateInitialFriends();
        setFriends(initialFriends);
        await AsyncStorage.setItem('friends', JSON.stringify(initialFriends));
      }

      if (storedMessages) setMessages(JSON.parse(storedMessages));
      else {
        const initialMessages = generateInitialMessages(user.id);
        setMessages(initialMessages);
        await AsyncStorage.setItem('messages', JSON.stringify(initialMessages));
      }

      if (storedActivities) setActivities(JSON.parse(storedActivities));
      else {
        const initialActivities = generateInitialActivities(user.id);
        setActivities(initialActivities);
        await AsyncStorage.setItem('activities', JSON.stringify(initialActivities));
      }

      if (storedPendingBills) setPendingBills(JSON.parse(storedPendingBills));
      else {
        const initialPendingBills = generateInitialPendingBills(user.id);
        setPendingBills(initialPendingBills);
        await AsyncStorage.setItem('pendingBills', JSON.stringify(initialPendingBills));
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (newFriend) => {
    try {
      const updatedFriends = [...friends, { ...newFriend, id: Date.now().toString() }];
      setFriends(updatedFriends);
      await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
      return { success: true };
    } catch (error) {
      console.log('Error adding friend:', error);
      return { success: false, error: 'Failed to add friend' };
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const updatedFriends = friends.filter(friend => friend.id !== friendId);
      setFriends(updatedFriends);
      await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
      return { success: true };
    } catch (error) {
      console.log('Error removing friend:', error);
      return { success: false, error: 'Failed to remove friend' };
    }
  };

  const addGroup = async (newGroup) => {
    try {
      const groupId = Date.now().toString();
      const updatedGroups = [...groups, { 
        ...newGroup, 
        id: groupId, 
        totalExpenses: 0,
        createdBy: user.id,
        admins: [user.id]
      }];
      setGroups(updatedGroups);
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      
      // Initialize empty message list for the new group
      const updatedMessages = { ...messages, [groupId]: [] };
      setMessages(updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      
      return { success: true, groupId };
    } catch (error) {
      console.log('Error adding group:', error);
      return { success: false, error: 'Failed to add group' };
    }
  };

  const updateGroup = async (groupId, updatedGroupData) => {
    try {
      const updatedGroups = groups.map(group => {
        if (group.id === groupId) {
          return { ...group, ...updatedGroupData };
        }
        return group;
      });
      
      setGroups(updatedGroups);
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      return { success: true };
    } catch (error) {
      console.log('Error updating group:', error);
      return { success: false, error: 'Failed to update group' };
    }
  };

  const startConversation = async (conversationId) => {
    try {
      if (!messages[conversationId]) {
        const updatedMessages = { 
          ...messages, 
          [conversationId]: [] 
        };
        setMessages(updatedMessages);
        await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      }
      return { success: true };
    } catch (error) {
      console.log('Error starting conversation:', error);
      return { success: false, error: 'Failed to start conversation' };
    }
  };

  const sendMessage = async (conversationId, messageText, options = {}) => {
    try {
      const newMessage = {
        id: Date.now().toString(),
        senderId: options.isSystemMessage ? 'system' : user.id,
        text: messageText,
        timestamp: new Date().toISOString(),
        isSystemMessage: options.isSystemMessage || false,
        ...options
      };
      
      const conversationMessages = messages[conversationId] || [];
      const updatedConversationMessages = [...conversationMessages, newMessage];
      const updatedMessages = { ...messages, [conversationId]: updatedConversationMessages };
      
      setMessages(updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      return { success: true, messageId: newMessage.id };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  };

  const addExpense = async (conversationId, expense) => {
    try {
      // Update pending bills
      const newBill = {
        id: Date.now().toString(),
        ...expense,
        timestamp: new Date().toISOString(),
        dueDate: new Date(Date.now() + 604800000).toISOString(), // Due in a week
        groupId: conversationId,
        status: 'pending'
      };
      
      const updatedPendingBills = [...pendingBills, newBill];
      setPendingBills(updatedPendingBills);
      await AsyncStorage.setItem('pendingBills', JSON.stringify(updatedPendingBills));
      
      // Update group total expenses if this is a group conversation
      const targetGroup = groups.find(g => g.id === conversationId);
      if (targetGroup) {
        const updatedGroups = groups.map(group => {
          if (group.id === conversationId) {
            return {
              ...group,
              totalExpenses: group.totalExpenses + parseFloat(expense.amount),
            };
          }
          return group;
        });
        
        setGroups(updatedGroups);
        await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      }
      
      // Add activity
      const newActivity = {
        id: Date.now().toString(),
        type: 'expense',
        description: `${user.name} added $${expense.amount} for ${expense.description}`,
        timestamp: new Date().toISOString(),
        groupId: conversationId,
      };
      
      const updatedActivities = [newActivity, ...activities];
      setActivities(updatedActivities);
      await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
      
      return { success: true, billId: newBill.id };
    } catch (error) {
      console.log('Error adding expense:', error);
      return { success: false, error: 'Failed to add expense' };
    }
  };

  const updateBillStatus = async (billId, status) => {
    try {
      // Update the bill status
      const updatedPendingBills = pendingBills.map(bill => {
        if (bill.id === billId) {
          return {
            ...bill,
            status: status,
            paidDate: status === 'paid' ? new Date().toISOString() : undefined,
          };
        }
        return bill;
      });
      
      setPendingBills(updatedPendingBills);
      await AsyncStorage.setItem('pendingBills', JSON.stringify(updatedPendingBills));
      
      // Add an activity for the paid bill
      if (status === 'paid') {
        const paidBill = updatedPendingBills.find(bill => bill.id === billId);
        if (paidBill) {
          const newActivity = {
            id: Date.now().toString(),
            type: 'payment',
            description: `${user.name} paid $${paidBill.amount} for ${paidBill.description}`,
            timestamp: new Date().toISOString(),
            groupId: paidBill.groupId,
          };
          
          const updatedActivities = [newActivity, ...activities];
          setActivities(updatedActivities);
          await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
          
          // Add a system message about the payment
          await sendMessage(
            paidBill.groupId,
            `💵 ${user.name} has paid $${paidBill.amount} for ${paidBill.description}`,
            { isSystemMessage: true }
          );
        }
      }
      
      return { success: true };
    } catch (error) {
      console.log('Error updating bill status:', error);
      return { success: false, error: 'Failed to update bill status' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        groups,
        friends,
        messages,
        activities,
        pendingBills,
        loading,
        addFriend,
        removeFriend,
        addGroup,
        updateGroup,
        startConversation,
        sendMessage,
        addExpense,
        updateBillStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
