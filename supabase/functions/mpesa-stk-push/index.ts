
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  plan: string;
  userId: string;
  userType: 'patient' | 'doctor';
}

const MPESA_CONFIG = {
  CONSUMER_KEY: 'GBdAuJNjJSSARkLyia2EnQob0jSF2sGQFUj2bHslieGPwwNv',
  SECRET: 'qMQN2n9f6w1soQ3OvfeWIDr83rAHP65kJdmuAGzjM1AgEDtCsj8Usb9gNzd1C5GG',
  PAYBILL: '174379',
  PASSKEY: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  CALLBACK_URL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
  SANDBOX_URL: 'https://sandbox.safaricom.co.ke',
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

    const { phoneNumber, amount, plan, userId, userType }: STKPushRequest = await req.json();

    console.log('Initiating STK Push for:', { phoneNumber, amount, plan, userId });

    // Format phone number to 254 format
    const formattedPhone = phoneNumber.startsWith('+254') 
      ? phoneNumber.slice(1) 
      : phoneNumber.startsWith('254') 
        ? phoneNumber 
        : '254' + phoneNumber.slice(1);

    // Get access token
    const auth = btoa(`${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.SECRET}`);
    const tokenResponse = await fetch(`${MPESA_CONFIG.SANDBOX_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    
    // Generate password
    const password = btoa(`${MPESA_CONFIG.PAYBILL}${MPESA_CONFIG.PASSKEY}${timestamp}`);

    // STK Push request
    const stkPushData = {
      BusinessShortCode: MPESA_CONFIG.PAYBILL,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.PAYBILL,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.CALLBACK_URL,
      AccountReference: `CareFlow-${userId}`,
      TransactionDesc: `CareFlow Vision ${plan} Subscription`,
    };

    const stkResponse = await fetch(`${MPESA_CONFIG.SANDBOX_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    });

    const stkResult = await stkResponse.json();
    console.log('STK Push Result:', stkResult);

    if (stkResult.ResponseCode === '0') {
      // Store transaction in database
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          user_type: userType,
          amount: amount,
          plan: plan,
          status: 'pending',
          checkout_request_id: stkResult.CheckoutRequestID,
          merchant_request_id: stkResult.MerchantRequestID,
          phone_number: formattedPhone,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'STK push sent successfully. Please check your phone.',
        checkoutRequestId: stkResult.CheckoutRequestID,
        merchantRequestId: stkResult.MerchantRequestID,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } else {
      throw new Error(stkResult.errorMessage || 'STK push failed');
    }

  } catch (error) {
    console.error('Error in STK push:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Payment initiation failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
