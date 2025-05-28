
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReminderRequest {
  reminder_id: string;
  reminder_type: 'sms' | 'whatsapp' | 'email';
  patient_phone?: string;
  patient_email?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reminder_id, reminder_type, patient_phone, patient_email, message }: ReminderRequest = await req.json();

    console.log(`Processing ${reminder_type} reminder:`, reminder_id);

    let deliveryStatus = 'sent';
    let errorMessage = null;

    try {
      switch (reminder_type) {
        case 'sms':
          // Simulate SMS sending (integrate with actual SMS provider)
          if (!patient_phone) {
            throw new Error('Patient phone number required for SMS');
          }
          console.log(`Sending SMS to ${patient_phone}: ${message}`);
          // Here you would integrate with Twilio, AWS SNS, or another SMS provider
          break;

        case 'whatsapp':
          // Simulate WhatsApp sending (integrate with WhatsApp Business API)
          if (!patient_phone) {
            throw new Error('Patient phone number required for WhatsApp');
          }
          console.log(`Sending WhatsApp to ${patient_phone}: ${message}`);
          // Here you would integrate with WhatsApp Business API
          break;

        case 'email':
          // Simulate email sending (integrate with Resend, SendGrid, etc.)
          if (!patient_email) {
            throw new Error('Patient email required for email');
          }
          console.log(`Sending email to ${patient_email}: ${message}`);
          // Here you would integrate with your email provider
          break;

        default:
          throw new Error(`Unsupported reminder type: ${reminder_type}`);
      }
    } catch (error) {
      console.error(`Failed to send ${reminder_type} reminder:`, error);
      deliveryStatus = 'failed';
      errorMessage = error.message;
    }

    // Update reminder status in database
    const { error: updateError } = await supabase
      .from('appointment_reminders')
      .update({
        sent_at: new Date().toISOString(),
        delivery_status: deliveryStatus,
        ...(errorMessage && { patient_response: errorMessage })
      })
      .eq('id', reminder_id);

    if (updateError) {
      console.error('Error updating reminder status:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminder_id,
        delivery_status: deliveryStatus,
        message: deliveryStatus === 'sent' 
          ? `${reminder_type.toUpperCase()} reminder sent successfully`
          : `Failed to send ${reminder_type} reminder: ${errorMessage}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-appointment-reminders function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
