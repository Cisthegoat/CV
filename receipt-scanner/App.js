import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
