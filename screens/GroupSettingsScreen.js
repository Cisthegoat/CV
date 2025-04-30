import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

const GroupSettingsScreen = ({ route, navigation }) => {
  const { id: groupId, isAdmin = false } = route.params || {};
  const { groups, friends, updateGroup, sendMessage } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [editGroupNameModal, setEditGroupNameModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [nonMembers, setNonMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  useEffect(() => {
    // Find the group
    const currentGroup = groups.find(g => g.id === groupId);
    if (currentGroup) {
      setGroup(currentGroup);
      setNewGroupName(currentGroup.name);
      
      // Get member details
      const memberDetails = currentGroup.members.map(memberId => {
        if (memberId === user.id) {
          return { 
            id: user.id, 
            name: 'You',
            isAdmin: currentGroup.admins?.includes(user.id) || currentGroup.createdBy === user.id
          };
        }
        const friend = friends.find(f => f.id === memberId);
        return { 
          id: memberId, 
          name: friend ? friend.name : 'Unknown User',
          avatar: friend ? friend.avatar : null,
          isAdmin: currentGroup.admins?.includes(memberId) || currentGroup.createdBy === memberId
        };
      });
      
      setMembers(memberDetails);
      
      // Find friends who are not members
      const nonMemberFriends = friends.filter(
        friend => !currentGroup.members.includes(friend.id)
      );
      setNonMembers(nonMemberFriends);
    }
  }, [groupId, groups, friends, user.id]);
  
  const userIsAdmin = group?.admins?.includes(user.id) || group?.createdBy === user.id;
  
  const handleSaveGroupName = async () => {
    if (!newGroupName.trim() || !group) return;
    
    try {
      const updatedGroup = { ...group, name: newGroupName.trim() };
      await updateGroup(groupId, updatedGroup);
      
      // Send system message about the name change
      await sendMessage(
        groupId,
        `Group name has been changed to "${newGroupName.trim()}"`,
        { isSystemMessage: true }
      );
      
      setEditGroupNameModal(false);
      
      // Update navigation title
      navigation.setParams({ name: newGroupName.trim() });
      
      // Update local state
      setGroup(updatedGroup);
    } catch (error) {
      Alert.alert('Error', 'Failed to update group name.');
      console.error(error);
    }
  };
  
  const handleToggleAdmin = async (memberId) => {
    if (!userIsAdmin || !group) return;
    
    try {
      // Check if the member is already an admin
      const isCurrentlyAdmin = group.admins?.includes(memberId);
      
      // Update the admins list
      let updatedAdmins = group.admins || [];
      if (isCurrentlyAdmin) {
        // Remove admin status
        updatedAdmins = updatedAdmins.filter(id => id !== memberId);
      } else {
        // Add admin status
        updatedAdmins = [...updatedAdmins, memberId];
      }
      
      // Find the member name for the system message
      const member = members.find(m => m.id === memberId);
      const memberName = member ? member.name : 'Unknown User';
      const displayName = memberName === 'You' ? 'You are' : `${memberName} is`;
      
      // Update the group
      const updatedGroup = { ...group, admins: updatedAdmins };
      await updateGroup(group.id, updatedGroup);
      
      // Add a system message about the admin status change
      await sendMessage(
        groupId, 
        `${displayName} ${isCurrentlyAdmin ? 'no longer' : 'now'} an admin`,
        { isSystemMessage: true }
      );
      
      // Update local state
      setGroup(updatedGroup);
      
      // Update members list with new admin status
      setMembers(members.map(member => {
        if (member.id === memberId) {
          return { ...member, isAdmin: !isCurrentlyAdmin };
        }
        return member;
      }));
      
      Alert.alert(
        'Success',
        `${memberName} is ${isCurrentlyAdmin ? 'no longer' : 'now'} an admin.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update admin status.');
      console.error(error);
    }
  };
  
  const handleRemoveMember = async (memberId) => {
    if (!userIsAdmin || !group) return;
    
    // Don't allow removing yourself this way
    if (memberId === user.id) {
      Alert.alert(
        'Cannot Remove Yourself',
        'To leave the group, use the "Leave Group" option from the menu.'
      );
      return;
    }
    
    try {
      // Find the member name
      const member = members.find(m => m.id === memberId);
      const memberName = member ? member.name : 'Unknown User';
      
      // Remove the member
      const updatedMembers = group.members.filter(id => id !== memberId);
      
      // If they were an admin, remove from admins too
      let updatedAdmins = group.admins || [];
      if (updatedAdmins.includes(memberId)) {
        updatedAdmins = updatedAdmins.filter(id => id !== memberId);
      }
      
      // Update the group
      const updatedGroup = { 
        ...group, 
        members: updatedMembers,
        admins: updatedAdmins
      };
      
      await updateGroup(group.id, updatedGroup);
      
      // Add a system message
      await sendMessage(
        groupId,
        `${memberName} has been removed from the group`,
        { isSystemMessage: true }
      );
      
      // Update local state
      setGroup(updatedGroup);
      setMembers(members.filter(m => m.id !== memberId));
      
      // Add back to non-members list
      const removedMember = friends.find(f => f.id === memberId);
      if (removedMember) {
        setNonMembers([...nonMembers, removedMember]);
      }
      
      Alert.alert('Success', `${memberName} has been removed from the group.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove member.');
      console.error(error);
    }
  };
  
  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      setAddMemberModal(false);
      return;
    }
    
    try {
      // Add the selected members to the group
      const updatedMembers = [...group.members, ...selectedMembers];
      
      // Update the group
      const updatedGroup = { ...group, members: updatedMembers };
      await updateGroup(group.id, updatedGroup);
      
      // Find member names for system message
      const memberNames = selectedMembers.map(id => {
        const friend = friends.find(f => f.id === id);
        return friend ? friend.name : 'Unknown User';
      });
      
      // Format names for message
      let namesText;
      if (memberNames.length === 1) {
        namesText = memberNames[0];
      } else if (memberNames.length === 2) {
        namesText = `${memberNames[0]} and ${memberNames[1]}`;
      } else {
        const lastMember = memberNames.pop();
        namesText = `${memberNames.join(', ')}, and ${lastMember}`;
      }
      
      // Add a system message
      await sendMessage(
        groupId,
        `${namesText} ${memberNames.length > 1 ? 'have' : 'has'} been added to the group`,
        { isSystemMessage: true }
      );
      
      // Update local state
      setGroup(updatedGroup);
      
      // Add new members to the members list
      const newMemberDetails = selectedMembers.map(id => {
        const friend = friends.find(f => f.id === id);
        return { 
          id, 
          name: friend ? friend.name : 'Unknown User',
          avatar: friend ? friend.avatar : null,
          isAdmin: false
        };
      });
      
      setMembers([...members, ...newMemberDetails]);
      
      // Remove added members from non-members list
      setNonMembers(nonMembers.filter(friend => !selectedMembers.includes(friend.id)));
      
      // Reset selected members
      setSelectedMembers([]);
      setAddMemberModal(false);
      
      Alert.alert('Success', 'Members added to the group.');
    } catch (error) {
      Alert.alert('Error', 'Failed to add members.');
      console.error(error);
    }
  };
  
  const handleLeaveGroup = async () => {
    if (!group) return;
    
    // If you're the only member, we should delete the group instead
    if (group.members.length === 1) {
      Alert.alert(
        'Delete Group?',
        'You are the only member. This will delete the group permanently.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete Group', 
            style: 'destructive',
            onPress: () => {
              // This would delete the group in a full implementation
              // For now, just go back
              navigation.navigate('Messages');
            }
          }
        ]
      );
      return;
    }
    
    // If you're the creator, make someone else the creator
    let updatedGroup = { ...group };
    if (group.createdBy === user.id) {
      // Find another admin, or any other member
      const nextAdmin = group.admins?.find(id => id !== user.id) || 
                        group.members.find(id => id !== user.id);
      
      if (nextAdmin) {
        updatedGroup.createdBy = nextAdmin;
      }
    }
    
    // Remove yourself from members and admins
    updatedGroup.members = group.members.filter(id => id !== user.id);
    if (updatedGroup.admins) {
      updatedGroup.admins = updatedGroup.admins.filter(id => id !== user.id);
    }
    
    try {
      // Send leaving message
      await sendMessage(
        groupId,
        'You have left the group',
        { isSystemMessage: true }
      );
      
      // Update the group
      await updateGroup(group.id, updatedGroup);
      
      // Navigate back to messages
      navigation.navigate('Messages');
      
      Alert.alert('Success', 'You have left the group.');
    } catch (error) {
      Alert.alert('Error', 'Failed to leave the group.');
      console.error(error);
    }
  };
  
  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
      ) : (
        <View style={[styles.memberAvatar, styles.defaultAvatar]}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
      )}
      
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        {item.isAdmin && <Text style={styles.adminBadge}>Admin</Text>}
      </View>
      
      {userIsAdmin && item.id !== user.id && (
        <View style={styles.memberActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleToggleAdmin(item.id)}
          >
            <Text style={item.isAdmin ? styles.demoteText : styles.promoteText}>
              {item.isAdmin ? 'Demote' : 'Promote'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => {
              Alert.alert(
                'Remove Member',
                `Are you sure you want to remove ${item.name} from the group?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Remove', 
                    style: 'destructive',
                    onPress: () => handleRemoveMember(item.id)
                  }
                ]
              );
            }}
          >
            <Ionicons name="person-remove" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  const renderNonMemberItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.nonMemberItem,
        selectedMembers.includes(item.id) && styles.selectedNonMemberItem
      ]}
      onPress={() => {
        if (selectedMembers.includes(item.id)) {
          setSelectedMembers(selectedMembers.filter(id => id !== item.id));
        } else {
          setSelectedMembers([...selectedMembers, item.id]);
        }
      }}
    >
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
      ) : (
        <View style={[styles.memberAvatar, styles.defaultAvatar]}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
      )}
      
      <Text style={styles.nonMemberName}>{item.name}</Text>
      
      {selectedMembers.includes(item.id) ? (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      ) : (
        <Ionicons name="add-circle-outline" size={24} color="#5EA2EF" />
      )}
    </TouchableOpacity>
  );
  
  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading group settings...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.groupInfo}>
          <View style={styles.groupAvatarContainer}>
            <View style={styles.groupAvatar}>
              <Text style={styles.groupAvatarText}>{group.name[0]}</Text>
            </View>
          </View>
          <View style={styles.groupDetails}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.memberCount}>{members.length} members</Text>
          </View>
          {userIsAdmin && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditGroupNameModal(true)}
            >
              <Ionicons name="create-outline" size={20} color="#5EA2EF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members</Text>
          {userIsAdmin && (
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={() => setAddMemberModal(true)}
            >
              <Ionicons name="person-add" size={20} color="#5EA2EF" />
              <Text style={styles.addMemberText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      
      <TouchableOpacity
        style={styles.leaveGroupButton}
        onPress={() => {
          Alert.alert(
            'Leave Group',
            'Are you sure you want to leave this group?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Leave Group', 
                style: 'destructive',
                onPress: handleLeaveGroup
              }
            ]
          );
        }}
      >
        <Ionicons name="exit-outline" size={20} color="#FF3B30" />
        <Text style={styles.leaveGroupText}>Leave Group</Text>
      </TouchableOpacity>
      
      {/* Edit Group Name Modal */}
      <Modal
        visible={editGroupNameModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditGroupNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Group Name</Text>
              <TouchableOpacity onPress={() => setEditGroupNameModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.groupNameInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Enter group name"
            />
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                !newGroupName.trim() && styles.disabledButton
              ]}
              onPress={handleSaveGroupName}
              disabled={!newGroupName.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Add Members Modal */}
      <Modal
        visible={addMemberModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setAddMemberModal(false);
          setSelectedMembers([]);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Members</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddMemberModal(false);
                  setSelectedMembers([]);
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {nonMembers.length > 0 ? (
              <FlatList
                data={nonMembers}
                renderItem={renderNonMemberItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={50} color="#DADADA" />
                <Text style={styles.emptyText}>No friends to add</Text>
                <Text style={styles.emptySubtext}>
                  All your friends are already in this group
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedMembers.length === 0 && styles.disabledButton
              ]}
              onPress={handleAddMembers}
              disabled={selectedMembers.length === 0}
            >
              <Text style={styles.saveButtonText}>
                {selectedMembers.length > 0
                  ? `Add ${selectedMembers.length} Member${selectedMembers.length > 1 ? 's' : ''}`
                  : 'Add Members'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatarContainer: {
    marginRight: 15,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5EA2EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberCount: {
    color: '#666',
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMemberText: {
    color: '#5EA2EF',
    marginLeft: 5,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  defaultAvatar: {
    backgroundColor: '#5EA2EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  adminBadge: {
    fontSize: 12,
    color: '#5EA2EF',
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoteText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  demoteText: {
    color: '#FF9800',
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 5,
  },
  leaveGroupButton: {
    margin: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveGroupText: {
    marginLeft: 8,
    color: '#FF3B30',
    fontWeight: '500',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
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
  groupNameInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nonMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedNonMemberItem: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  nonMemberName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
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
});

export default GroupSettingsScreen;