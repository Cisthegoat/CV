import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize with a default user to prevent null reference errors
  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for testing
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Error retrieving user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    // This would typically be an API call to authenticate
    // For now, we'll simulate a successful login
    
    const userData = {
      id: '1',
      name: 'John Doe',
      email: email,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    };
    
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.log('Error storing user data:', error);
      return { success: false, error: 'Failed to store user data' };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.log('Error updating user data:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      // Reset to default user instead of null to prevent errors
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe'
      });
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.log('Error removing user data:', error);
      return { success: false, error: 'Failed to log out' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
