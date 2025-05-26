import { supabase } from '@/lib/supabase';

interface PaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  error?: string;
}

interface Transaction {
  id: string;
  user_id: string;
  user_type: 'patient' | 'doctor';
  amount: number;
  plan: string;
  status: 'pending' | 'completed' | 'failed';
  checkout_request_id?: string;
  merchant_request_id?: string;
  created_at: string;
}

export const initiateMpesaPayment = async (
  phoneNumber: string,
  amount: number,
  plan: string,
  userId: string,
  userType: 'patient' | 'doctor'
): Promise<PaymentResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('mpesa-payment', {
      body: {
        phoneNumber,
        amount,
        plan,
        userId,
        userType
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Payment Error:', error);
    return {
      success: false,
      message: 'Failed to initiate payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const checkPaymentStatus = async (
  checkoutRequestId: string
): Promise<PaymentResponse> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('status, result_code, result_desc')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (error) throw error;

    return {
      success: data.status === 'completed',
      message: data.status === 'completed' ? 'Payment successful' : 'Payment pending',
      error: data.status === 'failed' ? data.result_desc : undefined
    };
  } catch (error) {
    console.error('Status Check Error:', error);
    return {
      success: false,
      message: 'Failed to check payment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const recordTransaction = async (
  transaction: Omit<Transaction, 'id' | 'created_at'>
): Promise<Transaction> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Transaction Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to record transaction');
  }
};
