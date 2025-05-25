
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScheduleFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleFollowupModal = ({ isOpen, onClose }: ScheduleFollowupModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const patients = [
    { id: 'P-001234', name: 'Sarah Johnson' },
    { id: 'P-001235', name: 'Michael Chen' },
    { id: 'P-001236', name: 'Emma Davis' },
    { id: 'P-001237', name: 'John Smith' },
  ];

  const appointmentTypes = [
    'Follow-up consultation',
    'Routine checkup',
    'Lab results review',
    'Medication review',
    'Treatment evaluation',
    'Post-surgery follow-up'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleScheduleAppointment = async () => {
    if (!selectedPatient || !appointmentType || !appointmentDate || !appointmentTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: selectedPatient,
          doctor_id: 'doc-123', // In a real app, this would be the current doctor's ID
          appointment_date: appointmentDateTime,
          duration_minutes: parseInt(duration),
          notes: `${appointmentType}${notes ? ` - ${notes}` : ''}`,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Follow-up appointment scheduled successfully!"
      });
      
      // Reset form
      setSelectedPatient('');
      setAppointmentType('');
      setAppointmentDate('');
      setAppointmentTime('');
      setDuration('30');
      setNotes('');
      onClose();
      
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPatient('');
    setAppointmentType('');
    setAppointmentDate('');
    setAppointmentTime('');
    setDuration('30');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Follow-up Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule a follow-up appointment for your patient. They will receive a confirmation notification.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="patient">Select Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {patient.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="appointmentType">Appointment Type</Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="appointmentDate">Date</Label>
            <Input
              id="appointmentDate"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <Label htmlFor="appointmentTime">Time</Label>
            <Select value={appointmentTime} onValueChange={setAppointmentTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes for the appointment..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleScheduleAppointment} disabled={isLoading} className="flex-1">
            {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleFollowupModal;
