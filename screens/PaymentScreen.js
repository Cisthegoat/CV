import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBillPaymentIntent, processPayment } from '../utils/stripe/payment';
import { DataContext } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';

const PaymentScreen = ({ route, navigation }) => {
  const { amount, description, billId, conversationId, senderId } = route.params;
  const { updateBillStatus, sendMessage } = useContext(DataContext);
  
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Format the card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const chunks = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.substr(i, 4));
    }
    
    return chunks.join(' ').substr(0, 19);
  };
  
  // Format the expiry date
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (cleaned.length >= 2) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
    }
    
    return cleaned;
  };
  
  const handleCardNumberChange = (text) => {
    setCardNumber(formatCardNumber(text));
  };
  
  const handleExpiryDateChange = (text) => {
    text = text.replace('/', '');
    setExpiryDate(formatExpiryDate(text));
  };
  
  const validatePaymentForm = () => {
    if (cardNumber.replace(/\s+/g, '').length !== 16) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
      return false;
    }
    
    if (expiryDate.length !== 5) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY).');
      return false;
    }
    
    if (cvc.length < 3) {
      Alert.alert('Invalid CVC', 'Please enter a valid CVC code.');
      return false;
    }
    
    if (!cardholderName.trim()) {
      Alert.alert('Missing Information', 'Please enter the cardholder name.');
      return false;
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validatePaymentForm()) return;
    
    setLoading(true);
    
    try {
      // Create a payment intent
      const paymentIntentResult = await createBillPaymentIntent(amount, description);
      
      if (!paymentIntentResult.success) {
        throw new Error(paymentIntentResult.error || 'Failed to create payment intent');
      }
      
      // Create a payment method (in a real app, this would use Stripe Elements)
      const paymentMethodData = {
        type: 'card',
        card: {
          number: cardNumber.replace(/\s+/g, ''),
          exp_month: parseInt(expiryDate.split('/')[0], 10),
          exp_year: parseInt(`20${expiryDate.split('/')[1]}`, 10),
          cvc: cvc,
        },
        billing_details: {
          name: cardholderName,
        },
      };
      
      // Process the payment (in a real app, this would confirm the payment intent)
      const paymentResult = await processPayment(
        paymentIntentResult.clientSecret,
        paymentMethodData
      );
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
      
      // Update bill status to paid
      if (billId) {
        await updateBillStatus(billId, 'paid');
      }
      
      // Send a confirmation message
      if (conversationId) {
        await sendMessage(
          conversationId,
          `✅ I've paid $${amount} for ${description}.`
        );
      }
      
      setPaymentComplete(true);
      
      // Show success message and navigate back
      setTimeout(() => {
        Alert.alert(
          'Payment Successful',
          `Your payment of ${formatCurrency(amount)} has been processed successfully.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      Alert.alert('Payment Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pay with Stripe</Text>
          <Text style={styles.subtitle}>
            Payment of {formatCurrency(amount)} for {description}
          </Text>
        </View>
        
        {paymentComplete ? (
          <View style={styles.successContainer}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={64} color="white" />
            </View>
            <Text style={styles.successText}>Payment Successful!</Text>
            <Text style={styles.successSubtext}>
              Your payment has been processed successfully.
            </Text>
          </View>
        ) : (
          <View style={styles.paymentForm}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Card Information</Text>
              
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#5EA2EF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>
              
              <View style={styles.rowInputs}>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#5EA2EF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChangeText={handleExpiryDateChange}
                      keyboardType="number-pad"
                      maxLength={5}
                    />
                  </View>
                </View>
                
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>CVC</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#5EA2EF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      value={cvc}
                      onChangeText={setCvc}
                      keyboardType="number-pad"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
              
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#5EA2EF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.payButtonText}>
                  Pay {formatCurrency(amount)}
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.securePaymentNote}>
              <Ionicons name="lock-closed" size={16} color="#666" />
              <Text style={styles.securePaymentText}>
                Your payment is secure. Card details are encrypted.
              </Text>
            </View>
            
            <View style={styles.paymentMethodsContainer}>
              <Text style={styles.paymentMethodsText}>Powered by</Text>
              <View style={styles.stripeContainer}>
                <Text style={styles.stripeLogo}>stripe</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  paymentForm: {
    paddingHorizontal: 20,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#5EA2EF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securePaymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  securePaymentText: {
    color: '#666',
    marginLeft: 6,
    fontSize: 12,
  },
  paymentMethodsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  paymentMethodsText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 10,
  },
  stripeContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  stripeLogo: {
    fontSize: 24,
    color: '#6772E5',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  successSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default PaymentScreen;