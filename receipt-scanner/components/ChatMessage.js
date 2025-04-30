import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

const ChatMessage = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { friends } = useContext(DataContext);
  const navigation = useNavigation();
  const [showTimestamp, setShowTimestamp] = useState(false);
  
  const isOwnMessage = message.senderId === user.id;
  const isBillMessage = message.text && message.text.startsWith('💰');
  
  // Find the sender
  const getSender = () => {
    if (isOwnMessage) return { id: user.id, name: 'You', avatar: user.avatar };
    
    const sender = friends.find(friend => friend.id === message.senderId);
    return sender || { id: message.senderId, name: 'Unknown User', avatar: null };
  };
  
  const sender = getSender();
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date in a more readable way
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Same day
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${formatTime(timestamp)}`;
    }
    // Yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${formatTime(timestamp)}`;
    }
    // Other days
    else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        ` at ${formatTime(timestamp)}`;
    }
  };
  
  // Toggle timestamp visibility
  const toggleTimestamp = () => {
    setShowTimestamp(!showTimestamp);
  };

  if (isBillMessage) {
    // Extract bill amount if it exists in the message format
    // Format should be like "💰 Bill: $25.00 for dinner"
    const billAmountMatch = message.text.match(/\$(\d+(\.\d{1,2})?)/);
    const billAmount = billAmountMatch ? billAmountMatch[1] : null;
    
    // Parse the bill description (everything after "for")
    const billDescMatch = message.text.match(/for\s+(.+)/i);
    const billDescription = billDescMatch ? billDescMatch[1] : 'shared expense';
    
    const handlePayWithStripe = () => {
      // Navigate to payment screen with bill details
      if (billAmount) {
        navigation.navigate('PaymentScreen', {
          amount: parseFloat(billAmount),
          description: billDescription,
          billId: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId
        });
      } else {
        alert('Could not determine bill amount. Please contact the bill creator.');
      }
    };
    
    // Render a special bill message
    return (
      <View style={styles.billContainer}>
        <View style={styles.billMessage}>
          <Text style={styles.billMessageText}>{message.text}</Text>
          <TouchableOpacity 
            style={styles.billActionButton}
            onPress={handlePayWithStripe}
          >
            <Text style={styles.billActionButtonText}>Pay with Stripe</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.billTimestamp}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}
      onPress={toggleTimestamp}
      activeOpacity={0.8}
    >
      {!isOwnMessage && (
        <Image 
          source={{ uri: sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sender.name)}` }}
          style={styles.avatar}
        />
      )}
      
      <View style={styles.messageContent}>
        {!isOwnMessage && (
          <Text style={styles.senderName}>{sender.name}</Text>
        )}
        
        <View style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {message.text}
          </Text>
        </View>
        
        {showTimestamp && (
          <Text style={styles.timestampFull}>{formatDate(message.timestamp)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  ownBubble: {
    backgroundColor: '#5EA2EF',
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#222',
  },
  timestampFull: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    marginLeft: 2,
  },
  billContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 10,
    alignItems: 'center',
  },
  billMessage: {
    backgroundColor: '#E9F7FF',
    borderWidth: 1,
    borderColor: '#BDE0FD',
    borderRadius: 8,
    padding: 12,
    width: '90%',
  },
  billMessageText: {
    fontSize: 15,
    color: '#0072CE',
    textAlign: 'center',
    marginBottom: 8,
  },
  billActionButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 8,
  },
  billActionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  billTimestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
});

export default ChatMessage;
