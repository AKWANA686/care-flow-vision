
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Gift } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FreeTrialModal = ({ isOpen, onClose }: FreeTrialModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const trialFeatures = [
    "Up to 100 patients",
    "Basic follow-up automation",
    "SMS & Email reminders",
    "Standard reporting",
    "Mobile app access",
    "24/7 support",
    "HIPAA compliance",
    "No setup fees"
  ];

  const handleStartTrial = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign up or log in to start your free trial',
          variant: 'default',
        });
        navigate('/auth');
        onClose();
        return;
      }

      // Create or update subscriber with free trial
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          email: user.email!,
          user_id: user.id,
          subscribed: true,
          subscription_tier: 'Free Trial',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (error) {
        console.error('Trial activation error:', error);
        throw error;
      }

      toast({
        title: 'Free Trial Activated! 🎉',
        description: 'Your 30-day free trial has started. Welcome to CareFlow Vision!',
      });

      // Redirect to appropriate dashboard based on user type
      const userType = localStorage.getItem('userType');
      if (userType === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
      
      onClose();
    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: 'Error',
        description: 'Failed to start your free trial. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Start Your Free Trial
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Get full access to CareFlow Vision for 30 days, completely free!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trial Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                <Star className="w-4 h-4 mr-1" />
                30-Day Free Trial
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-800">Free for 30 days</p>
              <p className="text-sm text-gray-600">No credit card required • Cancel anytime</p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">What's included in your trial:</h4>
            <div className="grid grid-cols-1 gap-2">
              {trialFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            size="lg"
            onClick={handleStartTrial}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Activating Trial...
              </div>
            ) : (
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Start My Free Trial
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By starting your trial, you agree to our Terms of Service and Privacy Policy.
            Your trial will automatically convert to a paid plan after 30 days unless cancelled.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeTrialModal;
