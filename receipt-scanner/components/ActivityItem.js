import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';

const ActivityItem = ({ activity }) => {
  const { groups } = useContext(DataContext);
  
  // Find the group this activity belongs to
  const group = groups.find(g => g.id === activity.groupId);
  
  // Get icon based on activity type
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'payment':
        return <Ionicons name="cash-outline" size={24} color="#4CAF50" />;
      case 'expense':
        return <Ionicons name="cart-outline" size={24} color="#FF9800" />;
      case 'reminder':
        return <Ionicons name="alarm-outline" size={24} color="#F44336" />;
      default:
        return <Ionicons name="ellipsis-horizontal" size={24} color="#9E9E9E" />;
    }
  };
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    
    const diffSecs = diffMs / 1000;
    const diffMins = diffSecs / 60;
    const diffHours = diffMins / 60;
    const diffDays = diffHours / 24;
    
    if (diffDays >= 1) {
      return `${Math.floor(diffDays)}d ago`;
    } else if (diffHours >= 1) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffMins >= 1) {
      return `${Math.floor(diffMins)}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getActivityIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.description}>{activity.description}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.groupName}>
            {group ? group.name : 'Unknown Group'}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(activity.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 13,
    color: '#5EA2EF',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default ActivityItem;
