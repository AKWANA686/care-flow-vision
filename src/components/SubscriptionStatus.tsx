
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Crown, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Subscription {
  id: string;
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string;
  created_at: string;
}

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const userType = localStorage.getItem('userType');
      const userId = userType === 'patient' 
        ? localStorage.getItem('patientId') 
        : localStorage.getItem('licenseNumber');

      if (!userId) return;

      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !subscription.subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-gray-500" />
            <span>No Active Subscription</span>
          </CardTitle>
          <CardDescription>
            You don't have an active subscription. Subscribe to access premium features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/#pricing'}>
            View Pricing Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const expired = isExpired(subscription.subscription_end);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {expired ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <span>Subscription Status</span>
        </CardTitle>
        <CardDescription>
          Your current subscription details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Plan:</span>
          <Badge variant={expired ? 'destructive' : 'default'} className="flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>{subscription.subscription_tier}</span>
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          <Badge variant={expired ? 'destructive' : 'default'}>
            {expired ? 'Expired' : 'Active'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">End Date:</span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className={expired ? 'text-red-500' : 'text-green-600'}>
              {formatDate(subscription.subscription_end)}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Subscribed Since:</span>
          <span>{formatDate(subscription.created_at)}</span>
        </div>

        {expired && (
          <div className="pt-4 border-t">
            <p className="text-sm text-red-600 mb-3">
              Your subscription has expired. Renew to continue accessing premium features.
            </p>
            <Button onClick={() => window.location.href = '/#pricing'}>
              Renew Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
