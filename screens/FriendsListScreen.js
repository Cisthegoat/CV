import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import FriendItem from '../components/FriendItem';

const FriendsListScreen = ({ navigation }) => {
  const { friends, addFriend, removeFriend, startConversation } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // 'all', 'recent'
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  // Filter friends based on search query and filter option
  const filteredFriends = friends
    .filter(friend => {
      // Apply search filter
      const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (friend.email && friend.email.toLowerCase().includes(searchQuery.toLowerCase()));
        
      // Apply tab filter
      if (filterOption === 'all') return matchesSearch;
      if (filterOption === 'recent') {
        // This would use a "recent" flag that isn't implemented in this demo
        // For now, just show random ones as "recent"
        return matchesSearch && friend.id.charAt(0) < '3';
      }
      
      return matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  
  const handleFriendPress = (friend) => {
    setSelectedFriend(friend);
    setShowFriendMenu(true);
  };
  
  const handleStartConversation = () => {
    setShowFriendMenu(false);
    if (!selectedFriend) return;
    
    // Create a direct message conversation ID
    const conversationId = [user.id, selectedFriend.id].sort().join('-');
    
    // Call API to start conversation if needed
    startConversation(conversationId);
    
    // Navigate to chat
    navigation.navigate('Chat', { 
      id: conversationId,
      name: selectedFriend.name,
      isGroup: false
    });
  };
  
  const handleRemoveFriend = () => {
    if (!selectedFriend) return;
    
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${selectedFriend.name} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setShowFriendMenu(false) },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await removeFriend(selectedFriend.id);
              setShowFriendMenu(false);
              Alert.alert('Success', `${selectedFriend.name} has been removed from your friends.`);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove friend.');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity 
          style={styles.addFriendButton}
          onPress={() => navigation.navigate('AddFriend')}
        >
          <Ionicons name="person-add" size={20} color="#5EA2EF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search friends"
          clearButtonMode="while-editing"
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterOption, filterOption === 'all' && styles.activeFilterOption]}
          onPress={() => setFilterOption('all')}
        >
          <Text style={[styles.filterText, filterOption === 'all' && styles.activeFilterText]}>
            All Friends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterOption, filterOption === 'recent' && styles.activeFilterOption]}
          onPress={() => setFilterOption('recent')}
        >
          <Text style={[styles.filterText, filterOption === 'recent' && styles.activeFilterText]}>
            Recent
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredFriends}
        renderItem={({ item }) => 
          <FriendItem 
            friend={item} 
            onPress={() => handleFriendPress(item)}
            showActionButton
            actionIcon="chatbubble-outline"
            onActionPress={() => {
              setSelectedFriend(item);
              handleStartConversation();
            }}
          />
        }
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {searchQuery ? (
              <>
                <Ionicons name="search-outline" size={50} color="#DADADA" />
                <Text style={styles.emptyText}>No matching friends found</Text>
                <Text style={styles.emptySubtext}>
                  Try a different search term
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="people-outline" size={50} color="#DADADA" />
                <Text style={styles.emptyText}>No friends yet</Text>
                <Text style={styles.emptySubtext}>
                  Add friends to start splitting bills together
                </Text>
                
                <TouchableOpacity 
                  style={styles.emptyAddButton}
                  onPress={() => navigation.navigate('AddFriend')}
                >
                  <Text style={styles.emptyAddButtonText}>Add New Friend</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />
      
      {/* Friend Action Menu Modal */}
      <Modal
        visible={showFriendMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFriendMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFriendMenu(false)}
        >
          <View style={styles.modalContainer}>
            {selectedFriend && (
              <>
                <View style={styles.friendHeader}>
                  <Image 
                    source={{ uri: selectedFriend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFriend.name)}` }}
                    style={styles.friendAvatar}
                  />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{selectedFriend.name}</Text>
                    {selectedFriend.email && (
                      <Text style={styles.friendEmail}>{selectedFriend.email}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleStartConversation}
                  >
                    <View style={styles.actionIconContainer}>
                      <Ionicons name="chatbubble-outline" size={24} color="#5EA2EF" />
                    </View>
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setShowFriendMenu(false);
                      Alert.alert('Feature Coming Soon', 'Settling balances will be available in a future update.');
                    }}
                  >
                    <View style={styles.actionIconContainer}>
                      <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.actionText}>Settle Up</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleRemoveFriend}
                  >
                    <View style={[styles.actionIconContainer, { backgroundColor: '#FFEBEE' }]}>
                      <Ionicons name="person-remove-outline" size={24} color="#F44336" />
                    </View>
                    <Text style={[styles.actionText, { color: '#F44336' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowFriendMenu(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFriend')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addFriendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
    padding: 2,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterOption: {
    backgroundColor: 'white',
  },
  filterText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeFilterText: {
    color: '#5EA2EF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80, // Extra padding for FAB
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
    marginBottom: 20,
  },
  emptyAddButton: {
    backgroundColor: '#5EA2EF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emptyAddButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5EA2EF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#5EA2EF',
    fontWeight: '500',
  },
});

export default FriendsListScreen;
