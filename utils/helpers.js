import { 
  isDataInitialized, 
  markDataAsInitialized, 
  saveGroups, 
  saveFriends, 
  saveExpenses, 
  saveConversations 
} from './storage';

// Format a date to a readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Check if date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Check if date is within current week
  const dayDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  if (dayDiff < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Default format for older dates
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Calculate the total amount a user owes or is owed
export const calculateBalance = (expenses, userId) => {
  if (!expenses || !expenses.length) return 0;
  
  let balance = 0;
  
  expenses.forEach(expense => {
    const splitAmount = expense.amount / expense.splitBetween.length;
    
    // If user paid for the expense
    if (expense.paidBy === userId) {
      // Add the full amount they paid
      balance += expense.amount;
      
      // Subtract their share if they're part of the split
      if (expense.splitBetween.includes(userId)) {
        balance -= splitAmount;
      }
    } 
    // If user didn't pay but is part of the split
    else if (expense.splitBetween.includes(userId)) {
      balance -= splitAmount;
    }
  });
  
  return balance;
};

// Generate sample data for the app
export const generateMockDataIfNeeded = async () => {
  try {
    const initialized = await isDataInitialized();
    
    if (!initialized) {
      // Sample friends
      const friends = [
        {
          id: 'friend1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          balance: 25.50
        },
        {
          id: 'friend2',
          name: 'Jordan Smith',
          email: 'jordan@example.com',
          balance: -15.20
        },
        {
          id: 'friend3',
          name: 'Morgan Lee',
          email: 'morgan@example.com',
          balance: 0
        }
      ];
      
      // Sample groups
      const groups = [
        {
          id: 'group1',
          name: 'Weekend Trip',
          members: [
            { id: '1', name: 'You' },
            { id: 'friend1', name: 'Alex Johnson' },
            { id: 'friend2', name: 'Jordan Smith' }
          ],
          expenses: [
            {
              id: 'expense1',
              description: 'Dinner at Restaurant',
              amount: 120.00,
              category: 'food',
              paidBy: '1',
              payerName: 'You',
              splitBetween: ['1', 'friend1', 'friend2'],
              settledBy: ['1'],
              date: new Date(Date.now() - 86400000).toISOString() // Yesterday
            },
            {
              id: 'expense2',
              description: 'Hotel Room',
              amount: 200.00,
              category: 'other',
              paidBy: 'friend1',
              payerName: 'Alex Johnson',
              splitBetween: ['1', 'friend1', 'friend2'],
              settledBy: [],
              date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ],
          currentUserId: '1' // Current user ID for convenience
        },
        {
          id: 'group2',
          name: 'Apartment',
          members: [
            { id: '1', name: 'You' },
            { id: 'friend2', name: 'Jordan Smith' },
            { id: 'friend3', name: 'Morgan Lee' }
          ],
          expenses: [
            {
              id: 'expense3',
              description: 'Utilities',
              amount: 75.00,
              category: 'utilities',
              paidBy: '1',
              payerName: 'You',
              splitBetween: ['1', 'friend2', 'friend3'],
              settledBy: ['1', 'friend3'],
              date: new Date(Date.now() - 259200000).toISOString() // 3 days ago
            }
          ],
          currentUserId: '1'
        }
      ];
      
      // Sample conversations
      const conversations = [
        {
          id: 'group1', // Same ID as the group for linking
          name: 'Weekend Trip',
          avatar: null,
          lastMessage: 'Can everyone settle up their share?',
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          unreadCount: 2,
          members: ['1', 'friend1', 'friend2'],
          messages: [
            {
              id: 'message1',
              text: 'Hey everyone, I just added the dinner expense',
              senderId: '1',
              senderName: 'You',
              timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 'message2',
              text: 'I added the hotel bill too',
              senderId: 'friend1',
              senderName: 'Alex Johnson',
              timestamp: new Date(Date.now() - 82800000).toISOString()
            },
            {
              id: 'message3',
              text: 'Thanks guys, I\'ll settle up soon',
              senderId: 'friend2',
              senderName: 'Jordan Smith',
              timestamp: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 'message4',
              text: 'Can everyone settle up their share?',
              senderId: '1',
              senderName: 'You',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        },
        {
          id: 'group2', // Same ID as the group for linking
          name: 'Apartment',
          avatar: null,
          lastMessage: 'I just paid the utilities',
          lastMessageTime: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          unreadCount: 0,
          members: ['1', 'friend2', 'friend3'],
          messages: [
            {
              id: 'message5',
              text: 'I just paid the utilities',
              senderId: '1',
              senderName: 'You',
              timestamp: new Date(Date.now() - 259200000).toISOString()
            },
            {
              id: 'message6',
              text: 'Thanks, I\'ll pay you back',
              senderId: 'friend3',
              senderName: 'Morgan Lee',
              timestamp: new Date(Date.now() - 258000000).toISOString()
            }
          ]
        }
      ];
      
      // All expenses in a flat array
      const expenses = [
        ...groups[0].expenses,
        ...groups[1].expenses
      ];
      
      // Save to AsyncStorage
      await saveGroups(groups);
      await saveFriends(friends);
      await saveExpenses(expenses);
      await saveConversations(conversations);
      await markDataAsInitialized();
      
      console.log('Sample data initialized successfully');
    }
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};

// Format currency amount
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Get initials from name for avatar fallbacks
export const getInitials = (name) => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
