import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface SubscriptionCardProps {
  id: string;
  name: string;
  icon: string;
  monthlyPrice: number;
  maxUsers: number;
  availableSlots?: number;
  onJoin?: () => void;
}

export default function SubscriptionCard({
  name,
  icon,
  monthlyPrice,
  maxUsers,
  availableSlots = maxUsers,
  onJoin,
}: SubscriptionCardProps) {
  const pricePerUser = (monthlyPrice / maxUsers).toFixed(2);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-4xl">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">
              KSh {pricePerUser}/month per user
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Price</span>
            <span className="font-medium">KSh {monthlyPrice}/month</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Available Slots
            </span>
            <Badge variant={availableSlots > 0 ? 'default' : 'secondary'}>
              {availableSlots}/{maxUsers}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4">
        <Button
          onClick={onJoin}
          disabled={availableSlots === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {availableSlots > 0 ? 'Join Group' : 'Full'}
        </Button>
      </CardFooter>
    </Card>
  );
}