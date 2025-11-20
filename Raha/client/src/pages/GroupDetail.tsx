import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { groupAPI } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ArrowLeft, Users, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface GroupMember {
  userId: string;
  userName: string;
  paidStatus: boolean;
  amount: number;
}

interface Group {
  _id: string;
  subscription: {
    name: string;
    icon: string;
    monthlyPrice: number;
  };
  members: GroupMember[];
  totalPrice: number;
  status: string;
  nextRenewalDate: string;
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroup();
    }
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await groupAPI.getById(id!);
      setGroup(response.data);
    } catch (error) {
      toast.error('Failed to load group details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!group || !user) return;

    const userMember = group.members.find((m) => m.userId === user.id);
    if (!userMember) {
      toast.error('You are not a member of this group');
      return;
    }

    // Check if already paid before making API call
    if (userMember.paidStatus) {
      toast.info('You have already paid for this subscription');
      return;
    }

    if (user.walletBalance < userMember.amount) {
      toast.error('Insufficient wallet balance. Please top up first.');
      navigate('/wallet');
      return;
    }

    setPaying(true);
    try {
      await groupAPI.pay(group._id);
      
      // Update wallet balance
      const newBalance = user.walletBalance - userMember.amount;
      updateUser({ walletBalance: newBalance });

      toast.success('Payment successful!');
      
      // Refresh group data to show updated payment status
      await fetchGroup();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      // If error is "Already paid", refresh the group data to sync UI
      if (errorMessage.includes('Already paid')) {
        toast.info('You have already paid for this subscription');
        await fetchGroup();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  const userMember = group.members.find((m) => m.userId === user?.id);
  const paidMembers = group.members.filter((m) => m.paidStatus).length;
  const totalMembers = group.members.length;
  const paymentProgress = (paidMembers / totalMembers) * 100;
  const daysUntilRenewal = Math.ceil(
    (new Date(group.nextRenewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="text-6xl">{group.subscription.icon}</div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{group.subscription.name}</h1>
                    <div className="flex items-center space-x-4">
                      <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                        {group.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {totalMembers} members
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                    <p className="text-2xl font-bold">KSh {group.totalPrice}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Your Share</p>
                    <p className="text-2xl font-bold text-purple-600">
                      KSh {userMember?.amount.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Next Renewal</p>
                    <p className="text-2xl font-bold">{daysUntilRenewal} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Group Payment Progress</span>
                    <span className="font-semibold">
                      {paidMembers}/{totalMembers} paid
                    </span>
                  </div>
                  <Progress value={paymentProgress} className="h-2" />
                </div>

                {userMember && !userMember.paidStatus && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-900 mb-3">
                      You haven't paid your share yet. The group will activate once all members pay.
                    </p>
                    <Button
                      onClick={handlePayment}
                      disabled={paying}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      {paying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay KSh ${userMember.amount.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                )}

                {userMember && userMember.paidStatus && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-900">
                      <CheckCircle className="h-5 w-5" />
                      <p className="text-sm font-semibold">You've paid your share!</p>
                    </div>
                    <p className="text-xs text-green-800 mt-2">
                      Payment of KSh {userMember.amount.toFixed(2)} has been deducted from your wallet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle>Group Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                            {member.userName?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {member.userName || 'User'}
                            {member.userId === user?.id && (
                              <span className="text-xs text-muted-foreground ml-2">(You)</span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            KSh {member.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {member.paidStatus ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Renewal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Next Renewal</p>
                    <p className="font-semibold">
                      {new Date(group.nextRenewalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Countdown</p>
                  <p className="text-2xl font-bold">{daysUntilRenewal} days</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Payments are processed automatically</p>
                <p>• All members must pay before renewal</p>
                <p>• You'll receive reminders before due date</p>
                <p>• Each member can only pay once per cycle</p>
                <Button variant="outline" className="w-full mt-4">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}