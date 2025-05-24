
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const BookAppointmentModal = ({ isOpen, onClose, patientId }: BookAppointmentModalProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const doctors = [
    { id: 'doctor1', name: 'Dr. Sarah Johnson', specialty: 'General Medicine' },
    { id: 'doctor2', name: 'Dr. Michael Chen', specialty: 'Cardiology' },
    { id: 'doctor3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatology' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !doctorId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const appointmentDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          appointment_date: appointmentDateTime.toISOString(),
          notes,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully!"
      });
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Select your preferred date, time, and doctor for your appointment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="doctor">Doctor</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or notes for the doctor"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
