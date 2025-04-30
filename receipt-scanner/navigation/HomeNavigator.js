import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';

const Stack = createStackNavigator();

export default function HomeNavigator() {
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
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
}
