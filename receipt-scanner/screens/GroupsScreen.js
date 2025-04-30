import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import GroupItem from '../components/GroupItem';

const GroupsScreen = ({ navigation }) => {
  const { groups, addGroup } = useContext(DataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    const result = await addGroup({
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      members: ['1'], // Add current user as first member
    });
    
    if (result.success) {
      setModalVisible(false);
      setNewGroupName('');
      setNewGroupDescription('');
    } else {
      Alert.alert('Error', result.error || 'Failed to create group');
    }
  };

  const renderGroup = ({ item }) => (
    <GroupItem 
      group={item} 
      onPress={(group) => navigation.navigate('GroupDetail', { 
        id: group.id,
        name: group.name
      })}
    />
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Group</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.input}
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="Enter group name"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newGroupDescription}
                onChangeText={setNewGroupDescription}
                placeholder="What's this group for?"
                multiline={true}
                numberOfLines={3}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleAddGroup}
            >
              <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#DADADA" />
            <Text style={styles.emptyText}>No groups yet</Text>
            <Text style={styles.emptySubtext}>
              Create a group to start splitting bills with friends
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
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
  listContainer: {
    padding: 15,
    paddingBottom: 80, // Extra padding at bottom for FAB
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupsScreen;
