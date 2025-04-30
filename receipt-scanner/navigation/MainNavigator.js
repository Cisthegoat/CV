import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FriendsListScreen from '../screens/FriendsListScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReceiptScanScreen from '../screens/ReceiptScanScreen';
import GroupSettingsScreen from '../screens/GroupSettingsScreen';
import GroupOverviewScreen from '../screens/GroupOverviewScreen';

// Import context
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator
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
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator
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
    <Stack.Screen 
      name="Messages" 
      component={MessagesScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={({ route }) => ({ title: route.params.name || 'Chat' })}
    />
    <Stack.Screen 
      name="GroupOverview" 
      component={GroupOverviewScreen} 
      options={({ route }) => ({ 
        title: 'Group Overview',
        headerLeft: props => (
          <TouchableOpacity 
            style={{ marginLeft: 15 }}
            onPress={() => route.params?.onGoBack ? route.params.onGoBack() : props.onPress()}
          >
            <Feather name="arrow-left" size={24} color="#5EA2EF" />
          </TouchableOpacity>
        )
      })}
    />
    <Stack.Screen 
      name="GroupSettings" 
      component={GroupSettingsScreen} 
      options={({ route }) => ({ 
        title: 'Group Settings',
        headerLeft: props => (
          <TouchableOpacity 
            style={{ marginLeft: 15 }}
            onPress={() => route.params?.onGoBack ? route.params.onGoBack() : props.onPress()}
          >
            <Feather name="arrow-left" size={24} color="#5EA2EF" />
          </TouchableOpacity>
        )
      })}
    />
    <Stack.Screen 
      name="PaymentScreen" 
      component={PaymentScreen} 
      options={{ title: 'Pay with Stripe' }}
    />
    <Stack.Screen
      name="ReceiptScan"
      component={ReceiptScanScreen}
      options={({ route }) => ({ 
        headerShown: true,
        title: 'Scan Receipt',
        headerLeft: props => (
          <TouchableOpacity 
            style={{ marginLeft: 15 }}
            onPress={() => route.params?.onGoBack ? route.params.onGoBack() : props.onPress()}
          >
            <Feather name="arrow-left" size={24} color="#5EA2EF" />
          </TouchableOpacity>
        )
      })}
    />
  </Stack.Navigator>
);

const FriendsStack = () => (
  <Stack.Navigator
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
    <Stack.Screen 
      name="FriendsList" 
      component={FriendsListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AddFriend" 
      component={AddFriendScreen} 
      options={{ title: 'Add Friend' }}
    />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={({ route }) => ({ title: route.params.name || 'Chat' })}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
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
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5B37B7',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEEEE',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="MessagesTab" 
        component={MessagesStack} 
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="FriendsTab" 
        component={FriendsStack} 
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Fake Login/Register Screens for demonstration
const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Login</Text>
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#5B37B7', 
          padding: 15, 
          borderRadius: 10, 
          width: '100%', 
          alignItems: 'center' 
        }}
        onPress={() => login({ id: '1', displayName: 'Test User', email: 'test@example.com' })}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Login as Test User</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main navigator that handles auth flow
const MainNavigator = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
