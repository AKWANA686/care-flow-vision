import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { Body: { stkCallback } } = await req.json();

    if (!stkCallback) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid callback data',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // Update transaction status in Supabase
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: ResultCode === 0 ? 'completed' : 'failed',
        result_code: ResultCode,
        result_desc: ResultDesc,
      })
      .eq('checkout_request_id', CheckoutRequestID);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Callback processed successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Callback Error:', error);
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
