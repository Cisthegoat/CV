import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';

const Stack = createStackNavigator();

export default function MessagesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5EA2EF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="All Messages" component={MessagesScreen} />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({ title: route.params?.name || 'Chat' })}
      />
      <Stack.Screen 
        name="GroupInfo" 
        component={GroupDetailScreen} 
        options={({ route }) => ({ title: route.params?.name || 'Group Info' })}
      />
    </Stack.Navigator>
  );
}
