import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import GroupsScreen from '../screens/GroupsScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';

const Stack = createStackNavigator();

export default function GroupsNavigator() {
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
      <Stack.Screen name="All Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} options={({ route }) => ({ title: route.params?.name || 'Group Details' })} />
    </Stack.Navigator>
  );
}
