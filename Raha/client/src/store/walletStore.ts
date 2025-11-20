import { create } from 'zustand';

interface Transaction {
  id: string;
  type: 'topup' | 'withdrawal' | 'subscription_payment';
  amount: number;
  timestamp: string;
  description: string;
}

interface WalletState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
}));