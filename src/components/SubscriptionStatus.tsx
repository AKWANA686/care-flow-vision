
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, CreditCard, Calendar, Shield, CheckCircle } from 'lucide-react';

const SubscriptionStatus = () => {
  const [subscriptionData] = useState({
    plan: 'Premium',
    status: 'active',
    nextBilling: '2024-02-15',
    usage: {
      appointments: { used: 8, limit: 20 },
      videoCallMinutes: { used: 45, limit: 120 },
      storageGB: { used: 2.3, limit: 10 }
    }
  });

  const getUsagePercentage = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            Subscription
          </CardTitle>
          <Badge 
            variant={subscriptionData.status === 'active' ? 'default' : 'destructive'}
            className="flex items-center"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {subscriptionData.plan}
          </Badge>
        </div>
        <CardDescription>
          Manage your healthcare plan and usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Info */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Plan</span>
            <Badge variant="secondary">{subscriptionData.plan}</Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            Next billing: {subscriptionData.nextBilling}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            This Month's Usage
          </h4>
          
          {/* Appointments */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Appointments</span>
              <span className="text-gray-600">
                {subscriptionData.usage.appointments.used} / {subscriptionData.usage.appointments.limit}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(
                subscriptionData.usage.appointments.used,
                subscriptionData.usage.appointments.limit
              )} 
              className="h-2"
            />
          </div>

          {/* Video Call Minutes */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Video Call Minutes</span>
              <span className="text-gray-600">
                {subscriptionData.usage.videoCallMinutes.used} / {subscriptionData.usage.videoCallMinutes.limit}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(
                subscriptionData.usage.videoCallMinutes.used,
                subscriptionData.usage.videoCallMinutes.limit
              )} 
              className="h-2"
            />
          </div>

          {/* Storage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage</span>
              <span className="text-gray-600">
                {subscriptionData.usage.storageGB.used}GB / {subscriptionData.usage.storageGB.limit}GB
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(
                subscriptionData.usage.storageGB.used,
                subscriptionData.usage.storageGB.limit
              )} 
              className="h-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button className="w-full" variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Manage Billing
          </Button>
          <Button className="w-full" variant="outline">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
