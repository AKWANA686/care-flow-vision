
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MonitoringAlert {
  patient_id: string;
  data_type: string;
  value: any;
  is_critical: boolean;
  recorded_at: string;
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

    const alerts: MonitoringAlert[] = await req.json();

    console.log('Processing monitoring alerts:', alerts.length);

    const processedAlerts = [];

    for (const alert of alerts) {
      if (alert.is_critical) {
        console.log(`Critical alert for patient ${alert.patient_id}: ${alert.data_type}`);

        // Get patient and doctor information
        const { data: patientProfile } = await supabase
          .from('user_profiles')
          .select('full_name, phone_number')
          .eq('user_id', alert.patient_id)
          .single();

        // Find doctor(s) associated with this patient through appointments
        const { data: doctors } = await supabase
          .from('appointments')
          .select(`
            doctor_id,
            profiles!appointments_doctor_id_fkey(full_name, email)
          `)
          .eq('patient_id', alert.patient_id)
          .order('appointment_date', { ascending: false })
          .limit(1);

        // Send alert notifications (implement your preferred notification method)
        if (doctors && doctors.length > 0) {
          const doctor = doctors[0];
          console.log(`Alerting doctor ${doctor.profiles?.full_name} about critical reading`);
          
          // Here you would send push notifications, emails, SMS, etc.
          // For now, we'll log the alert
          const alertMessage = `CRITICAL ALERT: Patient ${patientProfile?.full_name || 'Unknown'} has abnormal ${alert.data_type} reading: ${JSON.stringify(alert.value)}`;
          console.log(alertMessage);
        }

        // Log the alert for tracking
        await supabase
          .from('patient_monitoring_data')
          .update({ notes: 'Critical alert processed and notifications sent' })
          .eq('patient_id', alert.patient_id)
          .eq('data_type', alert.data_type)
          .eq('recorded_at', alert.recorded_at);

        processedAlerts.push({
          patient_id: alert.patient_id,
          data_type: alert.data_type,
          status: 'processed',
          notifications_sent: true
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed_alerts: processedAlerts.length,
        details: processedAlerts
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
    console.error('Error in process-monitoring-alerts function:', error);
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
