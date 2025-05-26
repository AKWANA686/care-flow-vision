import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { initiateMpesaPayment, checkPaymentStatus } from '@/services/payment';
import { useAuth } from '@/hooks/useAuth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
  };
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      setError('Please log in to make a payment');
      return;
    }

    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
      setError('Please enter a valid M-Pesa phone number (format: 254XXXXXXXXX)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract amount from price string (remove "Ksh." and convert to number)
      const amount = parseInt(plan.price.replace('Ksh.', '').replace(',', '').trim());

      const response = await initiateMpesaPayment(
        phoneNumber,
        amount,
        plan.name,
        user.id,
        user.user_metadata.user_type
      );

      if (response.success) {
        setCheckoutRequestId(response.checkoutRequestId!);
        // Start polling for payment status
        pollPaymentStatus(response.checkoutRequestId!);
      } else {
        setError(response.error || 'Failed to initiate payment');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (requestId: string) => {
    const maxAttempts = 12; // 1 minute total (5 seconds * 12)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await checkPaymentStatus(requestId);

        if (response.success) {
          onSuccess();
          onClose();
          return;
        }

        if (response.error) {
          setError(response.error);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        } else {
          setError('Payment status check timed out. Please verify your payment status.');
        }
      } catch (err) {
        setError('Failed to check payment status');
        console.error(err);
      }
    };

    checkStatus();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Complete M-Pesa Payment
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254XXXXXXXXX"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your M-Pesa registered phone number
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>Amount: {plan.price}</p>
              <p>Plan: {plan.name}</p>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay with M-Pesa'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
