
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone } from 'lucide-react';
import MpesaPaymentModal from './MpesaPaymentModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: { name: string; price: string };
  onSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'card' | null>(null);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);

  const handleMpesaPayment = () => {
    setSelectedMethod('mpesa');
    setIsMpesaModalOpen(true);
  };

  const handleCardPayment = () => {
    // TODO: Implement Stripe integration
    alert('Card payment coming soon!');
  };

  const handleMpesaClose = () => {
    setIsMpesaModalOpen(false);
    setSelectedMethod(null);
  };

  const handleMpesaSuccess = () => {
    setIsMpesaModalOpen(false);
    setSelectedMethod(null);
    onSuccess();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !isMpesaModalOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select your preferred payment method for {plan.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan:</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-medium">Amount:</span>
                <span className="text-lg font-bold">{plan.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleMpesaPayment}
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">M-Pesa</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pay with your mobile money</div>
                </div>
              </Button>

              <Button
                onClick={handleCardPayment}
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                disabled
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Coming soon</div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={handleMpesaClose}
        plan={plan}
        onSuccess={handleMpesaSuccess}
      />
    </>
  );
};

export default PaymentModal;
