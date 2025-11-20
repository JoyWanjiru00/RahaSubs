import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import SubscriptionCard from '@/components/ui/SubscriptionCard';
import { Input } from '@/components/ui/input';
import { subscriptionAPI, groupAPI } from '@/utils/api';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

interface Subscription {
  _id: string;
  name: string;
  icon: string;
  monthlyPrice: number;
  maxUsers: number;
}

export default function Browse() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredSubs(
        subscriptions.filter((sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredSubs(subscriptions);
    }
  }, [searchQuery, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getAll();
      setSubscriptions(response.data);
      setFilteredSubs(response.data);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (subscription: Subscription) => {
    if (!isAuthenticated) {
      toast.error('Please login to join a group');
      navigate('/login');
      return;
    }

    setSelectedSub(subscription);
  };

  const confirmJoinGroup = async () => {
    if (!selectedSub) return;

    try {
      const response = await groupAPI.create({
        subscriptionId: selectedSub._id,
      });
      toast.success('Successfully joined the group!');
      navigate(`/groups/${response.data._id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join group';
      toast.error(errorMessage);
    } finally {
      setSelectedSub(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Subscriptions</h1>
          <p className="text-muted-foreground">Find and join groups to start saving</p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Subscription Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading subscriptions...</p>
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subscriptions found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubs.map((sub) => (
              <SubscriptionCard
                key={sub._id}
                id={sub._id}
                name={sub.name}
                icon={sub.icon}
                monthlyPrice={sub.monthlyPrice}
                maxUsers={sub.maxUsers}
                availableSlots={sub.maxUsers}
                onJoin={() => handleJoinGroup(sub)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Join Confirmation Dialog */}
      <Dialog open={!!selectedSub} onOpenChange={() => setSelectedSub(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join {selectedSub?.name} Group</DialogTitle>
            <DialogDescription>
              You'll be joining a shared subscription group for {selectedSub?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center text-6xl py-4">
              {selectedSub?.icon}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Price:</span>
                <span className="font-semibold">KSh {selectedSub?.monthlyPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Users:</span>
                <span className="font-semibold">{selectedSub?.maxUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Share:</span>
                <span className="font-semibold text-lg text-purple-600">
                  KSh {selectedSub ? (selectedSub.monthlyPrice / selectedSub.maxUsers).toFixed(2) : 0}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setSelectedSub(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={confirmJoinGroup}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Join Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}