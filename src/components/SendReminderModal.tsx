
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Mail, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendReminderModal = ({ isOpen, onClose }: SendReminderModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reminderType, setReminderType] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const patients = [
    { id: 'P-001234', name: 'Sarah Johnson' },
    { id: 'P-001235', name: 'Michael Chen' },
    { id: 'P-001236', name: 'Emma Davis' },
    { id: 'P-001237', name: 'John Smith' },
  ];

  const reminderTypes = [
    'Appointment reminder',
    'Medication refill',
    'Follow-up visit',
    'Lab work reminder',
    'Annual checkup',
    'Vaccination due',
    'Custom reminder'
  ];

  const handleSendReminder = async () => {
    if (!selectedPatient || !reminderType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const reminderMessage = customMessage || `Reminder: ${reminderType}${reminderDate ? ` scheduled for ${reminderDate}` : ''}`;
      
      const { error } = await supabase
        .from('medical_records')
        .insert({
          patient_id: selectedPatient,
          title: `Reminder: ${reminderType}`,
          description: reminderMessage,
          diagnosis: 'REMINDER'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder sent to patient successfully!"
      });
      
      setSelectedPatient('');
      setReminderType('');
      setReminderDate('');
      setCustomMessage('');
      onClose();
      
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPatient('');
    setReminderType('');
    setReminderDate('');
    setCustomMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Send Reminder to Patient
          </DialogTitle>
          <DialogDescription>
            Send an automated reminder to help patients stay on track with their healthcare.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
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

          <div>
            <Label htmlFor="reminderType">Reminder Type</Label>
            <Select value={reminderType} onValueChange={setReminderType}>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                {reminderTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reminderDate">Date (Optional)</Label>
            <Input
              id="reminderDate"
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message for the reminder..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSendReminder} disabled={isLoading} className="flex-1">
            {isLoading ? 'Sending...' : 'Send Reminder'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendReminderModal;
