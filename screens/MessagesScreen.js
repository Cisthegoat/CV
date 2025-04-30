import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import CreateGroupModal from '../components/CreateGroupModal';

const MessagesScreen = ({ navigation }) => {
  const { groups, messages, friends } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'direct', 'groups'
  
  // Get direct message conversations (non-group)
  const directConversations = Object.entries(messages)
    .filter(([id, _]) => !groups.some(group => group.id === id))
    .map(([id, messageList]) => {
      if (!messageList || messageList.length === 0) return null;
      
      // Get the other person's details for direct messages
      const friendId = id.split('-').find(partId => partId !== user.id);
      const friend = friends.find(f => f.id === friendId);
      
      const lastMessage = messageList[messageList.length - 1];
      // Find sender of last message
      let senderName = 'Unknown';
      if (lastMessage) {
        if (lastMessage.senderId === user.id) {
          senderName = 'You';
        } else {
          const sender = friends.find(f => f.id === lastMessage.senderId);
          senderName = sender ? sender.name : 'Unknown';
        }
      }
      
      return {
        id,
        type: 'direct',
        name: friend ? friend.name : `Unknown (${friendId})`,
        avatar: friend ? friend.avatar : null,
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          sender: senderName,
          timestamp: lastMessage.timestamp
        } : null,
        unreadCount: Math.floor(Math.random() * 3) // Mock unread count
      };
    }).filter(Boolean);
  
  // Convert groups into the same format
  const groupConversations = groups.map(group => {
    const groupMessages = messages[group.id] || [];
    const lastMessage = groupMessages.length > 0 
      ? groupMessages[groupMessages.length - 1] 
      : null;
    
    // Find sender of last message
    let senderName = 'Unknown';
    if (lastMessage) {
      if (lastMessage.senderId === user.id) {
        senderName = 'You';
      } else {
        const sender = friends.find(f => f.id === lastMessage.senderId);
        senderName = sender ? sender.name : 'Unknown';
      }
    }
    
    return {
      id: group.id,
      type: 'group',
      name: group.name,
      avatar: group.avatar,
      lastMessage: lastMessage ? {
        text: lastMessage.text,
        sender: senderName,
        timestamp: lastMessage.timestamp
      } : null,
      members: group.members,
      unreadCount: Math.floor(Math.random() * 3), // Mock unread count
      isAdmin: group.createdBy === user.id || (group.admins && group.admins.includes(user.id))
    };
  });
  
  // Combine both types of conversations
  const allConversations = [...directConversations, ...groupConversations];
  
  // Filter conversations based on search query and active tab
  const filteredConversations = allConversations
    .filter(convo => {
      // Filter by search query
      const matchesSearch = convo.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by tab
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'direct') return matchesSearch && convo.type === 'direct';
      if (activeTab === 'groups') return matchesSearch && convo.type === 'group';
      
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by most recent message
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
  
  // Format timestamp to relative time or time
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffMs = now - messageDate;
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[messageDate.getDay()];
    } else {
      // More than a week ago - show date
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleCreateGroup = () => {
    setCreateGroupModalVisible(true);
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Chat', { 
        id: item.id, 
        name: item.name,
        isGroup: item.type === 'group',
        members: item.members,
        isAdmin: item.isAdmin
      })}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[
            styles.avatar, 
            { 
              backgroundColor: item.type === 'group' ? '#5EA2EF' : '#4CAF50',
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
        )}
        {item.unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name}
            {item.type === 'group' && item.isAdmin && ' (Admin)'}
          </Text>
          <Text style={styles.conversationTime}>
            {item.lastMessage ? formatTimestamp(item.lastMessage.timestamp) : ''}
          </Text>
        </View>
        
        <View style={styles.messagePreview}>
          {item.lastMessage ? (
            <>
              <Text style={styles.messagePreviewSender} numberOfLines={1}>
                {item.lastMessage.sender}:
              </Text>
              <Text style={styles.messagePreviewText} numberOfLines={1}>
                {' ' + item.lastMessage.text}
              </Text>
            </>
          ) : (
            <Text style={styles.noMessages}>No messages yet</Text>
          )}
        </View>
      </View>
      
      {item.type === 'group' && (
        <TouchableOpacity 
          style={styles.optionsButton}
          onPress={() => navigation.navigate('GroupOverview', { id: item.id, name: item.name })}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#8E8E93" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Messages header removed as requested */}
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'direct' && styles.activeTab]}
          onPress={() => setActiveTab('direct')}
        >
          <Text style={[styles.tabText, activeTab === 'direct' && styles.activeTabText]}>Direct</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredConversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={activeTab === 'groups' ? "people-outline" : "chatbubble-ellipses-outline"} 
              size={60} 
              color="#DADADA" 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'groups' 
                ? 'No group conversations' 
                : activeTab === 'direct' 
                  ? 'No direct messages' 
                  : 'No conversations yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'groups' 
                ? 'Create a new group to start chatting' 
                : 'Messages from your conversations will appear here'}
            </Text>
            
            {activeTab === 'groups' && (
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.emptyActionButtonText}>Create a Group</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      
      <CreateGroupModal 
        visible={isCreateGroupModalVisible}
        onClose={() => setCreateGroupModalVisible(false)}
      />
      
      <TouchableOpacity 
        style={styles.createGroupFAB}
        onPress={handleCreateGroup}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    margin: 15, 
    marginTop: 60, // Add extra margin at top since header is removed
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#5EA2EF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5EA2EF',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  badgeContainer: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreviewSender: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  messagePreviewText: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  noMessages: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#8E8E93',
  },
  optionsButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    marginBottom: 16,
  },
  emptyActionButton: {
    backgroundColor: '#5EA2EF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emptyActionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  createGroupFAB: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5EA2EF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MessagesScreen;
