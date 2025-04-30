// This file contains functions to generate consistent mock data,
// used when initializing the app for the first time

export const generateInitialGroups = (userId) => {
  return [
    { 
      id: '1', 
      name: 'Roommates', 
      members: [userId, '2', '3'], 
      totalExpenses: 1250.50,
      description: 'Shared expenses for our apartment'
    },
    { 
      id: '2', 
      name: 'Trip to Paris', 
      members: [userId, '4', '5'], 
      totalExpenses: 3500.75,
      description: 'Our 2023 Paris vacation expenses'
    },
    { 
      id: '3', 
      name: 'Friday Dinner', 
      members: [userId, '2', '5'], 
      totalExpenses: 189.25,
      description: 'Weekly dinner meetup expenses'
    },
    { 
      id: '4', 
      name: 'Baseball Game', 
      members: [userId, '2', '4', '3'], 
      totalExpenses: 355.80,
      description: 'Tickets and snacks for the baseball game'
    },
    { 
      id: '5', 
      name: 'Beach House Rental', 
      members: [userId, '2', '3', '4', '5'], 
      totalExpenses: 1750.00,
      description: 'Summer beach house rental with friends'
    },
    { 
      id: '6', 
      name: 'Concert Night', 
      members: [userId, '3'], 
      totalExpenses: 210.50,
      description: 'Tickets and drinks for the rock concert'
    },
  ];
};

export const generateInitialFriends = () => {
  return [
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      phone: '555-1234' 
    },
    { 
      id: '3', 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson',
      phone: '555-2345'
    },
    { 
      id: '4', 
      name: 'Alice Brown', 
      email: 'alice@example.com', 
      avatar: 'https://ui-avatars.com/api/?name=Alice+Brown',
      phone: '555-3456'
    },
    { 
      id: '5', 
      name: 'Charlie Davis', 
      email: 'charlie@example.com', 
      avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis',
      phone: '555-4567'
    },
  ];
};

export const generateInitialMessages = (userId) => {
  return {
    '1': [
      { id: '1', senderId: '2', text: 'Hey everyone, I paid the electricity bill', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: '2', senderId: '3', text: 'Thanks! I\'ll send my part tonight', timestamp: new Date(Date.now() - 43200000).toISOString() },
      { id: '3', senderId: userId, text: 'No rush, I\'ve added it to the expenses', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: '4', senderId: '2', text: 'Also, we need to talk about the internet bill next week', timestamp: new Date(Date.now() - 3000000).toISOString() },
      { id: '5', senderId: userId, text: 'Sure, I think we should upgrade our plan too', timestamp: new Date(Date.now() - 2400000).toISOString() },
      { id: '6', senderId: '3', text: 'Agreed! The current speed is too slow for video calls', timestamp: new Date(Date.now() - 1800000).toISOString() },
    ],
    '2': [
      { id: '1', senderId: userId, text: 'Everyone ready for Paris next month?', timestamp: new Date(Date.now() - 259200000).toISOString() },
      { id: '2', senderId: '4', text: 'Yes! So excited!', timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: '3', senderId: '5', text: 'I\'ve booked the Airbnb, will add to expenses', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: '4', senderId: userId, text: 'Great! How much do we owe you?', timestamp: new Date(Date.now() - 82800000).toISOString() },
      { id: '5', senderId: '5', text: 'It\'s $400 per person for 5 nights', timestamp: new Date(Date.now() - 79200000).toISOString() },
      { id: '6', senderId: '4', text: 'That\'s a good deal! I\'ll transfer you my part tomorrow', timestamp: new Date(Date.now() - 72000000).toISOString() },
      { id: '7', senderId: userId, text: 'Same here, thanks for organizing!', timestamp: new Date(Date.now() - 68400000).toISOString() },
    ],
    '3': [
      { id: '1', senderId: userId, text: 'Dinner at 8pm on Friday?', timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: '2', senderId: '2', text: 'Sounds good!', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', senderId: '5', text: 'I\'ll make a reservation', timestamp: new Date(Date.now() - 43200000).toISOString() },
      { id: '4', senderId: '2', text: 'Where are we going?', timestamp: new Date(Date.now() - 39600000).toISOString() },
      { id: '5', senderId: userId, text: 'How about that new Italian place on Main St?', timestamp: new Date(Date.now() - 36000000).toISOString() },
      { id: '6', senderId: '5', text: 'Perfect! I\'ll book it for 3 people at 8pm', timestamp: new Date(Date.now() - 32400000).toISOString() },
    ],
    '4': [
      { id: '1', senderId: '3', text: 'Where is everyone sitting?', timestamp: new Date(Date.now() - 345600000).toISOString() },
      { id: '2', senderId: userId, text: 'We\'re in Section 122, Row 15', timestamp: new Date(Date.now() - 342000000).toISOString() },
      { id: '3', senderId: '2', text: 'I\'m getting snacks, anyone want anything?', timestamp: new Date(Date.now() - 338400000).toISOString() },
      { id: '4', senderId: '4', text: 'Nachos and a beer for me please!', timestamp: new Date(Date.now() - 334800000).toISOString() },
      { id: '5', senderId: userId, text: 'I\'ll have the same, thanks!', timestamp: new Date(Date.now() - 331200000).toISOString() },
    ],
    '5': [
      { id: '1', senderId: userId, text: 'Beach house dates confirmed! June 15-20', timestamp: new Date(Date.now() - 518400000).toISOString() },
      { id: '2', senderId: '2', text: 'Perfect timing!', timestamp: new Date(Date.now() - 514800000).toISOString() },
      { id: '3', senderId: '3', text: 'How are we splitting the cars?', timestamp: new Date(Date.now() - 511200000).toISOString() },
      { id: '4', senderId: '4', text: 'I can drive my SUV, fits 5 with luggage', timestamp: new Date(Date.now() - 507600000).toISOString() },
      { id: '5', senderId: '5', text: 'I\'ll bring the coolers and beach gear', timestamp: new Date(Date.now() - 504000000).toISOString() },
      { id: '6', senderId: userId, text: 'And I\'ll handle the grocery shopping when we arrive', timestamp: new Date(Date.now() - 500400000).toISOString() },
    ],
    '6': [
      { id: '1', senderId: userId, text: 'Got the concert tickets! $105 each', timestamp: new Date(Date.now() - 432000000).toISOString() },
      { id: '2', senderId: '3', text: 'Awesome! I\'ll pay you right now', timestamp: new Date(Date.now() - 428400000).toISOString() },
      { id: '3', senderId: userId, text: 'We should grab dinner before the show', timestamp: new Date(Date.now() - 424800000).toISOString() },
      { id: '4', senderId: '3', text: 'There\'s a good burger place next to the venue', timestamp: new Date(Date.now() - 421200000).toISOString() },
      { id: '5', senderId: userId, text: 'Perfect, let\'s meet there at 6pm', timestamp: new Date(Date.now() - 417600000).toISOString() },
    ],
  };
};

export const generateInitialActivities = (userId) => {
  return [
    { 
      id: '1', 
      type: 'payment', 
      description: 'Jane paid $75 for electricity', 
      timestamp: new Date(Date.now() - 86400000).toISOString(), 
      groupId: '1' 
    },
    { 
      id: '2', 
      type: 'expense', 
      description: 'You added $189.25 for Friday dinner', 
      timestamp: new Date(Date.now() - 43200000).toISOString(), 
      groupId: '3' 
    },
    { 
      id: '3', 
      type: 'payment', 
      description: 'Charlie paid you $95.50', 
      timestamp: new Date(Date.now() - 21600000).toISOString(), 
      groupId: '2' 
    },
    { 
      id: '4', 
      type: 'reminder', 
      description: 'Bob owes you $45 for groceries', 
      timestamp: new Date(Date.now() - 7200000).toISOString(), 
      groupId: '1' 
    },
  ];
};

export const generateInitialPendingBills = (userId) => {
  return [
    { 
      id: '1', 
      description: 'Electricity Bill', 
      amount: 75.00, 
      dueDate: new Date(Date.now() + 604800000).toISOString(), 
      groupId: '1', 
      paidBy: '2', 
      owedBy: [userId, '3'] 
    },
    { 
      id: '2', 
      description: 'Dinner at Ristorante', 
      amount: 189.25, 
      dueDate: new Date(Date.now() + 259200000).toISOString(), 
      groupId: '3', 
      paidBy: userId, 
      owedBy: ['2', '5'] 
    },
    { 
      id: '3', 
      description: 'Airbnb Booking', 
      amount: 1200.00, 
      dueDate: new Date(Date.now() + 1209600000).toISOString(), 
      groupId: '2', 
      paidBy: '5', 
      owedBy: [userId, '4'] 
    },
    { 
      id: '4', 
      description: 'Baseball Tickets', 
      amount: 245.00, 
      dueDate: new Date(Date.now() + 172800000).toISOString(), 
      groupId: '4', 
      paidBy: userId, 
      owedBy: ['2', '3', '4'] 
    },
    { 
      id: '5', 
      description: 'Concert Tickets', 
      amount: 210.50, 
      dueDate: new Date(Date.now() + 432000000).toISOString(), 
      groupId: '6', 
      paidBy: userId, 
      owedBy: ['3'] 
    },
    { 
      id: '6', 
      description: 'Beach House Rental', 
      amount: 1750.00, 
      dueDate: new Date(Date.now() + 1382400000).toISOString(), 
      groupId: '5', 
      paidBy: userId, 
      owedBy: ['2', '3', '4', '5'] 
    },
    { 
      id: '7', 
      description: 'Internet Bill', 
      amount: 60.00, 
      dueDate: new Date(Date.now() + 1036800000).toISOString(), 
      groupId: '1', 
      paidBy: '3', 
      owedBy: [userId, '2'] 
    },
    { 
      id: '8', 
      description: 'Groceries', 
      amount: 87.35, 
      dueDate: new Date(Date.now() + 86400000).toISOString(), 
      groupId: '1', 
      paidBy: userId, 
      owedBy: ['2', '3'] 
    },
  ];
};
