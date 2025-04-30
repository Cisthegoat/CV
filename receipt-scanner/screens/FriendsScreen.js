import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import FriendItem from '../components/FriendItem';
import AddFriendModal from '../components/AddFriendModal';
import { DataContext } from '../context/DataContext';

const FriendsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const { friends, fetchFriends, addFriend } = useContext(DataContext);

  useEffect(() => {
    const loadFriends = async () => {
      setIsLoading(true);
      try {
        await fetchFriends();
      } catch (error) {
        console.error('Failed to load friends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFriends();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFriends();
    } catch (error) {
      console.error('Failed to refresh friends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddFriend = (newFriend) => {
    addFriend(newFriend);
  };

  const handleFriendPress = (friend) => {
    // Navigate to friend details or show options
    console.log('Friend pressed:', friend.id);
  };

  // Filter friends based on search text
  const filteredFriends = searchText.trim() 
    ? friends.filter(friend => 
        friend.name.toLowerCase().includes(searchText.toLowerCase()) ||
        friend.email?.toLowerCase().includes(searchText.toLowerCase())
      )
    : friends;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Feather name="user-plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#888888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Feather name="x" size={20} color="#888888" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#5B37B7" />
        </View>
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendItem
              friend={item}
              onPress={handleFriendPress}
              showBalance={true}
            />
          )}
          ListEmptyComponent={
            searchText ? (
              <View style={styles.emptySearchContainer}>
                <Feather name="search" size={50} color="#CCCCCC" />
                <Text style={styles.emptySearchText}>No results found for "{searchText}"</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="users" size={60} color="#CCCCCC" />
                <Text style={styles.emptyText}>No friends yet</Text>
                <Text style={styles.emptySubText}>
                  Add friends to start splitting expenses together
                </Text>
                <TouchableOpacity 
                  style={styles.emptyAddButton}
                  onPress={() => setAddModalVisible(true)}
                >
                  <Text style={styles.emptyAddButtonText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5B37B7']}
            />
          }
        />
      )}
      
      <AddFriendModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddFriend={handleAddFriend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B37B7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 6,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: '#5B37B7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptySearchText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default FriendsScreen;
