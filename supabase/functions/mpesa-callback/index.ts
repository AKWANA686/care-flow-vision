
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const callbackData = await req.json();
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const merchantRequestId = stkCallback.MerchantRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    let mpesaReceiptNumber = null;
    let phoneNumber = null;
    let amount = null;

    // Extract metadata if payment was successful
    if (resultCode === 0 && stkCallback.CallbackMetadata) {
      const metadata = stkCallback.CallbackMetadata.Item;
      
      for (const item of metadata) {
        switch (item.Name) {
          case 'MpesaReceiptNumber':
            mpesaReceiptNumber = item.Value;
            break;
          case 'PhoneNumber':
            phoneNumber = item.Value;
            break;
          case 'Amount':
            amount = item.Value;
            break;
        }
      }
    }

    // Update transaction status
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({
        status: resultCode === 0 ? 'completed' : 'failed',
        result_code: resultCode,
        result_desc: resultDesc,
        mpesa_receipt_number: mpesaReceiptNumber,
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', checkoutRequestId)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw error;
    }

    // If payment successful, update user subscription
    if (resultCode === 0 && transaction) {
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // 1 month subscription

      await supabase
        .from('subscribers')
        .upsert({
          user_id: transaction.user_id,
          email: '', // Will be filled from user profile
          subscribed: true,
          subscription_tier: transaction.plan,
          subscription_end: subscriptionEndDate.toISOString(),
          updated_at: new Date().toISOString(),
        });

      console.log('Subscription updated successfully for user:', transaction.user_id);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Callback processed successfully',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error processing callback:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Callback processing failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
