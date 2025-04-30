import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../context/DataContext';

const AddFriendScreen = ({ navigation }) => {
  const { addFriend, friends } = useContext(DataContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleAddFriend = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your friend');
      return;
    }
    
    if (email.trim() && !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Check if friend with this email already exists
    if (email.trim() && friends.some(friend => friend.email === email.trim())) {
      Alert.alert('Error', 'A friend with this email already exists');
      return;
    }
    
    setLoading(true);
    
    const newFriend = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}`,
    };
    
    const result = await addFriend(newFriend);
    
    setLoading(false);
    
    if (result.success) {
      Alert.alert(
        'Success',
        `${name.trim()} was added to your friends!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to add friend');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        <Ionicons name="person-add-outline" size={50} color="#5EA2EF" />
        <Text style={styles.infoTitle}>Add a New Friend</Text>
        <Text style={styles.infoText}>
          Enter your friend's information to add them to your friends list.
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter friend's name"
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter friend's email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter friend's phone number"
            keyboardType="phone-pad"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddFriend}
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.addButtonText}>Add Friend</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.tipContainer}>
        <Ionicons name="bulb-outline" size={20} color="#FF9800" />
        <Text style={styles.tipText}>
          You can add friends to groups later to start splitting expenses.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  infoContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    margin: 15,
    borderRadius: 8,
    padding: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 10,
    flex: 1,
  },
});

export default AddFriendScreen;
