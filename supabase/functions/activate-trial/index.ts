
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ACTIVATE-TRIAL] ${step}${detailsStr}`);
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Trial activation started");

    // Create Supabase client with service role key for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user already has an active subscription
    const { data: existingSubscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingSubscriber?.subscribed) {
      logStep("User already has active subscription");
      return new Response(JSON.stringify({
        success: false,
        message: "You already have an active subscription",
        subscription: existingSubscriber
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Set trial end date (30 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    // Create or update subscriber record with trial
    const { data: subscriber, error: subscriberError } = await supabaseClient
      .from('subscribers')
      .upsert({
        email: user.email,
        user_id: user.id,
        subscribed: true,
        subscription_tier: 'Free Trial',
        subscription_end: trialEndDate.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select()
      .single();

    if (subscriberError) {
      logStep("Error creating subscriber", { error: subscriberError });
      throw subscriberError;
    }

    // Create a transaction record for the trial
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        user_type: 'trial',
        amount: 0,
        plan: 'Free Trial',
        status: 'completed',
        created_at: new Date().toISOString(),
      });

    if (transactionError) {
      logStep("Error creating transaction record", { error: transactionError });
      // Don't throw here as the main subscription was created successfully
    }

    logStep("Trial activated successfully", { 
      userId: user.id, 
      trialEnd: trialEndDate.toISOString() 
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Free trial activated successfully",
      subscription: subscriber,
      trial_end: trialEndDate.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in activate-trial", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
