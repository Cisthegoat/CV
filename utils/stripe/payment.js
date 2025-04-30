import { loadStripe } from '@stripe/stripe-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load Stripe with public key
let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    // Use environment variable for public key
    const key = process.env.VITE_STRIPE_PUBLIC_KEY;
    if (!key) {
      console.error('Missing Stripe public key');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

// Create a payment intent for a bill
export const createBillPaymentIntent = async (amount, description) => {
  try {
    // This would typically be a server API call
    // For demo purposes, we'll simulate it with local storage
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `demo_secret_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      status: 'requires_payment_method',
      description: description,
      created: Date.now(),
    };
    
    // Save to local storage for demo
    await AsyncStorage.setItem(`payment_intent_${paymentIntent.id}`, JSON.stringify(paymentIntent));
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Process a payment for a bill
export const processPayment = async (clientSecret, paymentMethod) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe initialization failed');
    }
    
    // In a real implementation, this would use the Stripe API to confirm payment
    const mockResult = {
      success: true,
      paymentIntent: {
        status: 'succeeded',
        id: `pi_${Date.now()}`,
      }
    };
    
    return mockResult;
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get payment status for a specific payment intent
export const getPaymentStatus = async (paymentIntentId) => {
  try {
    // In a real implementation, this would check the payment intent status from Stripe
    const storedPaymentData = await AsyncStorage.getItem(`payment_intent_${paymentIntentId}`);
    if (!storedPaymentData) {
      return { success: false, error: 'Payment not found' };
    }
    
    const paymentIntent = JSON.parse(storedPaymentData);
    return {
      success: true,
      status: paymentIntent.status || 'requires_payment_method'
    };
  } catch (error) {
    console.error('Error getting payment status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getStripe,
  createBillPaymentIntent,
  processPayment,
  getPaymentStatus
};