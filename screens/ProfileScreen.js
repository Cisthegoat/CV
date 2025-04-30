import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { friends } = useContext(DataContext);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedFirstName, setEditedFirstName] = useState(user.name.split(' ')[0] || '');
  const [editedLastName, setEditedLastName] = useState(user.name.split(' ')[1] || '');
  const [editedAvatar, setEditedAvatar] = useState(user.avatar);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  
  const friendCount = friends.length;
  
  // Avatar options
  const avatarOptions = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(editedFirstName + '+' + editedLastName)}&background=random`,
    'https://ui-avatars.com/api/?name=JD&background=5EA2EF&color=fff',
    'https://ui-avatars.com/api/?name=US&background=4CAF50&color=fff',
    'https://ui-avatars.com/api/?name=AB&background=F44336&color=fff',
    'https://ui-avatars.com/api/?name=XY&background=FF9800&color=fff',
    'https://ui-avatars.com/api/?name=ZZ&background=9C27B0&color=fff',
  ];
  
  useEffect(() => {
    // Update the first avatar option when name changes
    setSelectedAvatar(avatarOptions[0]);
  }, [editedFirstName, editedLastName]);
  
  const saveProfileChanges = async () => {
    try {
      const fullName = `${editedFirstName} ${editedLastName}`.trim();
      
      // Create updated profile data
      const profileData = {
        name: fullName,
        avatar: selectedAvatar || user.avatar
      };
      
      // Update user profile using context function
      const result = await updateProfile(profileData);
      
      if (result.success) {
        Alert.alert(
          "Profile Updated",
          "Your profile has been successfully updated.",
          [{ text: "OK", onPress: () => setEditProfileVisible(false) }]
        );
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', result.error || 'Failed to logout');
            }
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: user.avatar || 'https://ui-avatars.com/api/?name=John+Doe' }}
            style={styles.profileImage}
          />
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={() => setEditProfileVisible(true)}
          >
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setEditProfileVisible(true)}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditProfileVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={editedFirstName}
              onChangeText={setEditedFirstName}
              placeholder="Enter your first name"
            />
            
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={editedLastName}
              onChangeText={setEditedLastName}
              placeholder="Enter your last name"
            />
            
            <Text style={styles.inputLabel}>Select Avatar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarSelector}>
              {avatarOptions.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar && styles.selectedAvatarOption
                  ]}
                  onPress={() => setSelectedAvatar(avatar)}
                >
                  <Image source={{ uri: avatar }} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditProfileVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveProfileChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      

      
      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="notifications-outline" size={22} color="#666" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D1D6', true: '#A8D3FF' }}
            thumbColor={notificationsEnabled ? '#5EA2EF' : '#F4F3F4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="moon-outline" size={22} color="#AAA" />
            <Text style={styles.settingTextDisabled}>Dark Mode</Text>
            <View style={styles.inDevelopment}>
              <Text style={styles.inDevelopmentText}>Coming Soon</Text>
            </View>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={() => Alert.alert("Coming Soon", "Dark mode is not yet implemented. Check back in a future update!")}
            trackColor={{ false: '#D1D1D6', true: '#D1D1D6' }}
            thumbColor={'#C7C7CC'}
            disabled={true}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => Alert.alert("Privacy Settings", "Manage your privacy preferences, control data sharing and review your account information.")}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#666" />
            <Text style={styles.settingText}>Privacy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => Alert.alert("Help & Support", "Contact support, view FAQ, or browse help documentation to troubleshoot issues with your account.")}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="help-circle-outline" size={22} color="#666" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => Alert.alert("About SplitWise", "Version 1.0.0\n\nA social-first bill splitting app that helps you manage shared expenses with friends and family.")}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="information-circle-outline" size={22} color="#666" />
            <Text style={styles.settingText}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={22} color="#F44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5EA2EF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editProfileButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  editProfileText: {
    color: '#5EA2EF',
    fontWeight: '500',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#555',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  avatarSelector: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  avatarOption: {
    marginRight: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderColor: '#5EA2EF',
  },
  avatarOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: '#5EA2EF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendCount: {
    fontSize: 14,
    color: '#666',
  },
  friendOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#5EA2EF',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  settingTextDisabled: {
    fontSize: 16,
    marginLeft: 10,
    color: '#AAA',
  },
  inDevelopment: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  inDevelopmentText: {
    fontSize: 10,
    color: '#888',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default ProfileScreen;
