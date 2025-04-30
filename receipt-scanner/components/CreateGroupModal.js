import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const CreateGroupModal = ({ visible, onClose, onCreateGroup, friends = [], currentUserId }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setGroupName('');
    setSelectedFriends({});
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => ({
      ...prev,
      [friendId]: !prev[friendId]
    }));
  };

  const handleCreateGroup = async () => {
    // Basic validation
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    const selectedFriendIds = Object.keys(selectedFriends).filter(id => selectedFriends[id]);
    if (selectedFriendIds.length === 0) {
      setError('Please select at least one friend');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create the group
      const newGroup = {
        id: Date.now().toString(),
        name: groupName.trim(),
        members: [
          ...selectedFriendIds.map(id => {
            const friend = friends.find(f => f.id === id);
            return {
              id: friend.id,
              name: friend.name
            };
          }),
          {
            id: currentUserId,
            name: 'You'
          }
        ],
        expenses: [],
        createdAt: new Date().toISOString(),
        currentUserId // For convenience to identify current user
      };
      
      onCreateGroup(newGroup);
      resetForm();
      onClose();
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error creating group:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={24} color="#888888" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Group Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Friends</Text>
              {friends.length > 0 ? (
                friends.map(friend => (
                  <View key={friend.id} style={styles.friendRow}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Switch
                      value={!!selectedFriends[friend.id]}
                      onValueChange={() => toggleFriendSelection(friend.id)}
                      trackColor={{ false: '#CCCCCC', true: '#5B37B7' }}
                      thumbColor={selectedFriends[friend.id] ? '#FFFFFF' : '#F4F3F4'}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  No friends yet. Add friends first to create a group.
                </Text>
              )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.createButton,
                (friends.length === 0) && styles.disabledButton
              ]}
              onPress={handleCreateGroup}
              disabled={isLoading || friends.length === 0}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.createButtonText}>Create Group</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  formContainer: {
    flex: 1,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
  },
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  friendName: {
    fontSize: 16,
    color: '#333333',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 16,
    fontSize: 14,
  },
  buttonContainer: {
    paddingTop: 16,
  },
  createButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroupModal;
