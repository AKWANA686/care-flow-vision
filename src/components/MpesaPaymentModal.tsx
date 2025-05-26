
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Phone, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: { name: string; price: string };
  onSuccess: () => void;
}

interface TransactionRecord {
  status: string;
  result_desc?: string;
}

const MpesaPaymentModal = ({ isOpen, onClose, plan, onSuccess }: MpesaPaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid Kenyan number
    if (cleaned.startsWith('254') && cleaned.length === 12) {
      return true;
    }
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return true;
    }
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return true;
    }
    
    return false;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('254')) {
      return '+' + cleaned;
    }
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return '+254' + cleaned;
    }
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+254' + cleaned.slice(1);
    }
    
    return phone;
  };

  const extractAmount = (priceString: string) => {
    // Extract number from "Ksh. 2,000" format
    const match = priceString.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    setIsPolling(true);
    const maxAttempts = 30; // Poll for 2.5 minutes (30 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        // Query the transactions table directly using raw SQL to avoid type issues
        const { data: transaction, error } = await supabase
          .rpc('get_transaction_status', { checkout_id: checkoutRequestId });

        if (error) {
          console.error('Error checking transaction status:', error);
          // Fallback: try direct table query
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('transactions' as any)
            .select('status, result_desc')
            .eq('checkout_request_id', checkoutRequestId)
            .single();

          if (fallbackError) throw fallbackError;
          
          const transactionData = fallbackData as TransactionRecord;
          handleTransactionResult(transactionData);
          return;
        }

        const transactionData = transaction as TransactionRecord;
        handleTransactionResult(transactionData);

      } catch (error) {
        console.error('Error polling payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          setIsPolling(false);
          toast({
            title: 'Payment Timeout',
            description: 'Please check your M-Pesa messages and contact support if payment was deducted.',
            variant: 'destructive',
          });
        }
      }
    };

    const handleTransactionResult = (transaction: TransactionRecord) => {
      if (transaction.status === 'completed') {
        setIsPolling(false);
        toast({
          title: 'Payment Successful!',
          description: 'Your subscription has been activated.',
        });
        onSuccess();
        onClose();
        return;
      }

      if (transaction.status === 'failed') {
        setIsPolling(false);
        toast({
          title: 'Payment Failed',
          description: transaction.result_desc || 'Payment was not completed.',
          variant: 'destructive',
        });
        return;
      }

      // Continue polling if still pending
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 5000); // Poll every 5 seconds
      } else {
        setIsPolling(false);
        toast({
          title: 'Payment Timeout',
          description: 'Please check your M-Pesa messages and contact support if payment was deducted.',
          variant: 'destructive',
        });
      }
    };

    poll();
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid Kenyan phone number (e.g., 0722000000)',
        variant: 'destructive',
      });
      return;
    }

    const userType = localStorage.getItem('userType') as 'patient' | 'doctor';
    const userId = userType === 'patient' 
      ? localStorage.getItem('patientId') 
      : localStorage.getItem('licenseNumber');

    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to continue with payment.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const amount = extractAmount(plan.price);
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phoneNumber: formattedPhone,
          amount: amount,
          plan: plan.name,
          userId: userId,
          userType: userType,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Payment Request Sent',
          description: 'Please check your phone and enter your M-Pesa PIN to complete the payment.',
        });

        // Start polling for payment status
        pollPaymentStatus(data.checkoutRequestId);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters except +
    value = value.replace(/[^\d+]/g, '');
    
    // Auto-format the number
    if (value.startsWith('0') && value.length <= 10) {
      setPhoneNumber(value);
    } else if (value.startsWith('7') && value.length <= 9) {
      setPhoneNumber(value);
    } else if (value.startsWith('+254') && value.length <= 13) {
      setPhoneNumber(value);
    } else if (value.startsWith('254') && value.length <= 12) {
      setPhoneNumber('+' + value);
    } else if (value.length === 0) {
      setPhoneNumber('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span>M-Pesa Payment</span>
          </DialogTitle>
          <DialogDescription>
            Pay for your {plan.name} subscription using M-Pesa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-800 dark:text-green-300">Plan:</span>
              <span className="text-green-900 dark:text-green-200">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-medium text-green-800 dark:text-green-300">Amount:</span>
              <span className="text-lg font-bold text-green-900 dark:text-green-200">{plan.price}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>M-Pesa Phone Number</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0722000000 or +254722000000"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="text-lg"
              disabled={isLoading || isPolling}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enter your M-Pesa registered phone number
            </p>
          </div>

          {isPolling && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-blue-800 dark:text-blue-300 font-medium">
                  Waiting for payment confirmation...
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Please complete the payment on your phone
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isPolling}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading || isPolling || !phoneNumber}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Pay with M-Pesa'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPaymentModal;
