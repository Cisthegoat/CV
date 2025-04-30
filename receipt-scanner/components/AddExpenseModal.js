import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const AddExpenseModal = ({ visible, onClose, onSave, groupMembers = [], currentUserId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitMembers, setSplitMembers] = useState(
    groupMembers.map(member => ({
      ...member,
      isIncluded: true
    }))
  );

  const categories = [
    { id: 'food', name: 'Food & Drinks', icon: 'coffee' },
    { id: 'transport', name: 'Transport', icon: 'navigation' },
    { id: 'entertainment', name: 'Entertainment', icon: 'film' },
    { id: 'utilities', name: 'Utilities', icon: 'home' },
    { id: 'other', name: 'Other', icon: 'dollar-sign' },
  ];

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('other');
    setPaidBy(currentUserId);
    setSplitMembers(
      groupMembers.map(member => ({
        ...member,
        isIncluded: true
      }))
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!description.trim() || !amount.trim() || isNaN(parseFloat(amount))) {
      // Add validation here
      alert('Please enter a valid description and amount');
      return;
    }

    const includedMemberIds = splitMembers
      .filter(member => member.isIncluded)
      .map(member => member.id);

    if (includedMemberIds.length === 0) {
      alert('Please include at least one person in the split');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      paidBy,
      payerName: groupMembers.find(member => member.id === paidBy)?.name || 'Unknown',
      splitBetween: includedMemberIds,
      settledBy: [], // No one has settled yet
      date: new Date().toISOString(),
    };

    onSave(newExpense);
    resetForm();
    onClose();
  };

  const toggleMemberInSplit = (memberId) => {
    setSplitMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, isIncluded: !member.isIncluded } 
          : member
      )
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={24} color="#888888" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="What was this expense for?"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && styles.categoryButtonSelected
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Feather 
                      name={cat.icon} 
                      size={20} 
                      color={category === cat.id ? '#FFFFFF' : '#333333'} 
                    />
                    <Text 
                      style={[
                        styles.categoryText,
                        category === cat.id && styles.categoryTextSelected
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Paid by</Text>
              <View style={styles.payerContainer}>
                {groupMembers.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.payerButton,
                      paidBy === member.id && styles.payerButtonSelected
                    ]}
                    onPress={() => setPaidBy(member.id)}
                  >
                    <Text 
                      style={[
                        styles.payerText,
                        paidBy === member.id && styles.payerTextSelected
                      ]}
                    >
                      {member.id === currentUserId ? 'You' : member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Split between</Text>
              {splitMembers.map(member => (
                <View key={member.id} style={styles.splitMemberRow}>
                  <Text style={styles.splitMemberName}>
                    {member.id === currentUserId ? 'You' : member.name}
                  </Text>
                  <Switch
                    value={member.isIncluded}
                    onValueChange={() => toggleMemberInSplit(member.id)}
                    trackColor={{ false: '#CCCCCC', true: '#5B37B7' }}
                    thumbColor={member.isIncluded ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  formContainer: {
    flex: 1,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#5B37B7',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333333',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  payerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  payerButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  payerButtonSelected: {
    backgroundColor: '#5B37B7',
  },
  payerText: {
    fontSize: 14,
    color: '#333333',
  },
  payerTextSelected: {
    color: '#FFFFFF',
  },
  splitMemberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  splitMemberName: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddExpenseModal;
