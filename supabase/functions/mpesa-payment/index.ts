import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  env: 'sandbox' | 'production';
}

class MpesaService {
  private config: MpesaConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: MpesaConfig) {
    this.config = config;
    this.baseUrl = config.env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const auth = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);

    try {
      const response = await fetch(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp();
    const str = this.config.shortcode + this.config.passkey + timestamp;
    return btoa(str);
  }

  async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
  ): Promise<{
    success: boolean;
    checkoutRequestId?: string;
    merchantRequestId?: string;
    error?: string;
  }> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();

      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: this.config.shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: this.config.shortcode,
            PhoneNumber: phoneNumber,
            CallBackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc,
          }),
        }
      );

      const data = await response.json();
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
      };
    } catch (error) {
      console.error('STK Push Error:', error);
      return {
        success: false,
        error: 'Failed to initiate STK push',
      };
    }
  }

  async checkTransactionStatus(checkoutRequestId: string): Promise<{
    success: boolean;
    status?: string;
    error?: string;
  }> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();

      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: this.config.shortcode,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
          }),
        }
      );

      const data = await response.json();
      const resultCode = data.ResultCode;
      const success = resultCode === 0;

      return {
        success,
        status: success ? 'completed' : 'failed',
        error: !success ? data.ResultDesc : undefined,
      };
    } catch (error) {
      console.error('Transaction Status Check Error:', error);
      return {
        success: false,
        error: 'Failed to check transaction status',
      };
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const mpesaService = new MpesaService({
      consumerKey: Deno.env.get('MPESA_CONSUMER_KEY') ?? '',
      consumerSecret: Deno.env.get('MPESA_CONSUMER_SECRET') ?? '',
      passkey: Deno.env.get('MPESA_PASSKEY') ?? '',
      shortcode: Deno.env.get('MPESA_SHORTCODE') ?? '',
      env: (Deno.env.get('MPESA_ENV') as 'sandbox' | 'production') ?? 'sandbox',
    });

    const { phoneNumber, amount, plan, userId, userType } = await req.json();

    if (!phoneNumber || !amount || !plan || !userId || !userType) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Format phone number to M-Pesa format (254XXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith('0')
      ? `254${phoneNumber.slice(1)}`
      : phoneNumber.startsWith('254')
      ? phoneNumber
      : `254${phoneNumber}`;

    // Initiate STK Push
    const stkResponse = await mpesaService.initiateSTKPush(
      formattedPhone,
      amount,
      `${userType}-${userId}`,
      `CareFlow Vision - ${plan} Plan`
    );

    if (!stkResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: stkResponse.error || 'Failed to initiate payment',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Record the transaction in Supabase
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        user_type: userType,
        amount,
        plan,
        status: 'pending',
        checkout_request_id: stkResponse.checkoutRequestId,
        merchant_request_id: stkResponse.merchantRequestId,
      })
      .select()
      .single();

    if (transactionError) {
      throw transactionError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment initiated successfully',
        checkoutRequestId: stkResponse.checkoutRequestId,
        merchantRequestId: stkResponse.merchantRequestId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
