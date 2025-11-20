// Mock API using localStorage for testing without backend
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: 'topup' | 'withdrawal' | 'subscription_payment';
  amount: number;
  description?: string;
  timestamp: string;
}

interface Group {
  _id: string;
  subscription: {
    _id: string;
    name: string;
    icon: string;
    monthlyPrice: number;
    maxUsers: number;
  };
  members: {
    userId: string;
    userName: string;
    paidStatus: boolean;
    amount: number;
  }[];
  totalPrice: number;
  status: string;
  nextRenewalDate: string;
}

interface Subscription {
  _id: string;
  name: string;
  icon: string;
  monthlyPrice: number;
  maxUsers: number;
}

// Initialize mock data
const initializeMockData = () => {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify([]));
  }
  if (!localStorage.getItem('mockTransactions')) {
    localStorage.setItem('mockTransactions', JSON.stringify([]));
  }
  if (!localStorage.getItem('mockGroups')) {
    localStorage.setItem('mockGroups', JSON.stringify([]));
  }
  if (!localStorage.getItem('mockSubscriptions')) {
    const subscriptions: Subscription[] = [
      { _id: '1', name: 'Netflix', icon: '🎬', monthlyPrice: 1500, maxUsers: 4 },
      { _id: '2', name: 'Spotify', icon: '🎵', monthlyPrice: 900, maxUsers: 6 },
      { _id: '3', name: 'Canva Pro', icon: '🎨', monthlyPrice: 1200, maxUsers: 5 },
      { _id: '4', name: 'Amazon Prime', icon: '📦', monthlyPrice: 1000, maxUsers: 3 },
      { _id: '5', name: 'Showmax', icon: '📺', monthlyPrice: 800, maxUsers: 4 },
      { _id: '6', name: 'YouTube Premium', icon: '▶️', monthlyPrice: 1100, maxUsers: 5 },
      { _id: '7', name: 'Disney+', icon: '🏰', monthlyPrice: 1300, maxUsers: 4 },
      { _id: '8', name: 'Adobe Creative Cloud', icon: '🖌️', monthlyPrice: 5000, maxUsers: 2 },
    ];
    localStorage.setItem('mockSubscriptions', JSON.stringify(subscriptions));
  }
};

// Helper functions
const getUsers = (): User[] => JSON.parse(localStorage.getItem('mockUsers') || '[]');
const setUsers = (users: User[]) => localStorage.setItem('mockUsers', JSON.stringify(users));

const getTransactions = (): Transaction[] => JSON.parse(localStorage.getItem('mockTransactions') || '[]');
const setTransactions = (transactions: Transaction[]) => localStorage.setItem('mockTransactions', JSON.stringify(transactions));

const getGroups = (): Group[] => JSON.parse(localStorage.getItem('mockGroups') || '[]');
const setGroups = (groups: Group[]) => localStorage.setItem('mockGroups', JSON.stringify(groups));

const getSubscriptions = (): Subscription[] => JSON.parse(localStorage.getItem('mockSubscriptions') || '[]');

const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('mockToken');
  if (!token) return null;
  const users = getUsers();
  return users.find(u => u.id === token) || null;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export const mockAuthAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    await delay(500);
    initializeMockData();
    
    const users = getUsers();
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      walletBalance: 1000,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setUsers(users);
    localStorage.setItem('mockToken', newUser.id);

    return {
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          walletBalance: newUser.walletBalance,
        },
        token: newUser.id,
      },
    };
  },

  login: async (data: { email: string; password: string }) => {
    await delay(500);
    initializeMockData();
    
    const users = getUsers();
    const user = users.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem('mockToken', user.id);

    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          walletBalance: user.walletBalance,
        },
        token: user.id,
      },
    };
  },

  getMe: async () => {
    await delay(300);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
      },
    };
  },
};

export const mockUserAPI = {
  getUser: async (id: string) => {
    await delay(300);
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
      },
    };
  },

  updateUser: async (id: string, data: Record<string, string>) => {
    await delay(500);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) throw new Error('User not found');

    if (data.currentPassword && data.newPassword) {
      if (users[userIndex].password !== data.currentPassword) {
        throw new Error('Current password is incorrect');
      }
      users[userIndex].password = data.newPassword;
    }

    if (data.name) users[userIndex].name = data.name;
    if (data.email) users[userIndex].email = data.email;

    setUsers(users);

    return { data: { message: 'User updated successfully' } };
  },
};

export const mockWalletAPI = {
  topup: async (amount: number) => {
    await delay(500);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].walletBalance += amount;
    setUsers(users);

    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'topup',
      amount,
      description: 'Wallet top-up',
      timestamp: new Date().toISOString(),
    };

    const transactions = getTransactions();
    transactions.push(transaction);
    setTransactions(transactions);

    return { data: { message: 'Top-up successful' } };
  },

  withdraw: async (amount: number) => {
    await delay(500);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (users[userIndex].walletBalance < amount) {
      throw new Error('Insufficient balance');
    }

    users[userIndex].walletBalance -= amount;
    setUsers(users);

    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'withdrawal',
      amount,
      description: 'Wallet withdrawal',
      timestamp: new Date().toISOString(),
    };

    const transactions = getTransactions();
    transactions.push(transaction);
    setTransactions(transactions);

    return { data: { message: 'Withdrawal successful' } };
  },

  getTransactions: async () => {
    await delay(300);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const transactions = getTransactions().filter(t => t.userId === user.id);
    return { data: transactions.reverse() };
  },
};

export const mockSubscriptionAPI = {
  getAll: async () => {
    await delay(300);
    return { data: getSubscriptions() };
  },

  create: async (data: Record<string, string | number>) => {
    await delay(500);
    const subscriptions = getSubscriptions();
    const newSub: Subscription = {
      _id: Date.now().toString(),
      name: data.name as string,
      icon: data.icon as string,
      monthlyPrice: data.monthlyPrice as number,
      maxUsers: data.maxUsers as number,
    };
    subscriptions.push(newSub);
    localStorage.setItem('mockSubscriptions', JSON.stringify(subscriptions));
    return { data: newSub };
  },
};

export const mockGroupAPI = {
  getAll: async () => {
    await delay(300);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const groups = getGroups();
    return { data: groups.filter(g => g.members.some(m => m.userId === user.id)) };
  },

  create: async (data: { subscriptionId: string }) => {
    await delay(500);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const subscriptions = getSubscriptions();
    const subscription = subscriptions.find(s => s._id === data.subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    const shareAmount = subscription.monthlyPrice / subscription.maxUsers;
    
    const newGroup: Group = {
      _id: Date.now().toString(),
      subscription: {
        _id: subscription._id,
        name: subscription.name,
        icon: subscription.icon,
        monthlyPrice: subscription.monthlyPrice,
        maxUsers: subscription.maxUsers,
      },
      members: [
        {
          userId: user.id,
          userName: user.name,
          paidStatus: false,
          amount: shareAmount,
        },
      ],
      totalPrice: subscription.monthlyPrice,
      status: 'pending',
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Add mock members
    for (let i = 1; i < subscription.maxUsers; i++) {
      newGroup.members.push({
        userId: `mock-${i}`,
        userName: `User ${i + 1}`,
        paidStatus: false,
        amount: shareAmount,
      });
    }

    const groups = getGroups();
    groups.push(newGroup);
    setGroups(groups);

    return { data: newGroup };
  },

  getById: async (id: string) => {
    await delay(300);
    const groups = getGroups();
    const group = groups.find(g => g._id === id);
    if (!group) throw new Error('Group not found');
    return { data: group };
  },

  join: async (id: string) => {
    await delay(500);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const groups = getGroups();
    const groupIndex = groups.findIndex(g => g._id === id);
    if (groupIndex === -1) throw new Error('Group not found');

    const group = groups[groupIndex];
    if (group.members.some(m => m.userId === user.id)) {
      throw new Error('Already a member');
    }

    group.members.push({
      userId: user.id,
      userName: user.name,
      paidStatus: false,
      amount: group.totalPrice / group.subscription.maxUsers,
    });

    setGroups(groups);
    return { data: { message: 'Joined group successfully' } };
  },

  pay: async (id: string) => {
    await delay(500);
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const groups = getGroups();
    const groupIndex = groups.findIndex(g => g._id === id);
    if (groupIndex === -1) throw new Error('Group not found');

    const group = groups[groupIndex];
    const memberIndex = group.members.findIndex(m => m.userId === user.id);
    if (memberIndex === -1) throw new Error('Not a member');

    const member = group.members[memberIndex];
    if (member.paidStatus) throw new Error('Already paid');

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (users[userIndex].walletBalance < member.amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from wallet
    users[userIndex].walletBalance -= member.amount;
    setUsers(users);

    // Mark as paid
    group.members[memberIndex].paidStatus = true;

    // Check if all paid
    if (group.members.every(m => m.paidStatus)) {
      group.status = 'active';
    }

    setGroups(groups);

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'subscription_payment',
      amount: member.amount,
      description: `Payment for ${group.subscription.name}`,
      timestamp: new Date().toISOString(),
    };

    const transactions = getTransactions();
    transactions.push(transaction);
    setTransactions(transactions);

    return { data: { message: 'Payment successful' } };
  },
};