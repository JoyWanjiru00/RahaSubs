import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { groupAPI } from '@/utils/api';
import { Wallet, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Group {
  _id: string;
  subscription: {
    name: string;
    icon: string;
  };
  members: Array<{
    userId: string;
    paidStatus: boolean;
    amount: number;
  }>;
  status: string;
  nextRenewalDate: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  // Active subscriptions = groups where YOU have paid (regardless of group status)
  const activeGroups = groups.filter((g) => {
    const userMember = g.members.find((m) => m.userId === user?.id);
    return userMember && userMember.paidStatus;
  });

  // Pending payments = groups where YOU haven't paid yet
  const pendingPayments = groups.filter((g) => {
    const userMember = g.members.find((m) => m.userId === user?.id);
    return userMember && !userMember.paidStatus;
  });

  const totalSavings = activeGroups.reduce((acc, group) => {
    const userMember = group.members.find((m) => m.userId === user?.id);
    return acc + (userMember?.amount || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your subscriptions and wallet</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {user?.walletBalance?.toFixed(2) || '0.00'}</div>
              <Link to="/wallet">
                <Button variant="link" className="px-0 text-purple-600">
                  Manage Wallet <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGroups.length}</div>
              <p className="text-xs text-muted-foreground">Subscriptions you've paid for</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {totalSavings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Your share of group costs</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-orange-900">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayments.map((group) => {
                  const userMember = group.members.find((m) => m.userId === user?.id);
                  return (
                    <div key={group._id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{group.subscription.icon}</div>
                        <div>
                          <p className="font-semibold">{group.subscription.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(group.nextRenewalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">KSh {userMember?.amount.toFixed(2)}</p>
                          <Badge variant="destructive">Unpaid</Badge>
                        </div>
                        <Link to={`/groups/${group._id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                            Pay Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Subscriptions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : activeGroups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't paid for any subscriptions yet</p>
                <Link to="/browse">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Browse Subscriptions
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGroups.map((group) => {
                  const userMember = group.members.find((m) => m.userId === user?.id);
                  const allPaid = group.members.every((m) => m.paidStatus);
                  const paidCount = group.members.filter((m) => m.paidStatus).length;
                  
                  return (
                    <Link key={group._id} to={`/groups/${group._id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{group.subscription.icon}</div>
                          <div>
                            <p className="font-semibold">{group.subscription.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {paidCount}/{group.members.length} members paid
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">KSh {userMember?.amount.toFixed(2)}/month</p>
                          <Badge variant={allPaid ? 'default' : 'secondary'}>
                            {allPaid ? 'Active' : 'Waiting for others'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/browse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Plus className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Join a Group</h3>
                    <p className="text-sm text-muted-foreground">Browse available subscriptions</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/wallet">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Wallet className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Top Up Wallet</h3>
                    <p className="text-sm text-muted-foreground">Add funds to your account</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}