
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bell, Send, MessageSquare, Mail, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  patient_name: string;
  status: string;
}

interface ReminderConfig {
  id: string;
  reminder_type: string;
  enabled: boolean;
  timing_before_appointment: number;
  frequency: number;
  custom_message: string;
}

const AppointmentReminderSystem = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState([]);
  const [reminderConfigs, setReminderConfigs] = useState<ReminderConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newReminderType, setNewReminderType] = useState('');
  const [timingHours, setTimingHours] = useState(24);
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    fetchReminders();
    fetchReminderConfigs();
    
    // Set up real-time subscriptions
    const appointmentChannel = supabase
      .channel('appointment-reminders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointment_reminders'
      }, () => {
        fetchReminders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentChannel);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_id,
          appointment_date,
          status,
          profiles!appointments_patient_id_fkey(full_name)
        `)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      const formattedAppointments = data?.map(apt => ({
        id: apt.id,
        patient_id: apt.patient_id,
        appointment_date: apt.appointment_date,
        status: apt.status,
        patient_name: apt.profiles?.full_name || 'Unknown Patient'
      })) || [];

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive"
      });
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_reminders')
        .select(`
          *,
          appointments(
            appointment_date,
            profiles!appointments_patient_id_fkey(full_name)
          )
        `)
        .order('scheduled_time', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchReminderConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('reminder_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminderConfigs(data || []);
    } catch (error) {
      console.error('Error fetching reminder configs:', error);
    }
  };

  const scheduleReminder = async (appointmentId: string, reminderType: string) => {
    setIsLoading(true);
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) throw new Error('Appointment not found');

      const scheduledTime = new Date(appointment.appointment_date);
      scheduledTime.setHours(scheduledTime.getHours() - timingHours);

      const { error } = await supabase
        .from('appointment_reminders')
        .insert({
          appointment_id: appointmentId,
          reminder_type: reminderType,
          scheduled_time: scheduledTime.toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${reminderType.toUpperCase()} reminder scheduled successfully`
      });

      fetchReminders();
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast({
        title: "Error",
        description: "Failed to schedule reminder",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveReminderConfig = async () => {
    if (!newReminderType) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reminder_configurations')
        .insert({
          doctor_id: user.id,
          reminder_type: newReminderType,
          timing_before_appointment: timingHours,
          custom_message: customMessage,
          enabled: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder configuration saved"
      });

      fetchReminderConfigs();
      setNewReminderType('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return <Phone className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Appointment Reminder System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Schedule Reminder */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule New Reminder</h3>
              
              <div className="space-y-3">
                <div>
                  <Label>Reminder Type</Label>
                  <Select value={newReminderType} onValueChange={setNewReminderType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hours Before Appointment</Label>
                  <Input
                    type="number"
                    value={timingHours}
                    onChange={(e) => setTimingHours(Number(e.target.value))}
                    min="1"
                    max="168"
                  />
                </div>

                <div>
                  <Label>Custom Message (Optional)</Label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter custom reminder message..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={saveReminderConfig}
                  disabled={isLoading || !newReminderType}
                  className="w-full"
                >
                  Save Configuration
                </Button>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.patient_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.appointment_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => scheduleReminder(appointment.id, 'sms')}
                        disabled={isLoading}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => scheduleReminder(appointment.id, 'whatsapp')}
                        disabled={isLoading}
                      >
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => scheduleReminder(appointment.id, 'email')}
                        disabled={isLoading}
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reminders.map((reminder: any) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getReminderTypeIcon(reminder.reminder_type)}
                  <div>
                    <p className="font-medium">
                      {reminder.appointments?.profiles?.full_name || 'Unknown Patient'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Scheduled: {new Date(reminder.scheduled_time).toLocaleString()}
                    </p>
                    {reminder.sent_at && (
                      <p className="text-xs text-gray-400">
                        Sent: {new Date(reminder.sent_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(reminder.delivery_status)}
                  <Badge variant={
                    reminder.delivery_status === 'delivered' ? 'default' :
                    reminder.delivery_status === 'failed' ? 'destructive' :
                    reminder.delivery_status === 'confirmed' ? 'secondary' : 'outline'
                  }>
                    {reminder.delivery_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentReminderSystem;
