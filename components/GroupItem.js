import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';

const GroupItem = ({ group, onPress }) => {
  const { friends } = useContext(DataContext);
  
  // Get member information to display avatars
  const getGroupMembers = () => {
    return group.members.map(memberId => {
      return friends.find(friend => friend.id === memberId) || null;
    }).filter(member => member !== null);
  };

  const members = getGroupMembers();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(group)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.description}>{group.description || 'No description'}</Text>
          
          <View style={styles.expenseContainer}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.expenseText}>
              ${group.totalExpenses.toFixed(2)} total
            </Text>
          </View>
        </View>
        
        <View style={styles.memberAvatars}>
          {members.slice(0, 3).map((member, index) => (
            <View key={member.id} style={[styles.avatarContainer, { zIndex: 3 - index, right: index * 10 }]}>
              {member.avatar ? (
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                </View>
              )}
            </View>
          ))}
          
          {members.length > 3 && (
            <View style={[styles.avatarContainer, { zIndex: 0, right: 30 }]}>
              <View style={[styles.avatar, styles.moreAvatar]}>
                <Text style={styles.moreAvatarText}>+{members.length - 3}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  expenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5EA2EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  moreAvatar: {
    backgroundColor: '#E0E0E0',
  },
  moreAvatarText: {
    color: '#666',
    fontSize: 12,
  },
});

export default GroupItem;
