import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const MessageItem = ({ conversation, onPress }) => {
  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Today's date
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Within the last week
    const dayDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    if (dayDiff < 7) {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    }
    
    // Older messages
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(conversation)}
    >
      <View style={styles.avatarContainer}>
        {conversation.avatar ? (
          <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{conversation.name.substring(0, 1)}</Text>
          </View>
        )}
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name} numberOfLines={1}>{conversation.name}</Text>
          <Text style={styles.time}>{formatTime(conversation.lastMessageTime)}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={[
            styles.message,
            conversation.unreadCount > 0 && styles.unreadMessage
          ]} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          <Feather name="chevron-right" size={16} color="#CCCCCC" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    backgroundColor: '#5B37B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#999999',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333333',
  },
});

export default MessageItem;
