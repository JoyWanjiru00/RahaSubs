import { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { walletAPI } from '@/utils/api';
import { toast } from 'sonner';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Wallet() {
  const { user, updateUser } = useAuthStore();
  const { transactions, setTransactions } = useWalletStore();
  const [topupAmount, setTopupAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await walletAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await walletAPI.topup(amount);
      const newBalance = (user?.walletBalance || 0) + amount;
      updateUser({ walletBalance: newBalance });
      toast.success(`Successfully added KSh ${amount.toFixed(2)} to your wallet`);
      setTopupAmount('');
      setTopupOpen(false);
      fetchTransactions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Top-up failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > (user?.walletBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      await walletAPI.withdraw(amount);
      const newBalance = (user?.walletBalance || 0) - amount;
      updateUser({ walletBalance: newBalance });
      toast.success(`Successfully withdrew KSh ${amount.toFixed(2)}`);
      setWithdrawAmount('');
      setWithdrawOpen(false);
      fetchTransactions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowUpCircle className="text-green-600" />;
      case 'withdrawal':
        return <ArrowDownCircle className="text-orange-600" />;
      case 'subscription_payment':
        return <WalletIcon className="text-purple-600" />;
      default:
        return <WalletIcon />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'topup':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-orange-600';
      case 'subscription_payment':
        return 'text-purple-600';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and view transaction history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardHeader>
                <CardTitle className="text-white/90">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-4xl font-bold mb-2">
                      KSh {user?.walletBalance?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-white/80 text-sm">Available Balance</p>
                  </div>

                  <div className="space-y-2">
                    <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
                      <DialogTrigger asChild>
                        <Button variant="secondary" className="w-full">
                          <ArrowUpCircle className="mr-2 h-4 w-4" />
                          Top Up
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Top Up Wallet</DialogTitle>
                          <DialogDescription>
                            Add funds to your wallet (simulated for demo)
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="topup-amount">Amount (KSh)</Label>
                            <Input
                              id="topup-amount"
                              type="number"
                              placeholder="1000"
                              value={topupAmount}
                              onChange={(e) => setTopupAmount(e.target.value)}
                            />
                          </div>
                          <div className="flex space-x-2">
                            {[500, 1000, 2000, 5000].map((amount) => (
                              <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                onClick={() => setTopupAmount(amount.toString())}
                              >
                                {amount}
                              </Button>
                            ))}
                          </div>
                          <Button
                            onClick={handleTopup}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Confirm Top Up'
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                      <DialogTrigger asChild>
                        <Button variant="secondary" className="w-full">
                          <ArrowDownCircle className="mr-2 h-4 w-4" />
                          Withdraw
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Withdraw Funds</DialogTitle>
                          <DialogDescription>
                            Withdraw funds from your wallet (simulated for demo)
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="withdraw-amount">Amount (KSh)</Label>
                            <Input
                              id="withdraw-amount"
                              type="number"
                              placeholder="500"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Available: KSh {user?.walletBalance?.toFixed(2) || '0.00'}
                          </p>
                          <Button
                            onClick={handleWithdraw}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Confirm Withdrawal'
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <WalletIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-semibold capitalize">
                              {transaction.type.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                              {new Date(transaction.timestamp).toLocaleTimeString()}
                            </p>
                            {transaction.description && (
                              <p className="text-xs text-muted-foreground">
                                {transaction.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'withdrawal' || transaction.type === 'subscription_payment'
                              ? '-'
                              : '+'}
                            KSh {transaction.amount.toFixed(2)}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}