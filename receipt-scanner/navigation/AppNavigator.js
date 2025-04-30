import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeNavigator from './HomeNavigator';
import MessagesNavigator from './MessagesNavigator';
import ProfileNavigator from './ProfileNavigator';
import { AuthContext } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import FriendsListScreen from '../screens/FriendsListScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const FriendsStack = createStackNavigator();

// Create Friends Navigator
function FriendsNavigator() {
  return (
    <FriendsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <FriendsStack.Screen 
        name="FriendsList" 
        component={FriendsListScreen} 
        options={{ headerShown: false }}
      />
      <FriendsStack.Screen 
        name="AddFriend" 
        component={AddFriendScreen} 
        options={{ title: 'Add Friend' }}
      />
      <FriendsStack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({ title: route.params?.name || 'Chat' })}
      />
    </FriendsStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  // If not authenticated, we could show a login screen here
  // but for now, we'll assume the user is always authenticated
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5EA2EF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Messages" component={MessagesNavigator} />
      <Tab.Screen name="Friends" component={FriendsNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
